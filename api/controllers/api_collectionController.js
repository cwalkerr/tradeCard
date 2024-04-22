const {
  Card,
  Collection,
  CollectionCard,
  User,
} = require("../models/modelAssosiations.js");

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
    console.log(err);
    return res.status(500).json({ error: "Error getting collections" });
  }
};

/**
 * creates a new collection for the session user
 * @param {*} req
 * @param {*} res
 * @returns json success or error message
 */
exports.createCollection = async (req, res) => {
  const { name, description, user_id } = req.body;

  try {
    await Collection.create({
      name: name,
      description: description,
      user_id: user_id,
    });

    return res.status(201).json({ success: "Collection created" });
  } catch (err) {
    return res.status(500).json({ error: "Error creating collection" });
  }
};

/**
 * deletes a collection for the session user
 * @param {} req
 * @param {*} res
 * @returns json success or error message
 */
exports.deleteCollection = async (req, res) => {
  const collectionID = req.params.id;

  // get the collection to be deleted, if the user is not authorised to delete it, return 403 - may not be necessary after api security is implemented..
  try {
    const collection = await Collection.findOne({
      where: {
        collection_id: collectionID,
      },
    });

    // check if user is authorised to delete // this may not be necessary after api security is implemented
    if (Number(req.query.user_id) !== collection.user_id) {
      return res
        .status(403)
        .json({ error: "You are not authorised to delete this collection" });
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
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Error deleting collection" });
  }
};

/**
 * gets card ids that belong in the specified collection
 * then gets the card details for those card ids
 * maybe can have a seperate function to get the ids
 * then either use getCardDetails or getCardGrid depemding on the use case (web app or api)
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
    });

    if (!collectionCards) {
      return res.status(404).json({ error: "No cards found" });
    }
    const cardIds = collectionCards.map((card) => card.card_id); // get card ids from collection cards pass to getCardDetails
    const cards = await Card.getCardDetails({ card_id: cardIds }, page);
    // using getCardDetails could cause somewhat slower load times if there are >20 cards in a collection (>2.5s just for the api call)
    // however, i want api users to be able to get card details in a collection.. think this through
    return res.status(200).json(cards);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Error getting cards" });
  }
};

/**
 * adds a card to a collection
 * @param {} req
 * @param {*} res
 * @returns json success or error message
 */
exports.addCardToCollection = async (req, res) => {
  const { collection_id, card_id } = req.params;

  try {
    await CollectionCard.create({
      collection_id: collection_id,
      card_id: card_id,
    });
    return res.status(201).json({ success: "Card added to collection" });
  } catch (err) {
    return res.status(500).json({ error: "Error adding card to collection" });
  }
};

/**
 * removes a card from a collection
 * @param {*} req
 * @param {*} res
 * @returns success or error message
 */
exports.removeCardFromCollection = async (req, res) => {
  const { collection_id, card_id } = req.params;

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
