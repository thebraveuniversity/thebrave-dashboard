// app.js

console.log("🧠 Brave Dashboard listo para recibir datos...");

// Supabase config
const SUPABASE_URL = 'https://<TU-PROYECTO>.supabase.co';
const SUPABASE_KEY = '<TU-CLAVE>';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 🔥 Escuchar datos reales desde navegador (BC.Game)
window.addEventListener("message", async (event) => {
  if (event.data?.type === "BRAVE_AVIATOR_DATA") {
    const { multiplier, timestamp } = event.data.data;

    try {
      const { error } = await supabase
        .from("multipliers")
        .insert([{ multiplier, timestamp }]);

      if (error) throw error;

      console.log(`✅ Multiplicador guardado en Supabase: ${multiplier}`);
    } catch (err) {
      console.error("❌ Error al guardar en Supabase:", err.message);
    }
  }
});
