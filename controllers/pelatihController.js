const Building = require("../models/buildingModel");
const { errorHttp } = require("../middlewares/errorHandler");

exports.getAll = async (req, res, next) => {
    try {
        const data = await Building.find();

        res.json({
            success: true,
            data
        });
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const data = await Building.findById(req.params.id);

        if (!data) {
            return next(errorHttp(404, "Gedung tidak ditemukan"));
        }

        res.json({
            success: true,
            data
        });
    } catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const data = await Building.create(req.body);

        res.status(201).json({
            success: true,
            message: "Gedung berhasil ditambahkan",
            data
        });
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const data = await Building.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!data) {
            return next(errorHttp(404, "Gedung tidak ditemukan"));
        }

        res.json({
            success: true,
            message: "Gedung berhasil diperbarui",
            data
        });
    } catch (err) {
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const Classroom = require("../models/classroomModel");

        const jumlahRuang = await Classroom.countDocuments({
            buildingId: req.params.id
        });

        if (jumlahRuang > 0) {
            return next(
                errorHttp(
                    400,
                    "Gedung tidak dapat dihapus karena masih digunakan oleh ruang kelas"
                )
            );
        }

        const data = await Building.findByIdAndDelete(req.params.id);

        if (!data) {
            return next(errorHttp(404, "Gedung tidak ditemukan"));
        }

        res.json({
            success: true,
            message: "Gedung berhasil dihapus"
        });
    } catch (err) {
        next(err);
    }
};