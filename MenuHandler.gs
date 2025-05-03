function handleMessage(senderNumber, senderName, senderMessage, sheetUser, sheetReport) {
  const text = senderMessage.trim().toLowerCase();

  if (text.startsWith("daftar#")) {
    return daftarUser(senderNumber, senderMessage, sheetUser);
  } else if (text === "menu") {
    return getMenu();
  } else if (text.startsWith("lapor#")) {
    return buatLaporan(senderNumber, senderName, senderMessage, sheetUser, sheetReport);
  } else if (text.startsWith("cek#")) {
    return cekStatusLaporan(senderNumber, senderMessage, sheetReport);
  } else {
    return "🤖 Ketik *menu* untuk melihat daftar perintah yang tersedia.";
  }
}

function getMenu() {
  return (
    "📋 *MENU LAYANAN* 📋\n\n" +
    "1. *daftar#NIK#Nama#Alamat*\n" +
    "   Untuk pendaftaran pertama kali.\n\n" +
    "2. *lapor#Isi laporan Anda*\n" +
    "   Untuk membuat laporan baru.\n\n" +
    "3. *cek#ID_TIKET*\n" +
    "   Untuk mengecek status laporan Anda.\n\n" +
    "Pastikan sudah *terdaftar* sebelum melapor!"
  );
}
