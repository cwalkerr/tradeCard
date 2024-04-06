const axios = require("axios");
const express = require("express");

const app = express();

// may not need this
exports.renderCardsPage = (req, res) => {
  res.render("cards");
};

exports.cardGrid = async (req, res) => {
  try {
    const page = req.query.page || 1;

    const cardTiles = await axios.get(
      `http://localhost:4000/api/cards?page=${page}`
    );
    if (cardTiles.status === 200) {
      // get data from api response
      const cards = cardTiles.data.cards;
      const totalPages = cardTiles.data.totalPages;
      const currentPage = cardTiles.data.currentPage;

      // start and end page numbers for pagination - 4 pages either side of current page
      let startPage = Math.max(1, currentPage - 4);
      let endPage = Math.min(totalPages, currentPage + 4);

      // if at start of pagination, shift end page number
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + 8);
      }

      // if at end of pagination, shift start page number
      if (endPage === totalPages) {
        startPage = Math.max(1, endPage - 8);
      }

      res.render("cards", {
        cards: cards,
        totalPages: totalPages,
        currentPage: currentPage,
        startPage: startPage,
        endPage: endPage,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("ERROR");
  }
};

exports.cardDetails = async (req, res) => {
  try {
    const cardId = req.params.id;
    const cardDetails = await axios.get(
      `http://localhost:4000/api/cards/${cardId}`
    );
    if (cardDetails.status === 200) {
      const card = cardDetails.data;
      console.log(card); // debug
      res.render("card", { card: card });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("ERROR");
  }
};
