/*********************
 * ENTRY POINT UTAMA
 *********************/

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const senderNumber = data.sender;
  const senderName = data.senderName;
  const message = data.message?.trim();

  const sheetUser = SpreadsheetApp.getActive().getSheetByName(NAMA_SHEET_USER);
  const sheetReport = SpreadsheetApp.getActive().getSheetByName(NAMA_SHEET_LAPORAN);

  if (!sheetUser || !sheetReport) {
    return ContentService.createTextOutput("Sheet tidak ditemukan.");
  }

  const balasan = tanganiPesan(senderNumber, senderName, message, sheetUser, sheetReport);
  return ContentService.createTextOutput(balasan);
}

function tanganiPesan(senderNumber, senderName, message, sheetUser, sheetReport) {
  const pesan = message.toLowerCase();
  if (pesan.startsWith("daftar#")) {
    return prosesPendaftaran(senderNumber, senderName, message, sheetUser);
  } else if (pesan.startsWith("lapor#")) {
    return buatLaporan(senderNumber, senderName, message, sheetUser, sheetReport);
  } else if (pesan.startsWith("cek#")) {
    return cekStatusLaporan(senderNumber, message, sheetReport);
  } else {
    return tampilkanMenu();
  }
}
