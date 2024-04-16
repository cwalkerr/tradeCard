const axios = require("axios");

// this has become quite messy, might need to modularise later
exports.cardGrid = async (req, res) => {
  try {
    const page = req.query.page || 1;
    let collectionResponse;
    let wishlistResponse;
    let collectionOwner;
    let wishlistOwner;

    /**
     * CHECK IF THIS IS FOR A COLLECTION
     */
    if (req.params.collection_id) {
      // im using req.params here but req.wishlistId in the next if statement - make this consistent
      // make initial api call to get response - looking to get cardIds from collection
      collectionResponse = await axios.get(
        `http://localhost:4000/api/collections/${req.params.collection_id}/cards`
      );

      // get the userID of the collection owner -
      //this gets passed to the view to check if the user is the owner for ability to edit collection cards
      const getOwner = await axios.get(
        `http://localhost:4000/api/collections?collection_id=${req.params.collection_id}`
      );
      collectionOwner = getOwner.data[0].user_id;
    }

    /**
     * CHECK IF THIS IS FOR A WISHLIST
     */
    if (req.wishlistId) {
      wishlistResponse = await axios.get(
        `http://localhost:4000/api/wishlist/${req.wishlistId}/cards`
      );
      if (req.wishlistOwner === req.session.userID) {
        // this is cleaner than the collectionOwner check - revise this
        wishlistOwner = req.session.userID;
      }
    }

    // if cardIds exist, create url for cardIds in collection or wishlist otherwise get all cards
    if (collectionResponse && collectionResponse.data.cardIds) {
      cardIds = collectionResponse.data.cardIds;
      url = `http://localhost:4000/api/collections/${
        req.params.collection_id
      }/cards?page=${page}&cardIds=${cardIds.join(",")}`;
    } else if (wishlistResponse && wishlistResponse.data.cardIds) {
      cardIds = wishlistResponse.data.cardIds;
      url = `http://localhost:4000/api/wishlist/${
        req.wishlistId
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
        route: req.originalUrl,
        collectionId: req.params.collection_id,
        wishlistId: req.wishlistId,
        userId: req.session.userID,
        collectionOwner: collectionOwner,
        wishlistOwner: wishlistOwner,
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
      const wishlistId = req.wishlistId;
      res.render("card", {
        card: card,
        wishlistId: wishlistId,
        collections: userCollections,
        success: req.flash("success"),
        error: req.flash("error"),
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("ERROR");
  }
};
