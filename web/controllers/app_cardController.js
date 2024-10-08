const axios = require("axios");
const API_CARD_URL = "http://localhost:4000/api/cards";
const SUCCESS_STATUS_CODE = 200;

// calculates the pagination for the view
const calculatePagination = (currentPage, totalPages) => {
  let startPage = Math.max(1, currentPage - 4);
  let endPage = Math.min(totalPages, currentPage + 4);

  if (startPage === 1) {
    endPage = Math.min(totalPages, startPage + 8);
  }

  if (endPage === totalPages) {
    startPage = Math.max(1, endPage - 8);
  }

  return { startPage, endPage };
};

exports.cardGrid = async (req, res, next) => {
  const { page, ...checkedBoxes } = req.query;
  let count = 0;
  let cards = null;
  let totalPages;
  let currentPage;

  if (req.originalUrl.includes("/collections")) {
    if (req.cardsInCollection !== null) {
      cards = req.cardsInCollection.cards;
      totalPages = req.cardsInCollection.totalPages;
      currentPage = req.cardsInCollection.currentPage;
    }
  } else if (req.originalUrl.includes("/wishlist")) {
    if (req.cardsInWishlist !== null) {
      cards = req.cardsInWishlist.cards;
      totalPages = req.cardsInWishlist.totalPages;
      currentPage = req.cardsInWishlist.currentPage;
    }
  } else {
    const query = new URLSearchParams({ ...checkedBoxes, page }).toString();

    try {
      const allCards = await axios.get(`${API_CARD_URL}/grid?${query}`);
      if (allCards.status === SUCCESS_STATUS_CODE) {
        if (allCards.data === null) {
          cards = null;
        } else {
          cards = allCards.data.cards;
          count = allCards.data.count;
          totalPages = allCards.data.totalPages;
          currentPage = allCards.data.currentPage;
        }
      }
    } catch (err) {
      res.redirect("/cards");
    }
  }

  const { startPage, endPage } = calculatePagination(currentPage, totalPages);
  let success;
  let error;
  req.query.success ? (success = req.query.success) : (success = "");
  req.query.error ? (error = req.query.error) : (error = "");

  let data = {
    cards: cards,
    count: count,
    totalPages: totalPages,
    currentPage: currentPage,
    checkedBoxes: checkedBoxes,
    startPage: startPage,
    endPage: endPage,
    success: success,
    error: error,
    route: req.originalUrl,
    userId: req.user ? req.user.id : null,
    seriesSets: req.seriesSets,
    energyTypes: req.energyTypes,
    rarities: req.rarities,
    subtypes: req.subtypes,
  };

  if (req.originalUrl.includes("/collections")) {
    data = {
      ...data,
      collectionData: req.collections,
      ratingData: req.collectionRatings,
      comments: req.collectionComments,
      getCount: (ratingValue) => {
        const ratingCount = req.collectionRatings.ratings.find(
          (rating) => rating.rating == ratingValue
        );
        return ratingCount ? ratingCount.count : 0;
      },
    };
  }

  if (req.user && req.originalUrl.includes("/wishlist")) {
    data = {
      ...data,
      wishlistData: req.wishlist,
    };
  }

  res.render("cards", data);
};

/**
 * Populate and render individual card details view
 * passes wishlist and collection data to allow for adding to wishlist or collection
 */
exports.cardDetails = async (req, res) => {
  const cardId = req.params.id;
  let success;
  let error;
  const userId = req.user ? req.user.id : null;
  req.query.success ? (success = req.query.success) : (success = "");
  req.query.error ? (error = req.query.error) : (error = "");

  try {
    const cardDetails = await axios.get(`${API_CARD_URL}/${cardId}`);

    if (cardDetails.status === SUCCESS_STATUS_CODE) {
      const card = cardDetails.data.cards[0];
      res.render("card", {
        card: card,
        wishlistData: req.wishlist ? req.wishlist : null,
        collectionData: req.collections ? req.collections : null,
        userId: userId,
        success: success,
        error: error,
      });
    }
  } catch (err) {
    const error = new URLSearchParams({
      error: err.response.data.error || err.message || "Error getting card",
    }).toString();
    return res.redirect(`/cards/${cardId}?${error}`);
  }
};
