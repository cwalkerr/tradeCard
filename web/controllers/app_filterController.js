const axios = require("axios");

const API_URL = "http://localhost:4000/api";
const SUCCESS_STATUS_CODE = 200;

exports.getFilterOptions = async (req, res, next) => {
  try {
    const seriesSets = await axios.get(`${API_URL}/series/sets`);
    const energyTypes = await axios.get(`${API_URL}/energyTypes`);
    const rarities = await axios.get(`${API_URL}/rarities`);
    const subtypes = await axios.get(`${API_URL}/subtypes`);

    if (
      seriesSets.status === SUCCESS_STATUS_CODE &&
      energyTypes.status === SUCCESS_STATUS_CODE &&
      rarities.status === SUCCESS_STATUS_CODE &&
      subtypes.status === SUCCESS_STATUS_CODE
    ) {
      req.seriesSets = seriesSets.data;
      req.energyTypes = energyTypes.data;
      req.rarities = rarities.data;
      req.subtypes = subtypes.data;

      next();
    }
  } catch (err) {
    console.log(err);
    return;
  }
};
