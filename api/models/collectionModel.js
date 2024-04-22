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

const Comment = sequelize.define(
  "Comment",
  {
    comment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    comment: {
      type: DataTypes.TEXT,
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
    tableName: "comment",
    createdAt: "created_at",
    updatedAt: false,
    freezeTableName: true,
  }
);

// comment - collection relationship
Comment.belongsTo(Collection, {
  foreignKey: "collection_id",
});
Collection.hasMany(Comment, {
  foreignKey: "collection_id",
});

// rating - collection relationship
Rating.belongsTo(Collection, {
  foreignKey: "collection_id",
});
Collection.hasMany(Rating, {
  foreignKey: "collection_id",
});

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

module.exports = {
  Collection,
  CollectionCard,
  Rating,
  Comment,
};
