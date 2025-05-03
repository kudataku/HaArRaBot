# HaArRaBot
HaArRa Chat Bot

# WhatsApp Chatbot Layanan Masyarakat

Chatbot WhatsApp berbasis Google Apps Script untuk pendaftaran dan pelaporan masyarakat.

## Fitur
- Daftar pengguna baru berdasarkan NIK
- Kirim laporan dengan klasifikasi otomatis
- Cek status laporan
- Upload bukti (foto/video)

## Setup
1. Buat Google Spreadsheet dengan sheet: `Users`, `Reports`
2. Deploy Google Apps Script sebagai Web App
3. Hubungkan dengan webhook WhatsApp Gateway

## Struktur File
- Main.gs
- MenuHandler.gs
- UserHandler.gs
- ReportHandler.gs
- AIHandler.gs
- Util.gs
- UploadPage.html
