const Card = require("../models/cardModel.js")();
// const Sequelize = require("sequelize");

/**
 * API controller to get all cards tiles to display in card grid and in searches
 */

exports.getCardTiles = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const itemsPerPage = 30;
  const pageOffset = (page - 1) * itemsPerPage;

  try {
    const result = await Card.getCardTile({
      limit: itemsPerPage,
      offset: pageOffset,
    });
    console.log(result); // debug

    const cards = result.data;
    const totalCards = result.count;

    const totalPages = Math.ceil(totalCards / itemsPerPage);
    console.log(totalPages); // debug

    return res.status(200).json({
      cards: cards,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send("ERROR");
  }
};

/**
 * get a single card by id with all joined data
 */

exports.getCardById = async (req, res) => {
  try {
    const card = await Card.getCard(req.params.id);
    console.log(card); // debug
    return res.status(200).json(card);
  } catch (err) {
    console.log(err);
    return res.status(500).send("ERROR");
  }
};
