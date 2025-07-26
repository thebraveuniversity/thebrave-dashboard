// app.js — Script mágico para tu dashboard The Brave University
const SUPABASE_URL = 'https://ueqfpnwzmcliwjphpcjw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_4xZfiDfAsxnmE4o6IMOqrw_D4_ZO_Vd';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Configuración gráfica y tema
window.onload = async () => {
  const torre = document.getElementById('tradingViewChart');
  const mapa = LightweightCharts.createChart(torre, {
    layout: { background: { color: '#000' }, textColor: '#fff' },
    grid: {
      vertLines: { color: '#222' },
      horzLines: { color: '#222' }
    }
  });
  const series = mapa.addCandlestickSeries({
    upColor: '#FF4500',
    downColor: '#B22222',
    borderUpColor: '#FF4500',
    borderDownColor: '#B22222',
    wickColor: '#888'
  });

  let lastTimestamp = 0;
  // Función para dibujar datos a color según multiplicador
  function colorByMultiplier(m) {
    if (m >= 10) return '#FF00FF';
    if (m >= 2) return '#800080';
    return '#0000FF';
  }
  function addPoint(m, ts) {
    series.update({
      time: Math.floor(ts / 1000),
      open: m, high: m, low: m, close: m
    });
  }

  // 👉 Carga inicial de operaciones
  const { data } = await supabase.from('operaciones')
    .select('multiplicador, timestamp')
    .order('timestamp', { ascending: true })
    .limit(100);
  data.forEach(op => {
    lastTimestamp = Math.max(lastTimestamp, new Date(op.timestamp).getTime());
    addPoint(op.multiplicador, new Date(op.timestamp).getTime());
  });

  // 🎯 Escuchar datos reales via postMessage
  window.addEventListener('message', msg => {
    if (msg.data?.type === 'BRAVE_AVIATOR_DATA') {
      const { multiplier, timestamp } = msg.data.data;
      if (timestamp > lastTimestamp) {
        lastTimestamp = timestamp;
        addPoint(multiplier, timestamp);
        console.log('✅ Capturado:', multiplier + 'x');
      }
    }
  });

  // 🧪 Datos de prueba si no llega nada real
  setTimeout(() => {
    setInterval(() => {
      const test = {
        multiplier: +(1 + Math.random() * 9).toFixed(2),
        timestamp: Date.now()
      };
      window.postMessage({ type: 'BRAVE_AVIATOR_DATA', data: test }, '*');
      console.log('🎮 Datos de prueba enviados:', test.multiplier + 'x');
    }, 5000);
  }, 10000);
};
