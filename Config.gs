/*********************
 * KONFIGURASI GLOBAL
 *********************/

// Nama Sheet
const NAMA_SHEET_USER = "Users";
const NAMA_SHEET_LAPORAN = "Reports";

// URL halaman upload bukti (ubah sesuai dengan URL deployment Web App kamu)
const BASE_UPLOAD_URL = "https://script.google.com/macros/s/AKfycbxxxxxxx/exec/upload.html";

// Konfigurasi Gemini API
const GEMINI_MODEL = "models/gemini-pro";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
const GEMINI_API_KEY = "ISI_DENGAN_API_KEY_ANDA";  // Ganti dengan API key asli (sebaiknya simpan di PropertiesService)

// Fungsi bantu untuk ambil dari Properties (opsional, untuk keamanan API Key)
function getGeminiApiKey() {
  return PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY") || GEMINI_API_KEY;
}
