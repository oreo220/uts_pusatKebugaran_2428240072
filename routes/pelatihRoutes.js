
const express = require("express");
const router = express.Router();

const pelatihController = require("../controllers/pelatihController");
const cekApiKey = require("../middlewares/cekApiKey");

router.get("/", pelatihController.getAll);
router.get("/:id", pelatihController.getById);

router.post("/", cekApiKey, pelatihController.create);
router.put("/:id", cekApiKey, pelatihController.update);
router.delete("/:id", cekApiKey, pelatihController.remove);

module.exports = router;
