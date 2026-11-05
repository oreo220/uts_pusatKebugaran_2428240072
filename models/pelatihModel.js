
const mongoose = require("mongoose");

const pelatihSchema = new mongoose.Schema(
    {
        idPelatih: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        namapelatih: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Pelatih", pelatihSchema);