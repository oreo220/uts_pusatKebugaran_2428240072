const express = require("express");

const router = express.Router();

const anggotaGymController = require("../controllers/anggotaGymController");

const cekApiKey = require("../middlewares/cekApiKey");

router.get("/", 
    anggotaGymController.getAll
);

router.post(
    "/",
    cekApiKey,
    anggotaGymController.create
);

router.put(
    "/:id",
    cekApiKey,
    anggotaGymController.update
);

router.delete(
    "/:id",
    cekApiKey,
    anggotaGymController.remove
);

module.exports = router;