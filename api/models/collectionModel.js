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

const Rating = sequelize.define(
  "Rating",
  {
    rating_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    rating: {
      type: DataTypes.ENUM("1", "2", "3", "4", "5"),
      allowNull: false,
    },
    collection_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "rating",
    timestamps: false,
    freezeTableName: true,
  }
);

Rating.belongsTo(Collection, {
  foreignKey: "collection_id",
});
Collection.hasMany(Rating, {
  foreignKey: "collection_id",
});

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

/*
 * this gets a list of each rating, i.e. 1,2,3,4,5 and the count of each rating
 * it also gets the average rating (1 dp) across all ratings for a collection
 */
Rating.getRatingDetails = async function (collection_id) {
  const { rows, count } = await this.findAndCountAll({
    where: {
      collection_id: collection_id,
    },
    group: ["rating"],
  });

  const average = await this.findAll({
    where: {
      collection_id: collection_id,
    },
    attributes: [[sequelize.fn("AVG", sequelize.col("rating")), "average"]],
  });

  if (!rows) {
    return null;
  } else {
    return {
      ratings: count,
      average: parseFloat(average[0].dataValues.average).toFixed(1),
    };
  }
};

Rating.getUserRating = async function (collection_id, user_id) {
  const rating = await this.findOne({
    where: {
      collection_id: collection_id,
      user_id: user_id,
    },
  });

  if (!rating) {
    return null;
  } else {
    return rating.rating;
  }
};

module.exports = {
  Collection,
  CollectionCard,
  Rating,
};
