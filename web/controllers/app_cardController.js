const axios = require("axios");

// this has become quite messy, might need to modularise later
exports.cardGrid = async (req, res) => {
  try {
    const page = req.query.page || 1;
    let response;
    let collectionOwner;

    // check if collection id is in url
    if (req.params.id) {
      // make initial api call to get response - looking to get cardIds from collection
      response = await axios.get(
        `http://localhost:4000/api/collections/${req.params.id}/cards`
      );

      // get the userID of the collection owner -
      //this gets passed to the view to check if the user is the owner for ability to edit collection cards
      const getOwner = await axios.get(
        `http://localhost:4000/api/collections?collection_id=${req.params.id}`
      );
      collectionOwner = getOwner.data[0].user_id;
    }

    // if cardIds exist, create url for cardIds in collection - otherwise get all cards
    if (response && response.data.cardIds) {
      cardIds = response.data.cardIds;
      url = `http://localhost:4000/api/collections/${
        req.params.id
      }/cards?page=${page}&cardIds=${cardIds.join(",")}`;
    } else {
      url = `http://localhost:4000/api/cards?page=${page}`;
    }

    // get card tiles from api
    const cardTiles = await axios.get(url);
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
        success: req.flash("success"),
        error: req.flash("error"),
        // these are used for collection card views
        route: req.originalUrl,
        collectionId: req.params.id,
        userId: req.session.userID,
        collectionOwner: collectionOwner,
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
      const userCollections = req.userCollections;
      res.render("card", { card: card, collections: userCollections });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("ERROR");
  }
};
