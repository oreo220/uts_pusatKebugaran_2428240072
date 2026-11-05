
const mongoose = require("mongoose");

// Subschema untuk embedding kontak
const kontakSchema = new mongoose.Schema(
    {
        telepon: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: Boolean,
            default: true
        }
    },
    {
        _id: false
    }
);

// Schema utama anggota gym
const anggotaGymSchema = new mongoose.Schema(
    {
        noAnggota: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        nama: {
            type: String,
            required: true,
            trim: true
        },
        beratBadan: {
            type: Number,
            required: true,
            min: 0
        },
        paket: {
            type: string,
            required: true,
            min: 1
        },
        kontak: {
            type: [kontakSchema],
            default: []
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("AnggotaGym", anggotaGymSchema);