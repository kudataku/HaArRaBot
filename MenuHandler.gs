/*********************
 * PENANGAN PENGGUNA
 *********************/

function daftarPengguna(pesan, pengirim, sheetUser) {
  const parts = pesan.split("#");
  if (parts.length < 4) {
    return "❌ Format salah. Gunakan: *daftar#NIK#Nama#Alamat*";
  }

  const nik = parts[1].trim();
  const nama = parts[2].trim();
  const alamat = parts[3].trim();

  if (!/^\d{16}$/.test(nik)) {
    return "❌ NIK harus terdiri dari 16 digit angka.";
  }

  const data = sheetUser.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === pengirim) {
      return "❗ Anda sudah terdaftar.";
    }
  }

  sheetUser.appendRow([pengirim, nik, nama, alamat, new Date()]);
  return `✅ *Pendaftaran berhasil!*\n\n` +
         `📞 Nomor: *${pengirim}*\n` +
         `🧑 Nama: *${nama}*\n` +
         `🏡 Alamat: *${alamat}*\n` +
         `🆔 NIK: *${nik}*\n\n` +
         `Silakan lanjutkan dengan ketik *lapor#isi_laporan* untuk menyampaikan laporan.`;
}

function cariUser(nomor, sheetUser) {
  const data = sheetUser.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === nomor) {
      return data[i];
    }
  }
  return null;
}
