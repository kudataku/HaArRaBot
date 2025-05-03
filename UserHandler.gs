function daftarUser(senderNumber, message, sheet) {
  const parts = message.split("#");
  const nik = parts[1]?.trim();
  const nama = parts[2]?.trim();
  const alamat = parts[3]?.trim();

  if (!/^\d{16}$/.test(nik)) return "❌ NIK harus 16 digit angka.";
  if (!nama || !alamat) return "❌ Format salah. Gunakan: *daftar#NIK#Nama#Alamat*";

  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === senderNumber) return "✅ Anda sudah terdaftar.";
  }

  sheet.appendRow([senderNumber, nik, nama, alamat, new Date()]);
  return "✅ Pendaftaran berhasil. Silakan ketik *menu* untuk mulai.";
}

function cariUser(senderNumber, sheet) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === senderNumber) return data[i];
  }
  return null;
}
