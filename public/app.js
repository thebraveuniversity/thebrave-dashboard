console.log("🧠 Brave Dashboard listo para recibir datos...");

window.addEventListener("load", () => {
  if (typeof supabase === "undefined" || !supabase.createClient) {
    return console.error("❌ Supabase no está preparado en `window.supabase`");
  }

  const supabaseClient = supabase.createClient(
    "https://ueqfpnwzmcliwjphpcjw.supabase.co",
    "sb-publishable_4xZfiDfAsxnmE4o6IMOqrw_D4_ZO_Vd"
  );

  const chartContainer = document.getElementById("tradingViewChart");
  const chart = LightweightCharts.createChart(chartContainer, {
    layout: { background: { color: "#000" }, textColor: "#fff" },
    grid: { vertLines: { color: "#222" }, horzLines: { color: "#222" } }
  });
  const series = chart.addLineSeries({ color: "#FF4500", lineWidth: 2 });

  window.addEventListener("message", async ev => {
    if (ev.data?.type === "BRAVE_AVIATOR_DATA") {
      const { multiplier, timestamp } = ev.data.data;
      const timeISO = new Date(timestamp).toISOString();

      const { error } = await supabaseClient.from("operaciones").insert([{ multiplicador: multiplier, timestamp: timeISO }]);
      if (error) {
        return console.error("❌ Supabase error:", error.message);
      }

      console.log(`✅ Multiplicador guardado: ${multiplier}x`);
      series.update({ time: Math.floor(timestamp / 1000), value: multiplier });
    }
  });
});
