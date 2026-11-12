const mongoose = require('mongoose');

const kontakSchema = new mongoose.Schema({
  telepon: { type: String, required: [true, 'telepon wajib diisi'] },
  email: { type: String, required: [true, 'email wajib diisi'] },
}, { _id: false });

const anggotaGymSchema = new mongoose.Schema({
   noAnggota: { type: String, required: [true, 'nomor anggota wajib diisi'], unique: true, trim: true },
  nama: { type: String, required: [true, 'nama wajib diisi'], trim: true },
  beratBadan: { type: Number, required: [true, 'berat badan wajib diisi'], min: [0, 'berat badan minimal 0'] },
  paket: { type: String, required: [true, 'paket wajib diisi'], enum: ['bulanan', 'triwulan', 'tahunan'] },
  kontak: kontakSchema,
  pelatihId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pelatih', required: [true, 'pelatih wajib dipilih'] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('AnggotaGym', anggotaGymSchema);