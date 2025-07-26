console.log("🧠 Brave Dashboard listo para recibir datos...");

window.addEventListener("load", () => {
  if (!window.supabase) {
    console.error("❌ La librería Supabase no está disponible en window.supabase");
    return;
  }

  const supabaseClient = window.supabase.createClient(
    "https://ueqfpnwzmcliwjphpcjw.supabase.co",
    "sb-publishable_4xZfiDfAsxnmE4o6IMOqrw_D4_ZO_Vd"
  );

  const chartContainer = document.getElementById("tradingViewChart");
  const chart = LightweightCharts.createChart(chartContainer, {
    layout: { background: { color: "#000" }, textColor: "#fff" },
    grid: { vertLines: { color: "#222" }, horzLines: { color: "#222" } }
  });
  const series = chart.addLineSeries({ color: "#FF4500" });

  window.addEventListener("message", async event => {
    if (event.data?.type === "BRAVE_AVIATOR_DATA") {
      const { multiplier, timestamp } = event.data.data;
      try {
        const { error } = await supabaseClient.from("operaciones").insert([{
          multiplicador: multiplier,
          timestamp: new Date(timestamp).toISOString()
        }]);

        if (error) {
          console.error("❌ Error Supabase:", error.message);
        } else {
          console.log(`✅ Multiplicador guardado: ${multiplier}x`);
          series.update({
            time: Math.floor(timestamp / 1000),
            value: multiplier
          });
        }
      } catch (err) {
        console.error("❌ Error inesperado:", err.message);
      }
    }
  });
});
