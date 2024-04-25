const { Card } = require("../models/modelAssosiations.js");
const { formatFilters } = require("../../utility/formatFilters.js");

/**
 * gets cards with full details by page
 * optional where clause can be passed as query params
 * using this to fetch >20 cards in web app is not recommended, rather slow - use getCardGrid instead
 * it can be used by api users to get full details of cards..
 * note: might be a good idea to allow cardsPerPage as a query param - if an api user wants to wait to get all cards in one go
 * @param {*} req
 * @param {*} res
 * @returns json array of cards with full relevant (excluded id's where possible) details
 */
exports.getCards = async (req, res) => {
  const { page, ...queryParams } = req.query;
  try {
    const cards = await Card.getCardDetails(queryParams, Number(page) || 1);

    if (cards.cards.length === 0) {
      return res.json(null);
    }

    return res.status(200).json(cards);
  } catch (err) {
    return res.status(500).json({ error: "Error getting cards" });
  }
};

exports.getFilteredCardIds = async (req, res, next) => {
  const { ...queryParams } = req.query;
  const filters = formatFilters(queryParams);
  if (Object.keys(filters).length === 0) {
    next();
  } else {
    try {
      const cards = await Card.filterResultIds(filters);

      if (cards.cards.length === 0) {
        return res.json(null);
      }
      req.cardIds = cards.cards;
      next();
    } catch (err) {
      return res.status(500).json({ error: "Error getting cards" });
    }
  }
};

/**
 * gets cards with limited details (id, image and name) by page
 * optional where clause can be passed as query params
 * this is used in the web app for card grid page - much faster than getCards
 * @param {*} req
 * @param {*} res
 * @returns json array of cards with limited details
 */
exports.getCardGrid = async (req, res) => {
  let cardIds = [];
  const { page } = req.query;

  if (req.cardIds && req.cardIds.length > 0) {
    cardIds = req.cardIds;
  }
  try {
    const cards = await Card.getCardGrid(cardIds, page);

    if (cards.cards.length === 0) {
      return res.json(null);
    }

    return res.status(200).json(cards);
  } catch (err) {
    return res.status(500).json({ error: "Error getting cards" });
  }
};

/**
 * gets a single card with full details by id
 * this is used in the web app for card details page
 * @param {*} req
 * @param {*} res
 * @returns json object of a single card with full relevant details
 */
exports.getCardById = async (req, res) => {
  try {
    const card = await Card.getCardDetails({ card_id: req.params.id });

    if (card.cards.length === 0) {
      return res.json(null);
    }

    return res.status(200).json(card);
  } catch (err) {
    return res.status(500).json({ error: "Error getting card" });
  }
};
