const { Card } = require("../models/modelAssosiations.js");

/**
 * API controller to get cards tiles to display in card grid and in searches
 * not sure if this is what the api should do, seems now like this kind of formatting should be dealt with by web app - revisit later
 */

exports.getCardTiles = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const itemsPerPage = 30;
  const pageOffset = (page - 1) * itemsPerPage;

  let cardIds;

  if (req.query.cardIds) {
    cardIds = req.query.cardIds.split(",");
  } else {
    cardIds = null;
  }

  try {
    const result = await Card.getCardTile({
      limit: itemsPerPage,
      offset: pageOffset,
      cardIds: cardIds,
    });

    const cards = result.data;
    const totalCards = result.count;

    const totalPages = Math.ceil(totalCards / itemsPerPage);

    return res.status(200).json({
      cards: cards,
      totalPages: totalPages,
      currentPage: page,
      cardIds: cardIds,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Error getting cards" });
  }
};
/**
 * get a single card by id with all joined data
 */

exports.getCardById = async (req, res) => {
  try {
    const card = await Card.getCard(req.params.id);
    return res.status(200).json(card);
  } catch (err) {
    return res.status(500).json({ error: "Error getting card" });
  }
};
