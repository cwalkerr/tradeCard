const axios = require("axios");

exports.getUserCollections = async (req, res, next) => {
  try {
    const collectionTiles = await axios.get(
      `http://localhost:4000/api/collections?user_id=${req.session.userID}`
    );

    if (collectionTiles.status === 200) {
      req.userCollections = collectionTiles.data;
    } else {
      req.flash("error", "Unable to fetch collections");
    }
    next();
  } catch (err) {
    req.flash("error", err.response.data.error || "An error occurred");
    return res.redirect("/dashboard");
  }
};

exports.userCollectionsGrid = async (req, res) => {
  try {
    res.render("userCollections", {
      success: req.flash("success"),
      error: req.flash("error"),
      collections: req.userCollections,
    });
  } catch (err) {
    req.flash("error", err.response.data.error || "An error occurred");
    return res.redirect("/dashboard");
  }
};

// NOTE : not yet implemented - theis can be incorporated into the userCollectionsGrid function
exports.collectionsGrid = async (req, res) => {
  try {
    const collectionTiles = await axios.get(
      "http://localhost:4000/api/collections"
    );

    if (collectionTiles.status === 200) {
      const collections = collectionTiles.data;

      //need a dif page for all collections....
      res.render("userCollections", {
        success: req.flash("success"),
        error: req.flash("error"),
        collections: collections,
      });
    }
  } catch (err) {
    req.flash("error", err.response.data.error || "An error occurred");
    return res.redirect("/dashboard");
  }
};

exports.createCollection = async (req, res) => {
  const { collectionName, collectionDescription } = req.body;
  const user_id = req.session.userID;

  try {
    const createCollection = await axios.post(
      `http://localhost:4000/api/collections/create`,
      {
        collectionName: collectionName,
        collectionDescription: collectionDescription,
        user_id: user_id,
      }
    );

    if (createCollection.status === 201) {
      req.flash(
        "success",
        createCollection.data.success || "Collection created"
      );
    }

    res.redirect("/collections/user");
  } catch (err) {
    req.flash("error", err.response.data.error || "An error occurred");
    res.redirect("/collections/user");
  }
};

exports.deleteCollection = async (req, res) => {
  try {
    const deleteCollection = await axios.delete(
      `http://localhost:4000/api/collections/${req.params.id}?user_id=${req.session.userID}`
    );

    if (deleteCollection.status === 200) {
      req.flash(
        "success",
        deleteCollection.data.success || "Collection deleted"
        // maybe not good to call the alternative the same as the success message
        //- wont know if it is returning success message or the alternative
      );
    }
    res.redirect("/collections/user");
  } catch (err) {
    console.log(err);
    req.flash("error", err.response.data.error || "An error occurred");
    res.redirect("/collections/user");
  }
};

exports.addCardToCollection = async (req, res) => {
  const { collection_id, card_id } = req.body;

  try {
    const addCard = await axios.post(
      `http://localhost:4000/api/collections/${collection_id}/cards`,
      {
        card_id: card_id,
      }
    );

    if (addCard.status === 201) {
      req.flash("success", addCard.data.success || "Card added to collection");
    }

    res.redirect(`/cards/${card_id}`);
  } catch (err) {
    req.flash("error", err.response.data.error || "An error occurred");
    res.redirect(`/cards/${card_id}`);
  }
};

exports.removeCardFromCollection = async (req, res) => {
  const { collection_id, card_id } = req.params;

  try {
    const removeCard = await axios.delete(
      `http://localhost:4000/api/collections/${collection_id}/cards/${card_id}`
    );

    if (removeCard.status === 200) {
      req.flash(
        "success",
        removeCard.data.success || "Card removed from collection"
      );
    }
    res.redirect(`/collections/${collection_id}/cards`);
  } catch (err) {
    req.flash("error", err.response.data.error || "An error occurred");
    res.redirect(`/collections/${collection_id}/cards`);
  }
};
