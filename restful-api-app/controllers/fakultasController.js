const fakultasModel = require('../models/fakultasModel');
const { errorHttp } = require('../middlewares/errorHandler');

const LIMIT_DEFAULT = 10;
const LIMIT_MAKS = 50;

// Mengubah bilangan dari query string menjadi bilangan bulat yang aman
function angkaAman(nilai, bawaan, min, maks) {
  const n = parseInt(nilai, 10);
  if (Number.isNaN(n)) return bawaan;
  return Math.min(Math.max(n, min), maks);
}

exports.getAll = (req, res) => {
  res.json(fakultasModel.getAll());
};

exports.getById = (req, res, next) => {
  const id = parseInt(req.params.id);
  const data = fakultasModel.getById(id);
  if (!data) return next(errorHttp(404, 'Fakultas tidak ditemukan'));
  res.json(data);
};

exports.create = (req, res, next) => {
  const { nama } = req.body;
  if (!nama) return next(errorHttp(400, 'nama wajib diisi'));

  const baru = fakultasModel.create({ nama });
  res.status(201).json(baru);
};