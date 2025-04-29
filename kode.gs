/*********************
 * KONFIGURASI AWAL
 *********************/
const CONFIG = {
  GEMINI_API_KEY: 'AIzaSyCEDgOSMTrZqPVgkunvXZT55-KhHO6z_BU', // Ganti dengan API key Anda
  GEMINI_MODEL: 'gemini-2.0-flash-lite-001',
  DRIVE_FOLDER_ID: '1hEIAGbobWPniOfF3icB3emh4wppUfp8N', // Folder untuk menyimpan media
  SHEET: {
    USERS: 'Users',
    REPORTS: 'Reports',
    LOGS: 'Logs'
  }
};

/*********************
 * FUNGSI UTAMA (WEBHOOK)
 *********************/
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const { senderNumber, senderName, senderMessage, mediaUrl, mimeType } = payload;
    
    // Log request
    logRequest(payload);
    
    let response;
    
    // Handle media (gambar/video)
    if (mediaUrl && (mimeType.startsWith("image/") || mimeType.startsWith("video/"))) {
      const mediaInfo = handleMediaUpload(senderNumber, mediaUrl, mimeType);
      response = {
        message: `📷 *Media berhasil diterima!*\n\nSilakan ketik laporan Anda dengan format:\n*lapor#keluhan_anda*\n\nContoh: *lapor#Jalan berlubang di depan sekolah*`
      };
    } 
    // Handle pesan teks
    else {
      const lowerMsg = senderMessage.toLowerCase().trim();
      
      if (lowerMsg === "menu" || lowerMsg === "mulai") {
        response = { message: tampilkanMenuUtama() };
      } else if (lowerMsg.startsWith("daftar#")) {
        response = { message: daftarUser(senderNumber, senderName, senderMessage) };
      } else if (lowerMsg.startsWith("lapor#")) {
        response = { message: buatLaporan(senderNumber, senderMessage) };
      } else if (lowerMsg.startsWith("cek#")) {
        response = { message: cekStatusLaporan(senderNumber, senderMessage) };
      } else {
        response = { message: bantuanAsisten(senderMessage) };
      }
    }
    
    return buildSuccessResponse(response.message);
    
  } catch (error) {
    logError(error);
    return buildErrorResponse("⚠️ Terjadi kesalahan sistem. Silakan coba lagi.");
  }
}

/*********************
 * MODUL MEDIA HANDLER
 *********************/
function handleMediaUpload(senderNumber, mediaUrl, mimeType) {
  try {
    const folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
    const blob = UrlFetchApp.fetch(mediaUrl).getBlob();
    
    // Format nama file: MEDIA_<NOMOR>_<TIMESTAMP>.<ext>
    const ext = mimeType.split('/')[1];
    const fileName = `MEDIA_${senderNumber}_${new Date().getTime()}.${ext}`;
    
    const file = folder.createFile(blob.setName(fileName));
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    return {
      success: true,
      fileId: file.getId(),
      fileName: fileName
    };
  } catch (error) {
    Logger.log("Error upload media: " + error);
    return { success: false };
  }
}

function getLatestMedia(senderNumber) {
  const folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
  const files = folder.getFilesByName(`MEDIA_${senderNumber}_*`);
  
  let latestFile = null;
  while (files.hasNext()) {
    const file = files.next();
    if (!latestFile || file.getDateCreated() > latestFile.getDateCreated()) {
      latestFile = file;
    }
  }
  
  return latestFile ? { 
    fileId: latestFile.getId(),
    url: latestFile.getUrl() 
  } : null;
}

/*********************
 * MODUL LAPORAN
 *********************/
function buatLaporan(senderNumber, senderMessage) {
  const sheetUser = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET.USERS);
  const sheetReport = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET.REPORTS);
  
  // Cek user terdaftar
  const userData = cariUser(senderNumber, sheetUser);
  if (!userData) return "❌ *Anda belum terdaftar!*\nKetik *daftar#nama#alamat* untuk mendaftar.";
  
  // Parse pesan
  const parts = senderMessage.split("#");
  const isiLaporan = parts[1]?.trim();
  if (!isiLaporan) return "❌ *Isi laporan tidak boleh kosong!*\nContoh: *lapor#Jalan berlubang di depan sekolah*";
  
  // Cari media terakhir
  const media = getLatestMedia(senderNumber);
  
  // Analisis dengan Gemini
  const analysis = analisisLaporanOtomatis(isiLaporan);
  
  // Generate ID Tiket
  const idTiket = generateIdTiket();
  
  // Simpan ke spreadsheet
  sheetReport.appendRow([
    new Date(),
    idTiket,
    senderNumber,
    userData[2], // Nama user
    isiLaporan,
    media ? media.fileId : "", // Simpan ID file Drive
    "Baru",
    analysis.kategori,
    analysis.prioritas,
    analysis.ringkasan
  ]);
  
  // Format respons
  return `📌 *LAPORAN DITERIMA* 📌

🆔 ID Tiket: *${idTiket}*
📅 Tanggal: *${Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy HH:mm")}*
📋 Kategori: *${analysis.kategori}*
⚠️ Prioritas: *${analysis.prioritas}*
📷 Lampiran: ${media ? "✅" : "❌"}

💬 *Ringkasan:*
"${analysis.ringkasan}"

🔹 *Gunakan ID di atas untuk cek status*
🔹 *Tim akan menghubungi dalam 1x24 jam*`;
}

function analisisLaporanOtomatis(isiLaporan) {
  const prompt = `[INST] Klasifikasi laporan masyarakat berikut:
1. Kategori (Infrastruktur/Lingkungan/Lainnya)
2. Prioritas (Rendah/Sedang/Tinggi)
3. Ringkasan (maks 10 kata)

Format output:
Kategori | Prioritas | Ringkasan

Contoh:
Infrastruktur | Tinggi | Jalan berlubang besar

Laporan: "${isiLaporan}" [/INST]`;

  const response = kirimKeGemini(prompt);
  const [kategori, prioritas, ringkasan] = response.split("|").map(item => item.trim());
  
  return { kategori, prioritas, ringkasan };
}

/*********************
 * MODUL UTAMA LAINNYA
 *********************/
function tampilkanMenuUtama() {
  return `🌟 *LAYANAN PENGADUAN MASYARAKAT* 🌟

📋 *MENU UTAMA*:
1. 🆕 *Daftar*  
   Ketik: *daftar#Nama#Alamat*  
   Contoh: *daftar#Budi#Jl. Merdeka No. 5*

2. 📢 *Lapor*  
   Ketik: *lapor#Keluhan Anda*  
   Contoh: *lapor#Jalan berlubang di depan sekolah*  
   🖼️ Lampirkan foto/video langsung di chat!

3. 🔍 *Cek Status*  
   Ketik: *cek#ID_TIKET*  
   Contoh: *cek#TIK-20240520-1234*

4. ❓ *Bantuan*  
   Ketik pertanyaan Anda  
   Contoh: *"Berapa lama proses penanganan?"*
   
--------------------------------
🔹 *Pastikan nomor WhatsApp Anda terdaftar*  
🔹 *Foto/video akan otomatis terdeteksi*`;
}

function daftarUser(senderNumber, senderName, senderMessage) {
  const sheetUser = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET.USERS);
  const parts = senderMessage.split("#");
  
  if (parts.length < 3) return "❌ *Format salah!*\nGunakan: *daftar#Nama#Alamat*";
  
  const nama = parts[1].trim();
  const alamat = parts.slice(2).join("#").trim();
  
  // Cek duplikat
  const data = sheetUser.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === senderNumber) {
      return `✅ *Anda sudah terdaftar!*\nNama: *${data[i][2]}*\nAlamat: *${data[i][3]}*`;
    }
  }
  
  // Simpan data
  sheetUser.appendRow([new Date(), senderNumber, nama, alamat, "Aktif"]);
  
  return `🎉 *Pendaftaran Berhasil!*

Nama: *${nama}*
Alamat: *${alamat}*

Ketik *menu* untuk melihat panduan.`;
}

function cekStatusLaporan(senderNumber, senderMessage) {
  const sheetReport = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET.REPORTS);
  const parts = senderMessage.split("#");
  
  if (parts.length < 2) return "❌ *Format salah!*\nGunakan: *cek#ID_TIKET*";
  
  const idTiket = parts[1].trim();
  const data = sheetReport.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === idTiket && data[i][2] === senderNumber) {
      const mediaLink = data[i][5] ? 
        `https://drive.google.com/file/d/${data[i][5]}/view` : "Tidak ada";
      
      return `🔍 *DETAIL LAPORAN* 🔍

🆔 ID: *${data[i][1]}*
📋 Status: *${data[i][6]}*
📌 Kategori: *${data[i][7]}*
⚠️ Prioritas: *${data[i][8]}*
📅 Tanggal: *${Utilities.formatDate(data[i][0], "GMT+7", "dd/MM/yyyy")}*
📷 Lampiran: ${data[i][5] ? "✅" : "❌"}

💬 *Isi Laporan:*
"${data[i][4]}"`;
    }
  }
  
  return "❌ *Tiket tidak ditemukan!*\nPastikan ID benar dan laporan milik Anda.";
}

/*********************
 * MODUL GEMINI AI
 *********************/
function kirimKeGemini(prompt) {
  try {
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;
    const options = {
      method: 'POST',
      contentType: 'application/json',
      payload: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(apiUrl, options);
    const jsonResponse = JSON.parse(response.getContentText());

    if (jsonResponse.error) {
      Logger.log('Error Gemini: ' + JSON.stringify(jsonResponse.error));
      return "🔧 Layanan AI sedang sibuk. Coba lagi nanti.";
    }

    return jsonResponse.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, saya tidak mengerti.";
  } catch (error) {
    Logger.log('Error Gemini: ' + error);
    return "⚠️ Terjadi gangguan pada sistem AI.";
  }
}
/*********************
 * FUNGSI PENUNJANG
 *********************/
function cariUser(senderNumber, sheetUser) {
  const data = sheetUser.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === senderNumber) return data[i];
  }
  return null;
}

function generateIdTiket() {
  const today = Utilities.formatDate(new Date(), "GMT+7", "yyyyMMdd");
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `TIK-${today}-${random}`;
}

function logRequest(payload) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET.LOGS);
  sheet.appendRow([new Date(), JSON.stringify(payload)]);
}

function logError(error) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET.LOGS);
  sheet.appendRow([new Date(), 'ERROR', error.message, JSON.stringify(error)]);
}

function buildSuccessResponse(message) {
  return ContentService.createTextOutput(JSON.stringify({ 
    success: true,
    data: [{ message }] 
  })).setMimeType(ContentService.MimeType.JSON);
}

function buildErrorResponse(message) {
  return ContentService.createTextOutput(JSON.stringify({ 
    success: false,
    error: message 
  })).setMimeType(ContentService.MimeType.JSON);
}