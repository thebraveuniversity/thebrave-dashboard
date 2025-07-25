// app.js — 📜 Script de Control de Torres en The Brave University

// 🛡️ Aquí colocas tus llaves mágicas reales de Supabase
const SUPABASE_URL = 'https://ueqfpnwzmcliwjphpcjw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlcWZwbnd6bWNsaXdqcGhwY2p3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzQ4MzkzMiwiZXhwIjoyMDY5MDU5OTMyfQ.x4OFwBCGx4oWiNLdDmmgqUs9mAbZ8DSgbC_JfAV_PHM';

// 📡 Invocar al Oráculo de Datos (Supabase)
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ⏳ Al amanecer (cuando se carga la página)
window.onload = async () => {
  const torre = document.getElementById('tradingViewChart');
  const mapa = LightweightCharts.createChart(torre, {
    layout: { background: { color: '#000' }, textColor: '#fff' },
    grid: {
      vertLines: { color: '#222' },
      horzLines: { color: '#222' }
    }
  });

  const torresSeries = mapa.addCandlestickSeries({
    upColor: '#FF4500', // Naranja 🔥
    downColor: '#B22222', // Rojo 🟥
    borderUpColor: '#FF4500',
    borderDownColor: '#B22222',
    wickColor: '#888'
  });

  // 🧾 Registro de torres históricas desde Supabase
  const { data } = await supabase.from('operaciones')
    .select('multiplicador, timestamp')
    .order('timestamp', { ascending: true })
    .limit(50);

  data.forEach(operacion => {
    torresSeries.update({
      time: Math.floor(new Date(operacion.timestamp).getTime() / 1000),
      open: operacion.multiplicador,
      high: operacion.multiplicador,
      low: operacion.multiplicador,
      close: operacion.multiplicador
    });
  });

  // 🌩️ Escuchar las nuevas torres que caen en la batalla (datos nuevos)
  supabase.channel('public:operaciones')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'operaciones'
    }, evento => {
      const { multiplicador, timestamp } = evento.new;
      torresSeries.update({
        time: Math.floor(new Date(timestamp).getTime() / 1000),
        open: multiplicador,
        high: multiplicador,
        low: multiplicador,
        close: multiplicador
      });
    })
    .subscribe();
};
