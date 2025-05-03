function analisisLaporanOtomatis(isiLaporan) {
  const prompt = `Anda adalah sistem klasifikasi laporan masyarakat.\n` +
                 `Format output: [Kategori] | [Ringkasan 10 kata] | [Prioritas: Rendah/Sedang/Tinggi]\n` +
                 `Laporan: "${isiLaporan}"`;
  const response = kirimKeGemini(prompt);
  return response.split("|").map(s => s.trim());
}
