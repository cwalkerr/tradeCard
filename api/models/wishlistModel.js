const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Wishlist = sequelize.define(
  "Wishlist",
  {
    wishlist_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "wishlist",
    timestamps: false,
    freezeTableName: true,
  }
);

const WishlistCard = sequelize.define(
  "WishlistCard",
  {
    wishlist_card_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    wishlist_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    card_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "wishlist_card",
    timestamps: false,
    freezeTableName: true,
  }
);

WishlistCard.getCardsInWishlist = async function (wishlist_id) {
  const wishlistCards = await this.findAll({
    where: {
      wishlist_id: wishlist_id,
    },
  });
  if (!wishlistCards) {
    return null;
  } else {
    return wishlistCards.map((card) => card.dataValues.card_id);
  }
};

module.exports = { Wishlist, WishlistCard };
