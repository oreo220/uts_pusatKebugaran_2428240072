let fakultas = [
  { id: 1, nama: 'Fakultas Ilmu Komputer dan Rekayasa' },
  { id: 2, nama: 'Fakultas Ekonomi dan Bisnis' },
];
let nextId = 3;

function getAll() {
  return fakultas;
}

function getById(id) {
  return fakultas.find((f) => f.id === id);
}

function create(data) {
  const baru = { id: nextId++, ...data };
  fakultas.push(baru);
  return baru;
}

function update(id, data) {
  const index = fakultas.findIndex((m) => m.id === id);
  if (index === -1) return null;
  fakultas
  [index] = { ...fakultas[index], ...data, id };
  return fakultas[index];
}

function remove(id) {
  const index = fakultas.findIndex((m) => m.id === id);
  if (index === -1) return false;
  fakultas.splice(index, 1);
  return true;
}
module.exports = { getAll, getById, create, update, remove  };