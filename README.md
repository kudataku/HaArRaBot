# HaArRaBot
HaArRa Chat Bot

# 📱 Chatbot WhatsApp Layanan Masyarakat (Google Apps Script)

Sistem chatbot WhatsApp yang terintegrasi dengan Google Apps Script untuk menerima pendaftaran warga, laporan pengaduan, serta analisis otomatis menggunakan AI Gemini. Juga menyediakan fitur upload bukti via halaman web.

---

## 🔧 Fitur Utama

- ✅ **Pendaftaran Pengguna** dengan validasi NIK (16 digit angka).
- 📝 **Pengiriman Laporan** melalui format WhatsApp.
- 📎 **Upload Bukti (Foto/Video)** melalui halaman web.
- 🤖 **Analisis AI Gemini** otomatis: Kategori, Ringkasan, dan Prioritas.
- 📊 **Penyimpanan Otomatis** ke Google Sheets.
- 🔍 **Cek Status Laporan** menggunakan ID Tiket.

---

## 📁 Struktur File

├── Main.gs # Titik masuk utama (doPost)
├── MenuHandler.gs # Handler perintah pengguna
├── UserHandler.gs # Pendaftaran dan validasi NIK
├── ReportHandler.gs # Penanganan laporan dan pengecekan status
├── AIHandler.gs # Koneksi ke Gemini AI
├── Util.gs # Fungsi bantu (format, ID tiket, validasi)
├── Config.gs # Konfigurasi (Sheet, API Key, URL)
├── UploadPage.html # Halaman upload bukti
├── README.md # Dokumentasi proyek
└── LICENSE # Lisensi proyek (MIT)


---

## 🧪 Contoh Format WhatsApp

### 🔹 Daftar: daftar#3275010101010001#Budi Santoso#Jl. Melati No. 10

### 🔹 Kirim Laporan: lapor#Jalan berlubang besar di depan sekolah.

### 🔹 Cek Status: cek#TIK-20250501-1234

---

## 🖼️ Upload Bukti

Setelah mengirim laporan, sistem akan memberikan link seperti berikut:

https://script.google.com/macros/s/AKfycb.../exec/upload.html?tiket=TIK-20250501-1234&user=6281234567890


Melalui halaman ini, pengguna bisa upload foto atau video pendukung laporan.

---

## 🔧 Konfigurasi

Konfigurasi ada di file `Config.gs`:
```js
const CONFIG = {
  SHEET_USER_NAME: "Users",
  SHEET_REPORT_NAME: "Reports",
  GEMINI_API_KEY: "PASTE_API_KEY_ANDA",
  BASE_UPLOAD_URL: "https://script.google.com/macros/s/AKfycb.../exec/upload.html"
};


🚀 Deployment
Buka Apps Script Editor → Buat Proyek Baru.

Paste semua file sesuai struktur.

Deploy sebagai Web App: Klik Deploy > Manage deployments > Web App:

Siapa yang dapat mengakses: Anyone

Metode: POST

Ganti BASE_UPLOAD_URL di Config.gs dengan URL Web App kamu.

🙋 Dukungan
Hubungi via WhatsApp jika ingin kerja sama atau bantuan integrasi lebih lanjut.
