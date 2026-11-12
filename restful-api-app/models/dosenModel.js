let dosen = [
  { id: 1, nama: 'Nur Rachmat, M.Kom.', nip: '0210088501', prodiId: 1 },
];
let nextId = 2;

function getAll(prodiId) {
  if (prodiId) return dosen.filter((d) => d.prodiId === prodiId);
  return dosen;
}

function getById(id) {
  return dosen.find((d) => d.id === id);
}

function create(data) {
  const baru = { id: nextId++, ...data };
  dosen.push(baru);
  return baru;
}

module.exports = { getAll, getById, create };