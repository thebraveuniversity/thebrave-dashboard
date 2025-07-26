(async () => {
  console.log("🧠 Dashboard listo para recibir datos reales...");

  if (!window.supabase) {
    console.error("❌ La librería supabase no está disponible.");
    return;
  }

  const supabase = supabase.createClient(
    "https://ueqfpnwzmcliwjphpcjw.supabase.co",
    "sb_publishable_4xZfiDfAsxnmE4o6IMOqrw_D4_ZO_Vd"
  );

  const chartContainer = document.getElementById("tradingViewChart");
  const chart = LightweightCharts.createChart(chartContainer, {
    layout: { background: { color: "#000" }, textColor: "#fff" },
    grid: { vertLines: { color: "#222" }, horzLines: { color: "#222" } }
  });
  const series = chart.addLineSeries({
    color: "#FF4500"
  });

  window.addEventListener("message", async (event) => {
    if (event.data?.type === "BRAVE_AVIATOR_DATA") {
      const { multiplier, timestamp } = event.data.data;
      try {
        await supabase.from("operaciones").insert([{ multiplicador: multiplier, timesta: new Date(timestamp).toISOString() }]);
        console.log(`✅ Multiplicador guardado: ${multiplier}x`);
        const timeSec = Math.floor(timestamp / 1000);
        series.update({ time: timeSec, value: multiplier });
      } catch (err) {
        console.error("❌ Error guardando:", err.message);
      }
    }
  });
})();
