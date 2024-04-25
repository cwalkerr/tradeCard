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
    next(
      new Error(
        err.response.data.error || err.message || "Error getting filter options"
      )
    );
    return;
  }
};

exports.ProcessFilterOptions = async (req, res, next) => {
  const { page, ...checkedBoxes } = req.query;

  const query = new URLSearchParams(checkedBoxes).toString();

  try {
    const cards = await axios.get(
      `${API_URL}/cards/grid?${query}&page=${page}&${new URLSearchParams(
        checkedBoxes
      ).toString()}`
    );
    if (cards.status === SUCCESS_STATUS_CODE) {
      req.filteredCards = cards.data;
      console.log(
        "req.filteredCards in ProcessFilterOptions",
        req.filteredCards
      );
      next();
    }
  } catch (err) {
    console.log("Error getting filtered cards: ", err);
    next(
      new Error(err.response.data.error || err.message || "Error getting cards")
    );
    return;
  }
};
