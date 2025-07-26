// app.js — The Brave University Panel del Oráculo
(async () => {
  console.log("🧠 Dashboard listo para recibir datos reales...");

  if (!window.supabase) {
    console.error("❌ La librería de Supabase no está disponible.");
    return;
  }

  const supabaseClient = supabase.createClient(
    "https://ueqfpnwzmcliwjphpcjw.supabase.co",
    "sb_publishable_4xZfiDfAsxnmE4o6IMOqrw_D4_ZO_Vd"
  );

  window.addEventListener("message", async (event) => {
    if (event.data?.type === "BRAVE_AVIATOR_DATA") {
      const { multiplier, timestamp } = event.data.data;
      try {
        const { error } = await supabaseClient
          .from("operaciones")
          .insert([
            {
              multiplicador: multiplier,
              timesta: new Date(timestamp).toISOString()
            }
          ]);
        if (error) throw error;
        console.log(`✅ Multiplicador guardado: ${multiplier}x`);
      } catch (err) {
        console.error("❌ Error guardando en Supabase:", err.message);
      }
    }
  });
})();
