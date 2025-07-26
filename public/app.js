// 🎯 Supabase Setup
const supabase = window.supabase.createClient(
  'https://ueqfpnwzmcliwjphpcjw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlcWZwbnd6bWNsaXdqcHBjamp3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5NjA5Njc5MiwiZXhwIjoxOTExNjcyNzkyfQ.1-EQZIlDZSL7o13kH7xSS_q7QJhuhZkMRMeobTqMWBc'
);

// 📊 Gráfico
let chart, series;
let lastTimestamp = 0;

function setupChart() {
  const chartContainer = document.getElementById('tradingViewChart');
  chart = LightweightCharts.createChart(chartContainer, {
    layout: { background: { color: '#000' }, textColor: '#fff' },
    grid: { vertLines: { color: '#222' }, horzLines: { color: '#222' } },
    timeScale: { timeVisible: true }
  });

  series = chart.addLineSeries({
    color: '#FFD700',
    lineWidth: 2,
    priceLineVisible: true
  });
}

// 🔁 Cargar datos
async function fetchData() {
  const { data, error } = await supabase
    .from('operaciones')
    .select('multiplicador, timestamp')
    .gt('timestamp', new Date(lastTimestamp + 1).toISOString())
    .order('timestamp', { ascending: true });

  if (data && data.length) {
    const formatted = data.map(entry => ({
      time: Math.floor(new Date(entry.timestamp).getTime() / 1000),
      value: entry.multiplicador
    }));
    series.setData(formatted);
    lastTimestamp = new Date(data[data.length - 1].timestamp).getTime();
  }
}

// 🕊️ Inicializar
window.addEventListener('load', () => {
  setupChart();
  fetchData();
  setInterval(fetchData, 5000);
});

// 🔌 Recibir datos desde BC.Game
window.addEventListener('message', async event => {
  if (event.data?.type === 'BRAVE_AVIATOR_DATA') {
    const { multiplier, timestamp } = event.data.data;
    await supabase.from('operaciones').insert([{
      multiplicador: multiplier,
      timestamp: new Date(timestamp).toISOString()
    }]);
    console.log('✅ Multiplicador guardado en Supabase:', multiplier);
  }
});

// 🧪 Generador de datos de prueba (desactiva si ya conectas con BC.game)
setInterval(() => {
  const fakeMultiplier = parseFloat((1 + Math.random() * 20).toFixed(2));
  const testData = {
    multiplier: fakeMultiplier,
    timestamp: Date.now()
  };
  window.postMessage({ type: 'BRAVE_AVIATOR_DATA', data: testData }, '*');
  console.log('🎮 Datos de prueba enviados:', fakeMultiplier + 'x');
}, 10000);
