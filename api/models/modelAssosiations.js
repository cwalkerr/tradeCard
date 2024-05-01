/**
 * This file is used to define associations between models from different files
 */
const { Card } = require("./cardModel.js");
const { User } = require("./userModel.js");
const {
  Collection,
  CollectionCard,
  Rating,
  Comment,
} = require("./collectionModel.js");
const { Wishlist, WishlistCard } = require("./wishlistModel.js");
const RefreshToken = require("./refreshTokenModel.js");

// associations between Wishlist, User and Card
User.hasOne(Wishlist, { foreignKey: "user_id" });
Wishlist.belongsTo(User, { foreignKey: "user_id" });

Wishlist.belongsToMany(Card, {
  through: WishlistCard,
  foreignKey: "wishlist_id",
});
Card.belongsToMany(Wishlist, {
  through: WishlistCard,
  foreignKey: "card_id",
});

// associations between Card, User and Collection
User.hasMany(Collection, { foreignKey: "user_id" });
Collection.belongsTo(User, { foreignKey: "user_id" });

Collection.belongsToMany(Card, {
  through: CollectionCard,
  foreignKey: "collection_id",
});
Card.belongsToMany(Collection, {
  through: CollectionCard,
  foreignKey: "card_id",
});

// associations between User and Rating
User.hasMany(Rating, { foreignKey: "user_id" });
Rating.belongsTo(User, { foreignKey: "user_id" });

// association between Comment and User
User.hasMany(Comment, { foreignKey: "user_id" });
Comment.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(RefreshToken, { foreignKey: "user_id" });
RefreshToken.belongsTo(User, { foreignKey: "user_id" });

module.exports = {
  User,
  Collection,
  CollectionCard,
  Card,
  Wishlist,
  WishlistCard,
  Rating,
  Comment,
  RefreshToken,
};
