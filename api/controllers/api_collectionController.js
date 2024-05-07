const {
  Card,
  Collection,
  CollectionCard,
  User,
} = require("../models/modelAssosiations.js");
const { tryCatch } = require("../../utility/tryCatch.js");
const apiError = require("../../utility/customError.js");

/**
 * generates a where clause for get requests based on user_id or collection_id or all
 * @param {*} user_id
 * @param {*} collection_id
 * @returns the query object to be passed to get functions
 */
const generateQuery = (user_id, collection_id) => {
  let whereClause = {};

  if (collection_id) {
    whereClause = {
      collection_id: collection_id,
    };
  } else if (user_id) {
    whereClause = {
      user_id: user_id,
    };
  }

  const query = {
    where: whereClause,
    include: [
      {
        model: User,
        attributes: ["username"],
      },
    ],
  };
  return query;
};

const verifyOwner = async (user_id, collection_id) => {
  const collection = await Collection.findOne({
    where: {
      collection_id: collection_id,
    },
  });

  if (!collection) {
    throw new apiError("Collection not found", 404);
  }

  return collection.user_id === user_id ? true : false;
};

/**
 * gets collections based on user_id or collection_id or all
 */
exports.getCollections = async (req, res) => {
  const collection_id = req.params.id;
  const user_id = req.query.user_id;
  let collections;

  try {
    if (collection_id) {
      // get collection by id
      collections = await Collection.findOne(
        generateQuery(null, collection_id)
      );
    } else if (user_id) {
      // get collections for a user
      collections = await Collection.findAll(generateQuery(user_id, null));
    } else {
      // get all collections
      collections = await Collection.findAll(generateQuery(null, null));
    }
    return res.status(200).json(collections);
  } catch (err) {
    return res.status(500).json({ error: "Error getting collections" });
  }
};

/**
 * creates a new collection for the session user
 * @param {*} req
 * @param {*} res
 * @returns json success or error message
 */
exports.createCollection = tryCatch(async (req, res) => {
  const { name, description, user_id } = req.body;

  if (!name || !user_id) {
    throw new apiError("Missing fields", 400);
  }

  if (user_id !== req.user.id) {
    throw new apiError("You are not authorised to create this collection", 403);
  }
  await Collection.create({
    name: name,
    description: description,
    user_id: user_id,
  });
  return res.status(201).json({ success: "Collection created" });
});

/**
 * deletes a collection for the session user
 * @param {} req
 * @param {*} res
 * @returns json success or error message
 */
exports.deleteCollection = tryCatch(async (req, res) => {
  const collectionID = req.params.id;

  if (!(await verifyOwner(req.user.id, collectionID))) {
    throw new apiError("You are not authorised to delete this collection", 403);
  }

  // delete all cards in the collection first to avoid foreign key constraint
  await CollectionCard.destroy({
    where: {
      collection_id: collectionID,
    },
  });

  // continue with delete
  await Collection.destroy({
    where: {
      collection_id: collectionID,
    },
  });

  return res.status(200).json({ success: "Collection deleted" });
});

/**
 * gets card ids that belong in the specified collection
 * then gets the card details for those card ids
 * @param {} req
 * @param {*} res
 * @returns json array of cards in the collection
 */
exports.getCardsInCollection = async (req, res) => {
  const page = Number(req.query.page) || 1;

  try {
    const collectionCards = await CollectionCard.findAll({
      where: {
        collection_id: req.params.id,
      },
      attributes: ["card_id"],
      raw: true,
    });
    if (collectionCards.length === 0) {
      return res.json(null);
    }
    const cardIds = collectionCards.map((card) => card.card_id);
    const cards = await Card.getCardDetails({ card_id: cardIds }, page);
    return res.status(200).json(cards);
  } catch (err) {
    return res.status(500).json({ error: "Error getting cards" });
  }
};

/**
 * adds a card to a collection
 * @param {} req
 * @param {*} res
 * @returns json success or error message
 */
exports.addCardToCollection = tryCatch(async (req, res) => {
  const { collection_id, card_id } = req.params;

  if ((await verifyOwner(req.user.id, collection_id)) === false) {
    throw new apiError(
      "You are not authorised to add cards to this collection",
      403
    );
  }

  await CollectionCard.create({
    collection_id: collection_id,
    card_id: card_id,
  });

  return res.status(201).json({ success: "Card added to collection" });
});

/**
 * removes a card from a collection
 * @param {*} req
 * @param {*} res
 * @returns success or error message
 */
exports.removeCardFromCollection = tryCatch(async (req, res) => {
  const { collection_id, card_id } = req.params;

  if ((await verifyOwner(req.user.id, collection_id)) === false) {
    throw new apiError(
      "You are not authorised to remove cards from this collection",
      403
    );
  }
  const removeCard = await CollectionCard.destroy({
    where: {
      collection_id: collection_id,
      card_id: card_id,
    },
    limit: 1,
  });

  if (removeCard === 0) {
    throw new apiError("Card not found in collection", 404);
  }

  return res.status(200).json({ success: "Card removed from collection" });
});
