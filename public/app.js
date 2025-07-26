console.log("🧠 Brave Dashboard listo para recibir datos...");

const supabaseUrl = "https://ueqfpnwzmcliwjphpcjw.supabase.co";
const supabaseKey = "sb-publishable-4xZfiDfAsxnmE4o6IMOqrw_D4_ZO_Vd";
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

const chartContainer = document.getElementById("tradingViewChart");
const chart = LightweightCharts.createChart(chartContainer, {
  layout: { background: { color: "#000" }, textColor: "#fff" },
  grid: { vertLines: { color: "#222" }, horzLines: { color: "#222" } }
});
const series = chart.addLineSeries({ color: "#FF4500" });

window.addEventListener("message", async (event) => {
  if (event.data?.type === "BRAVE_AVIATOR_DATA") {
    const { multiplier, timestamp } = event.data.data;
    try {
      const timeISO = new Date(timestamp).toISOString();
      const { error } = await supabaseClient
        .from("operaciones")
        .insert([{ multiplicador: multiplier, timesta: timeISO }]);

      if (error) {
        console.error("❌ Error Supabase:", error.message);
      } else {
        console.log(`✅ Multiplicador guardado en Supabase: ${multiplier}`);
        const timeSec = Math.floor(timestamp / 1000);
        series.update({ time: timeSec, value: multiplier });
      }
    } catch (err) {
      console.error("❌ Error general:", err.message);
    }
  }
});

