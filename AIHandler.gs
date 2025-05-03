/******************************
 * INTEGRASI ANALISIS AI GEMINI
 ******************************/

function analisisLaporanOtomatis(isiLaporan) {
  const prompt = `Klasifikasikan laporan masyarakat berikut. Keluarkan output dalam format:\n\n` +
                 `[Kategori] | [Ringkasan 10 kata] | [Prioritas: Rendah/Sedang/Tinggi]\n\n` +
                 `Laporan: "${isiLaporan}"`;

  const hasil = kirimKeGemini(prompt);

  // Jika format tidak sesuai, beri default
  if (!hasil.includes("|")) {
    return ["Umum", "Laporan tidak dapat dianalisis", "Sedang"];
  }

  const parts = hasil.split("|").map(p => p.trim());
  return [
    parts[0] || "Umum",
    parts[1] || "Tidak ada ringkasan",
    parts[2] || "Sedang"
  ];
}

function kirimKeGemini(prompt) {
  const apiKey = CONFIG.GEMINI_API_KEY;
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey;

  const payload = {
    contents: [{
      parts: [{ text: prompt }]
    }]
  };

  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const json = JSON.parse(response.getContentText());

    const hasil = json.candidates?.[0]?.content?.parts?.[0]?.text || "Umum | Tidak bisa dianalisis | Sedang";
    return hasil;
  } catch (e) {
    Logger.log("Gagal kirim ke Gemini: " + e);
    return "Umum | Gagal analisis | Sedang";
  }
}
