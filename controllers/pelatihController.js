const Pelatih = require('../models/pelatihModel');

exports.create = async (req, res) => {
  try {
    const pelatih = await Pelatih.create(req.body);
    res.status(201).json(pelatih);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAll = async (req, res) => {
  const filter = {};
  if (req.query.kota) {
    filter['alamat.kota'] = String(req.query.kota);
  }
  if (req.query.prodi) {
    const pelatih = await Pelatih.findOne({ kode: String(req.query.prodi).toUpperCase() });
    // Kode pelatih tidak dikenal -> hasil kosong ($in: [] tidak cocok dengan apa pun)
    filter.pelatihId = pelatih ? pelatih._id : { $in: [] };
  }
  const data = await Pelatih.find(filter).populate('pelatihId');
  res.json(data);
};

exports.getById = async (req, res) => {
  const data = await Pelatih.findById(req.params.id);
  if (!data) throw errorHttp(404, 'Data tidak ditemukan');
  res.json(data);
};