
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
  if (req.query.kode) {
    filter.kode = String(req.query.kode).toUpperCase();
  }
  if (req.query.nama) {
    filter.nama = String(req.query.nama);
  }
  const data = await Pelatih.find(filter);
  res.json(data);
};

exports.getById = async (req, res) => {
  const data = await Pelatih.findById(req.params.id);
  if (!data) throw errorHttp(404, 'Data tidak ditemukan');
  res.json(data);
};
