// app.js — The Brave University Dashboard

(async () => {
  console.log("🧠 Dashboard listo para recibir datos reales...");

  // Esperar que la librería supabase esté disponible
  if (!window.supabase) {
    console.error("❌ Supabase no cargó correctamente.");
    return;
  }

  const supabase = supabase.createClient(
    "https://ueqfpnwzmcliwjphpcjw.supabase.co",
    "sb_publishable_4xZfiDfAsxnmE4o6IMOqrw_D4_ZO_Vd"
  );

  window.addEventListener("message", async (event) => {
    if (event.data?.type === "BRAVE_AVIATOR_DATA") {
      const { multiplier, timestamp } = event.data.data;
      try {
        const { error } = await supabase
          .from("operaciones")
          .insert([
            {
              multiplicador: multiplier,
              timesta: new Date(timestamp).toISOString(),
            },
          ]);
        if (error) throw error;
        console.log(
          `✅ Multiplicador guardado en Supabase (operaciones): ${multiplier}x`
        );
      } catch (err) {
        console.error("❌ Error guardando en Supabase:", err.message);
      }
    }
  });
})();
