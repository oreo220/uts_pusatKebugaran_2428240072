const AnggotaGym = require("../models/anggotaGymModel");
const Pelatih = require("../models/pelatihModel");
const { errorHttp } = require("../middlewares/errorHandler");

const FIELD_BOLEH_DIPILIH = [
    "noAnggota",
    "nama",
    "beratBadan",
    "paket",
    "kontak",
    "pelatihId"
    "createdAt",
];

const FIELD_BOLEH_SORT = [
    "noAnggota",
    "nama",
    "beratBadan",
    "paket",
    "kontak",
    "createdAt",
];

// GET semua ruang kelas
// Filtering, pagination, sorting, projection
exports.getAll = async (req, res, next) => {
    try {
        const filter = {};

        // FILTERING
        if (req.query.gedung) {
            filter.gedung = req.query.gedung.trim().toUpperCase();
        }

        if (req.query.lantai !== undefined) {
            const lantai = Number(req.query.lantai);

            if (!Number.isInteger(lantai) || lantai < 1) {
                return res.status(400).json({
                    success: false,
                    message: "Parameter lantai harus berupa angka positif"
                });
            }

            filter.lantai = lantai;
        }

        if (req.query.kapasitas !== undefined) {
            const kapasitas = Number(req.query.kapasitas);

            if (!Number.isFinite(kapasitas) || kapasitas < 1) {
                return res.status(400).json({
                    success: false,
                    message: "Parameter kapasitas harus berupa angka positif"
                });
            }

            filter.kapasitas = kapasitas;
        }

        if (req.query.adaProyektor !== undefined) {
            if (!["true", "false"].includes(req.query.adaProyektor)) {
                return res.status(400).json({
                    success: false,
                    message: "adaProyektor harus bernilai true atau false"
                });
            }

            filter.adaProyektor = req.query.adaProyektor === "true";
        }

        // PAGINATION
        const page = Number.parseInt(req.query.page, 10) || 1;
        const limit = Number.parseInt(req.query.limit, 10) || 10;

        if (page < 1 || limit < 1 || !Number.isInteger(page) || !Number.isInteger(limit)) {
            return res.status(400).json({
                success: false,
                message: "Page dan limit harus berupa angka positif"
            });
        }

        const skip = (page - 1) * limit;

        // SORTING
        const sort = req.query.sort || "kodeRuang";
        const sortField = sort.startsWith("-")
            ? sort.substring(1)
            : sort;

        if (!FIELD_BOLEH_SORT.includes(sortField)) {
            return res.status(400).json({
                success: false,
                message: "Field sorting tidak valid"
            });
        }

        // PROJECTION
        let select = "";

        if (req.query.fields) {
            const fields = req.query.fields
                .split(",")
                .map(field => field.trim())
                .filter(Boolean);

            const valid = fields.length > 0 &&
                fields.every(field => FIELD_BOLEH_DIPILIH.includes(field));

            if (!valid) {
                return res.status(400).json({
                    success: false,
                    message: "Field projection tidak valid"
                });
            }

            select = fields.join(" ");
        }

        // QUERY DATA
        let query = Classroom.find(filter);

        if (select) {
            query = query.select(select);
        }

        query = query
            .sort(sort)
            .skip(skip)
            .limit(limit);

        // Populate hanya jika buildingId ikut ditampilkan
        if (!select || select.split(" ").includes("buildingId")) {
            query = query.populate("buildingId");
        }

        const [data, total] = await Promise.all([
            query,
            Classroom.countDocuments(filter)
        ]);

        res.json({
            success: true,
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        next(err);
    }
};

// GET ruang kelas berdasarkan ID
exports.getById = async (req, res, next) => {
    try {
        const data = await Classroom.findById(req.params.id)
            .populate("buildingId");

        if (!data) {
            return next(errorHttp(404, "Ruang kelas tidak ditemukan"));
        }

        res.json({
            success: true,
            data
        });
    } catch (err) {
        next(err);
    }
};

// POST menambahkan ruang kelas
exports.create = async (req, res, next) => {
    try {
        const {
            kodeRuang,
            buildingId,
            lantai,
            kapasitas,
            adaProyektor,
            fasilitas
        } = req.body;

        const building = await Building.findById(buildingId);

        if (!building) {
            return next(errorHttp(404, "Gedung yang dipilih tidak ditemukan"));
        }

        const data = await Classroom.create({
            kodeRuang,
            gedung: building.kodeGedung,
            buildingId,
            lantai,
            kapasitas,
            adaProyektor,
            fasilitas
        });

        const result = await data.populate("buildingId");

        res.status(201).json({
            success: true,
            message: "Ruang kelas berhasil ditambahkan",
            data: result
        });
    } catch (err) {
        next(err);
    }
};

// PUT memperbarui ruang kelas
exports.update = async (req, res, next) => {
    try {
        const updateData = { ...req.body };

        if (updateData.buildingId) {
            const building = await Building.findById(updateData.buildingId);

            if (!building) {
                return next(errorHttp(404, "Gedung yang dipilih tidak ditemukan"));
            }

            updateData.gedung = building.kodeGedung;
        }

        const data = await Classroom.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        ).populate("buildingId");

        if (!data) {
            return next(errorHttp(404, "Ruang kelas tidak ditemukan"));
        }

        res.json({
            success: true,
            message: "Ruang kelas berhasil diperbarui",
            data
        });
    } catch (err) {
        next(err);
    }
};

// DELETE menghapus ruang kelas
exports.remove = async (req, res, next) => {
    try {
        const data = await Classroom.findByIdAndDelete(req.params.id);

        if (!data) {
            return next(errorHttp(404, "Ruang kelas tidak ditemukan"));
        }

        res.json({
            success: true,
            message: "Ruang kelas berhasil dihapus"
        });
    } catch (err) {
        next(err);
    }
};