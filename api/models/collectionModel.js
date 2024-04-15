const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db.js");

// Define the Collection and collection_card bridge table models
const Collection = sequelize.define(
  "Collection",
  {
    collection_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "collection",
    timestamps: false,
    freezeTableName: true,
  }
);

const CollectionCard = sequelize.define(
  "CollectionCard",
  {
    collection_card_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    collection_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    card_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "collection_card",
    timestamps: false,
    freezeTableName: true,
  }
);

// find all cards in a collection return only the card_id's to be used in card model queries
// this is a fairly basic query, so probably doesn't need to be in the model
CollectionCard.getCardsInCollection = async function (collection_id) {
  const cardsInCollection = await this.findAll({
    where: {
      collection_id: collection_id,
    },
  });

  if (!cardsInCollection) {
    return null;
  } else {
    return cardsInCollection.map((card) => card.dataValues.card_id);
  }
};

// same as above, probably not necessary in model but used in controller so will revise later
CollectionCard.addCardToCollection = async function (collection_id, card_id) {
  await this.create({
    collection_id: collection_id,
    card_id: card_id,
  });
};

module.exports = {
  Collection,
  CollectionCard,
};
