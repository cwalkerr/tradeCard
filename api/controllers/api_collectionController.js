const {
  Collection,
  CollectionCard,
} = require("../models/modelAssosiations.js");
const app_cardController = require("../../web/controllers/app_cardController.js");

/**
 *  creates a new collection for the session user
 * @param {*} req
 * @param {*} res
 * @returns json response
 */
exports.createCollection = async (req, res) => {
  const { collectionName, collectionDescription, user_id } = req.body;

  try {
    await Collection.create({
      name: collectionName,
      description: collectionDescription,
      user_id: user_id,
    });

    return res.status(201).json({ success: "Collection created" });
  } catch (err) {
    return res.status(500).json({ error: "Error creating collection" });
  }
};

/**
 * gets all collections
 * if user_id is specified, gets only logged in users collections
 * else gets all collections
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getCollections = async (req, res) => {
  const user_id = req.query.user_id;

  try {
    let collections;
    if (user_id) {
      collections = await Collection.findAll({
        where: {
          user_id: user_id,
        },
      });
    } else {
      collections = await Collection.findAll();
    }
    return res.status(200).json(collections);
  } catch (err) {
    return res.status(500).json({ error: "Error getting collections" });
  }
};

/**
 * deletes a collection for the session user
 * @param {} req
 * @param {*} res
 * @returns
 */
exports.deleteCollection = async (req, res) => {
  const collectionID = req.params.id;

  // get the collection to be deleted
  try {
    const collection = await Collection.findOne({
      where: {
        collection_id: collectionID,
      },
    });

    // check if user is authorised to delete
    if (Number(req.query.user_id) !== collection.user_id) {
      return res
        .status(403)
        .json({ error: "You are not authorised to delete this collection" });
    }

    // delete all cards in the collection first
    await CollectionCard.destroy({
      where: {
        collection_id: collectionID,
      },
    });

    // if so, continue with delete
    await Collection.destroy({
      where: {
        collection_id: collectionID,
      },
    });

    return res.status(200).json({ success: "Collection deleted" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Error deleting collection" });
  }
};

/**
 * gets card ids that belong in the specified collection
 * @param {} req
 * @param {*} res
 * @returns
 */
exports.getCardsInCollection = async (req, res, next) => {
  // get collection from req param
  const collection = await Collection.findByPk(req.params.id);

  // find array of card id's that belong in this collection...
  try {
    const collectionCardIDs = await CollectionCard.getCardsInCollection(
      collection.collection_id
    );

    if (!collectionCardIDs) {
      return res.status(404).json({ error: "This collection has no cards" });
    }

    // parse array of ids into a CS string to use in query param
    req.query.cardIds = collectionCardIDs.join(",");
    req.collectionUserId = collection.user_id;

    next();
  } catch (err) {
    return res.status(500).json({ error: "Error getting cards in collection" });
  }
};

/**
 * adds a card to a collection
 * @param {} req
 * @param {*} res
 * @returns
 */
exports.addCardToCollection = async (req, res) => {
  const { card_id } = req.body;
  const collection_id = req.params.id;

  try {
    await CollectionCard.addCardToCollection(collection_id, card_id);
    return res.status(201).json({ success: "Card added to collection" });
  } catch (err) {
    return res.status(500).json({ error: "Error adding card to collection" });
  }
};

exports.removeCardFromCollection = async (req, res) => {
  const { card_id, collection_id } = req.params;

  try {
    await CollectionCard.destroy({
      where: {
        collection_id: collection_id,
        card_id: card_id,
      },
    });
    return res.status(200).json({ success: "Card removed from collection" });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Error removing card from collection" });
  }
};
