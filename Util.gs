const SHEET_ID = "PASTE_SHEET_ID_KAMU";

function generateIdTiket() {
  const today = Utilities.formatDate(new Date(), "GMT+7", "yyyyMMdd");
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `TIK-${today}-${random}`;
}

function generateUploadLink(idTiket, senderNumber) {
  const scriptUrl = ScriptApp.getService().getUrl();
  return `${scriptUrl}/upload.html?tiket=${idTiket}&user=${senderNumber}`;
}

function kirimKeGemini(prompt) {
  // Dummy AI response (simulasi saja)
  return "Infrastruktur | Jalan rusak parah di desa | Tinggi";
}
