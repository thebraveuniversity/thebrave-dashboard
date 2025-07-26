const SUPABASE_URL = 'https://ueqfpnwzmcliwjphpcjw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_4xZfiDfAsxnmE4o6IMOqrw_D4_ZO_Vd';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

window.onload = async () => {
  const cont = document.getElementById('tradingViewChart');
  const chart = LightweightCharts.createChart(cont, {
    layout: { background: { color: '#000' }, textColor: '#fff' },
    grid: { vertLines: { color: '#222' }, horzLines: { color: '#222' } }
  });
  const series = chart.addCandlestickSeries({
    upColor: '#FF4500', downColor: '#B22222',
    borderUpColor: '#FF4500', borderDownColor: '#B22222',
    wickColor: '#888'
  });

  let lastTS = 0;
  function addPoint(m, ts) {
    series.update({ time: Math.floor(ts / 1000), open: m, high: m, low: m, close: m });
  }

  // Cargar histórico desde Supabase
  const { data } = await supabase.from('operaciones')
    .select('multiplicador,timestamp')
    .order('timestamp', { ascending: true })
    .limit(100);
  data.forEach(op => {
    const ts = new Date(op.timestamp).getTime();
    lastTS = Math.max(lastTS, ts);
    addPoint(op.multiplicador, ts);
  });

  // Escuchar mensajes del casino
  window.addEventListener('message', msg => {
    if (msg.data?.type === 'BRAVE_AVIATOR_DATA') {
      const { multiplier, timestamp } = msg.data.data;
      if (timestamp > lastTS) {
        lastTS = timestamp;
        addPoint(multiplier, timestamp);
        supabase.from('operaciones').insert({ multiplicador: multiplier, timestamp: new Date(timestamp).toISOString() });
        console.log('✅ Multiplicador guardado desde BC:', multiplier + 'x');
      }
    }
  });

  // Datos de prueba si no llega el real en 10s
  setTimeout(() => {
    setInterval(() => {
      const test = { multiplier: +(1 + Math.random()*9).toFixed(2), timestamp: Date.now() };
      window.postMessage({ type: 'BRAVE_AVIATOR_DATA', data: test }, '*');
    }, 5000);
  }, 10000);
};
