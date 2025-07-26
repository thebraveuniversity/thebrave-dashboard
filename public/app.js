// app.js — The Brave University Panel del Oráculo

console.log("🧠 Dashboard listo para recibir datos reales...");

// Configuración Supabase
const SUPABASE_URL = 'https://ueqfpnwzmcliwjphpcjw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_4xZfiDfAsxnmE4o6IMOqrw_D4_ZO_Vd';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Escuchar mensajes desde BC.Game
window.addEventListener('message', async event => {
  if (event.data?.type === 'BRAVE_AVIATOR_DATA') {
    const { multiplier, timestamp } = event.data.data;

    try {
      const { error } = await supabase
        .from('operaciones')
        .insert([
          {
            multiplicador: multiplier,
            timesta: new Date(timestamp).toISOString()
          }
        ]);
      if (error) throw error;

      console.log(`✅ Multiplicador guardado en Supabase (tabla operaciones): ${multiplier}x`);
    } catch (err) {
      console.error('❌ Error guardando en Supabase:', err.message);
    }
  }
});
