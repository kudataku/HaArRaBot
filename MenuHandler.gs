/*********************
 * PENANGAN MENU UTAMA
 *********************/

function tanganiMenuUtama(pesan, pengirim, namaPengirim) {
  const sheetUser = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_USERS);
  const sheetReport = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_REPORTS);

  pesan = pesan.toLowerCase();

  if (pesan.startsWith("daftar#")) {
    return daftarPengguna(pesan, pengirim, sheetUser);
  } else if (pesan.startsWith("lapor#")) {
    return buatLaporan(pengirim, namaPengirim, pesan, sheetUser, sheetReport);
  } else if (pesan.startsWith("cek#")) {
    return cekStatusLaporan(pengirim, pesan, sheetReport);
  } else if (pesan === "menu") {
    return tampilkanMenuUtama();
  } else {
    return "❓ Perintah tidak dikenali. Ketik *menu* untuk melihat opsi.";
  }
}

function tampilkanMenuUtama() {
  return "📱 *MENU UTAMA*\n\n" +
         "1. *Daftar*: daftar#NIK#Nama#Alamat\n" +
         "2. *Lapor Masalah*: lapor#isi_laporan\n" +
         "3. *Cek Laporan*: cek#ID_TIKET\n" +
         "4. *Menu*: Menampilkan menu ini kembali\n\n" +
         "Contoh: daftar#3201234567890001#Andi#Jalan Melati No. 1";
}
