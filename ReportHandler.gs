function buatLaporan(senderNumber, senderName, senderMessage, sheetUser, sheetReport) {
  const userData = cariUser(senderNumber, sheetUser);
  if (!userData) return "❌ Anda belum terdaftar. Ketik *daftar#NIK#Nama#Alamat*.";

  const parts = senderMessage.split("#");
  const isiLaporan = parts[1]?.trim();
  if (!isiLaporan) return "❌ Isi laporan tidak boleh kosong.";

  const [kategori, ringkasan, prioritas] = analisisLaporanOtomatis(isiLaporan);
  const idTiket = generateIdTiket();
  const linkUpload = generateUploadLink(idTiket, senderNumber);

  sheetReport.appendRow([
    new Date(), idTiket, senderNumber, userData[2], isiLaporan, "", "Baru", kategori, prioritas, ringkasan
  ]);

  return `📌 *LAPORAN DITERIMA* 📌\n\n` +
         `🆔 ID Tiket: *${idTiket}*\n` +
         `📋 Kategori: *${kategori}*\n` +
         `⚠️ Prioritas: *${prioritas}*\n` +
         `📅 Tanggal: *${Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy")}*\n\n` +
         `📎 *Upload bukti (foto/video)*:\n${linkUpload}\n\n` +
         `Gunakan ID Tiket untuk *cek status* laporan Anda.`;
}

function cekStatusLaporan(senderNumber, senderMessage, sheetReport) {
  const parts = senderMessage.split("#");
  const idTiket = parts[1]?.trim();
  if (!idTiket) return "❌ Format salah. Gunakan: *cek#ID_TIKET*";

  const data = sheetReport.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === idTiket && data[i][2] === senderNumber) {
      return `🔍 *DETAIL LAPORAN* 🔍\n\n` +
             `🆔 ID: *${data[i][1]}*\n` +
             `📋 Status: *${data[i][6]}*\n` +
             `📌 Kategori: *${data[i][7]}*\n` +
             `⚠️ Prioritas: *${data[i][8]}*\n` +
             `📅 Tanggal: *${Utilities.formatDate(data[i][0], "GMT+7", "dd/MM/yyyy")}*\n\n` +
             `📝 Catatan: *${data[i][9] || "-"}*`;
    }
  }

  return "❌ Tiket tidak ditemukan atau bukan milik Anda.";
}
