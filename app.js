require("dotenv").config();

const express = require("express");
const cors = require("cors");

const anggotaGymRoutes = require("./routes/anggotaGymRoutes");
const logger = require("./middlewares/logger");
const {
    notFoundHandler,
    errorHandler
} = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.get("/", (req, res) => {
    res.json({
        nama: "Sunita Aqila",
        nim: "2428240072",
        topik: "16 - Pusat kebugaran (annggotaGym)",
    });
});

app.use("/anggotaGym", anggotaGymRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});

module.exports = app;