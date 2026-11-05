
const AnggotaGym = require("../models/anggotaGymModel");
const Pelatih = require("../models/pelatihModel");
// const { errorHttp } = require("../middlewares/errorHandler");

const FIELD_BOLEH_DIPILIH = [
    "noAnggota",
    "nama",
    "beratBadan",
    "paket",
    "kontak",
    "pelatihId",
    "createdAt"
];

const FIELD_BOLEH_SORT = [
    "noAnggota",
    "nama",
    "beratBadan",
    "paket",
    "kontak",
    "createdAt"
];

// GET ALL ANGGOTA GYM
// Filtering, pagination, sorting, projection
exports.getAll = async (req, res, next) => {
    try {
        const filter = {};

        // FILTERING
        if (req.query.paket) {
            filter.paket = req.query.paket.trim();
        }

        if (req.query.pelatihId) {
            filter.pelatihId = req.query.pelatihId;
        }

        if (req.query.nama) {
            filter.nama = {
                $regex: req.query.nama.trim(),
                $options: "i"
            };
        }

        // PAGINATION
        const page = Number.parseInt(req.query.page, 10) || 1;
        const limit = Number.parseInt(req.query.limit, 10) || 10;

        if (
            !Number.isInteger(page) ||
            !Number.isInteger(limit) ||
            page < 1 ||
            limit < 1
        ) {
            return res.status(400).json({
                success: false,
                message: "Page dan limit harus berupa angka positif"
            });
        }

        const skip = (page - 1) * limit;

        // SORTING
        const sort = req.query.sort || "noAnggota";

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
                fields.every(field =>
                    FIELD_BOLEH_DIPILIH.includes(field)
                );

            if (!valid) {
                return res.status(400).json({
                    success: false,
                    message: "Field projection tidak valid"
                });
            }

            select = fields.join(" ");
        }

        // QUERY DATA
        let query = AnggotaGym.find(filter);

        if (select) {
            query = query.select(select);
        }

        query = query
            .sort(sort)
            .skip(skip)
            .limit(limit);

        // POPULATE DATA PELATIH
        if (
            !select ||
            select.split(" ").includes("pelatihId")
        ) {
            query = query.populate("pelatihId");
        }

        const [data, total] = await Promise.all([
            query,
            AnggotaGym.countDocuments(filter)
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


// GET ANGGOTA GYM BERDASARKAN ID
exports.getById = async (req, res, next) => {
    try {
        const data = await AnggotaGym.findById(req.params.id)
            .populate("pelatihId");

        if (!data) {
            return next(
                errorHttp(404, "Anggota gym tidak ditemukan")
            );
        }

        res.json({
            success: true,
            data
        });

    } catch (err) {
        next(err);
    }
};


// POST MENAMBAHKAN ANGGOTA GYM
exports.create = async (req, res, next) => {
    try {
        const {
            noAnggota,
            nama,
            beratBadan,
            paket,
            kontak,
            pelatihId
        } = req.body;

        // CEK PELATIH
        if (pelatihId) {
            const pelatih = await Pelatih.findById(pelatihId);

            if (!pelatih) {
                return next(
                    errorHttp(404, "Pelatih tidak ditemukan")
                );
            }
        }

        const data = await AnggotaGym.create({
            noAnggota,
            nama,
            beratBadan,
            paket,
            kontak,
            pelatihId
        });

        const result = await data.populate("pelatihId");

        res.status(201).json({
            success: true,
            message: "Anggota gym berhasil ditambahkan",
            data: result
        });

    } catch (err) {
        next(err);
    }
};


// PUT MEMPERBARUI ANGGOTA GYM
exports.update = async (req, res, next) => {
    try {
        const updateData = {};

        const fieldUpdate = [
            "noAnggota",
            "nama",
            "beratBadan",
            "paket",
            "kontak",
            "pelatihId"
        ];

        // HANYA FIELD YANG DIIZINKAN
        fieldUpdate.forEach(field => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        // CEK PELATIH
        if (updateData.pelatihId) {
            const pelatih = await Pelatih.findById(
                updateData.pelatihId
            );

            if (!pelatih) {
                return next(
                    errorHttp(404, "Pelatih tidak ditemukan")
                );
            }
        }

        const data = await AnggotaGym.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        ).populate("pelatihId");

        if (!data) {
            return next(
                errorHttp(404, "Anggota gym tidak ditemukan")
            );
        }

        res.json({
            success: true,
            message: "Anggota gym berhasil diperbarui",
            data
        });

    } catch (err) {
        next(err);
    }
};


// DELETE MENGHAPUS ANGGOTA GYM
exports.remove = async (req, res, next) => {
    try {
        const data = await AnggotaGym.findByIdAndDelete(
            req.params.id
        );

        if (!data) {
            return next(
                errorHttp(404, "Anggota gym tidak ditemukan")
            );
        }

        res.json({
            success: true,
            message: "Anggota gym berhasil dihapus"
        });

    } catch (err) {
        next(err);
    }
};
