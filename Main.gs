function doPost(e) {
  const msg = JSON.parse(e.postData.contents);
  const senderNumber = msg.wa_number;
  const senderName = msg.wa_name;
  const senderMessage = msg.wa_text;

  const sheetUser = SpreadsheetApp.openById(SHEET_ID).getSheetByName("Users");
  const sheetReport = SpreadsheetApp.openById(SHEET_ID).getSheetByName("Reports");

  return ContentService.createTextOutput(handleMessage(senderNumber, senderName, senderMessage, sheetUser, sheetReport));
}
