const axios = require("axios");
const API_CARD_URL = "http://localhost:4000/api/cards";
const SUCCESS_STATUS_CODE = 200;

/**
 * Populate and render the card grid view with cards based on the request
 * If the request is for a collection or wishlist, the cards are passed into this function else fetch from api
 * handles pagination for the front end
 * also, passes the view collection details (name, description username), ratings and comments / or wishlist details
 * still rather heavy, but its improved - improve further by splitting out the pagination logic at least
 * -look into if i can pass the view data from multiple functions...
 */
exports.cardGrid = async (req, res, next) => {
  const page = req.query.page || 1;
  let cards;
  let totalPages;
  let currentPage;

  // assign view data based on the request, collection, wishlist or all cards
  if (typeof req.cardsInCollection !== "undefined") {
    // null is a valid value - api returns null if no cards in collection - maybe a better way to handle this seems a bit hacky
    cards = req.cardsInCollection ? req.cardsInCollection.cards : null;
    totalPages = req.cardsInCollection
      ? req.cardsInCollection.totalPages
      : null;
    currentPage = req.cardsInCollection
      ? req.cardsInCollection.currentPage
      : null;
  } else if (typeof req.cardsInWishlist !== "undefined") {
    cards = req.cardsInWishlist ? req.cardsInWishlist.cards : null;
    totalPages = req.cardsInWishlist ? req.cardsInWishlist.totalPages : null;
    currentPage = req.cardsInWishlist ? req.cardsInWishlist.currentPage : null;
  } else {
    try {
      const allCards = await axios.get(`${API_CARD_URL}/grid?page=${page}`);
      if (allCards.status === SUCCESS_STATUS_CODE) {
        cards = allCards.data.cards;
        totalPages = allCards.data.totalPages;
        currentPage = allCards.data.currentPage;
      }
    } catch (err) {
      next(
        new Error(
          err.response.data.error || err.message || "Error getting cards"
        )
      );
      return;
    }
  }
  /**
   * PAGINATION
   */
  // Start and end page numbers for pagination - 4 pages either side of current page
  let startPage = Math.max(1, currentPage - 4);
  let endPage = Math.min(totalPages, currentPage + 4);

  // If at start of pagination, shift end page number
  if (startPage === 1) {
    endPage = Math.min(totalPages, startPage + 8);
  }

  // If at end of pagination, shift start page number
  if (endPage === totalPages) {
    startPage = Math.max(1, endPage - 8);
  }
  // Render the cards view - still could clean this up a bit more
  res.render("cards", {
    cards: cards,
    totalPages: totalPages,
    currentPage: currentPage,
    startPage: startPage,
    endPage: endPage,
    success: req.flash("success"),
    error: req.flash("error"),
    route: req.originalUrl,
    userId: req.session.userID,
    collectionData: req.collections,
    wishlistData: req.wishlist,
    ratingData: req.collectionRatings,
    getCount: (ratingValue) => {
      const ratingCount = req.collectionRatings.ratings.find(
        (rating) => rating.rating == ratingValue
      );
      return ratingCount ? ratingCount.count : 0;
    },
    comments: req.collectionComments,
  });
};

/**
 * Populate and render individual card details view
 * passes wishlist and collection data to allow for adding to wishlist or collection
 */
exports.cardDetails = async (req, res, next) => {
  const cardId = req.params.id;
  try {
    const cardDetails = await axios.get(`${API_CARD_URL}/${cardId}`);

    if (cardDetails.status === SUCCESS_STATUS_CODE) {
      const card = cardDetails.data.cards[0];
      res.render("card", {
        card: card,
        wishlistData: req.wishlist,
        collectionData: req.collections,
        userId: req.session.userID,
        success: req.flash("success"),
        error: req.flash("error"),
      });
    }
  } catch (err) {
    next(
      new Error(err.response.data.error || err.message || "Error getting card")
    );
    return;
  }
};
