/******************************
 * PENANGANAN LAPORAN MASYARAKAT
 ******************************/

function buatLaporan(senderNumber, senderName, senderMessage, sheetUser, sheetReport) {
  const userData = cariUser(senderNumber, sheetUser);
  if (!userData) {
    return "❌ Anda belum terdaftar. Ketik *daftar#NIK#Nama#Alamat* untuk mendaftar.";
  }

  const parts = senderMessage.split("#");
  const isiLaporan = parts[1]?.trim();

  if (!isiLaporan) {
    return "❌ Format salah. Gunakan: *lapor#isi laporan*";
  }

  const idTiket = generateIdTiket();
  const [kategori, ringkasan, prioritas] = analisisLaporanOtomatis(isiLaporan);
  const uploadLink = generateUploadLink(idTiket, senderNumber);

  // Simpan laporan ke sheet
  sheetReport.appendRow([
    new Date(),         // Timestamp
    idTiket,            // ID Tiket
    senderNumber,       // Nomor WhatsApp
    userData[2],        // Nama
    isiLaporan,         // Isi laporan
    "",                 // Link lampiran, kosong dulu
    "Baru",             // Status awal
    kategori,           // Kategori AI
    prioritas,          // Prioritas AI
    ringkasan           // Ringkasan AI
  ]);

  return `📌 *LAPORAN DITERIMA* 📌\n\n` +
         `🆔 ID Tiket: *${idTiket}*\n` +
         `📋 Kategori: *${kategori}*\n` +
         `⚠️ Prioritas: *${prioritas}*\n` +
         `📅 Tanggal: *${Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy")}*\n\n` +
         `📎 Upload bukti foto/video:\n${uploadLink}\n\n` +
         `Gunakan ID Tiket ini untuk *cek status*: *cek#${idTiket}*`;
}

function cekStatusLaporan(senderNumber, senderMessage, sheetReport) {
  const parts = senderMessage.split("#");
  if (parts.length < 2) {
    return "❌ Format salah. Gunakan: *cek#ID_TIKET*";
  }

  const idTiket = parts[1].trim();
  const data = sheetReport.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === idTiket && data[i][2] === senderNumber) {
      return `🔍 *STATUS LAPORAN* 🔍\n\n` +
             `🆔 ID Tiket: *${data[i][1]}*\n` +
             `📋 Status: *${data[i][6]}*\n` +
             `📎 Lampiran: ${data[i][5] || "Tidak ada"}\n` +
             `📌 Kategori: *${data[i][7]}*\n` +
             `⚠️ Prioritas: *${data[i][8]}*\n` +
             `📅 Tanggal: *${Utilities.formatDate(data[i][0], "GMT+7", "dd/MM/yyyy")}*\n\n` +
             `📝 Ringkasan: *${data[i][9] || "-"}*`;
    }
  }

  return "❌ Tiket tidak ditemukan atau bukan milik Anda.";
}

function generateIdTiket() {
  const date = Utilities.formatDate(new Date(), "GMT+7", "yyyyMMdd");
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `TIK-${date}-${random}`;
}

function generateUploadLink(idTiket, userNumber) {
  return `${CONFIG.UPLOAD_PAGE_URL}?tiket=${idTiket}&user=${userNumber}`;
}
