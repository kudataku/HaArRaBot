/******************************
 * FUNGSI UTILITAS UMUM
 ******************************/

// Cari data user berdasarkan nomor WhatsApp
function cariUser(nomor, sheetUser) {
  const data = sheetUser.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === nomor) {
      return data[i];
    }
  }
  return null;
}

// Buat ID tiket unik berdasarkan tanggal dan angka acak
function generateIdTiket() {
  const today = Utilities.formatDate(new Date(), "GMT+7", "yyyyMMdd");
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `TIK-${today}-${random}`;
}

// Buat link upload berdasarkan ID Tiket dan Nomor Pengguna
function generateUploadLink(idTiket, nomorPengguna) {
  return `${CONFIG.UPLOAD_PAGE_URL}?tiket=${idTiket}&user=${nomorPengguna}`;
}

// Validasi apakah string adalah NIK yang valid (16 digit angka)
function isValidNIK(nik) {
  return /^\d{16}$/.test(nik);
}
