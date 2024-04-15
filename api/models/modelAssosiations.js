/**
 * This file is used to define associations between models from different files
 */
const { Card } = require("./cardModel.js");
const User = require("./userModel.js");
const { Collection, CollectionCard } = require("./collectionModel.js");

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

module.exports = {
  User,
  Collection,
  CollectionCard,
  Card,
};
