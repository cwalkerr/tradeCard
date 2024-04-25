const express = require("express");
const router = express.Router();
const filterController = require("../controllers/api_filterController.js");

router.get("/series/sets", filterController.getSetsInSeries);
router.get("/energytypes", filterController.getEnergyTypes);
router.get("/rarities", filterController.getRarities);
router.get("/subtypes", filterController.getSubtypes);

module.exports = router;
