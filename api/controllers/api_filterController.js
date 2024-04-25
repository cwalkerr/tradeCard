const {
  Sets,
  Series,
  EnergyType,
  Card,
  Subtype,
} = require("../models/cardModel.js");
const { Op } = require("sequelize");

exports.getSeries = async (req, res) => {
  try {
    let series = await Series.findAll();
    if (!series) {
      return res.status(404).json({ error: "No series found" });
    }
    return res.status(200).json((series = series.map((series) => series.name)));
  } catch (err) {
    return res.status(500).json({ error: "Error getting series" });
  }
};

exports.getSets = async (req, res) => {
  try {
    let sets = await Sets.findAll({
      group: ["series_id", "name"],
      attributes: ["name", "series_id"],
    });
    if (!sets) {
      return res.status(404).json({ error: "No sets found" });
    }
    return res.status(200).json(sets);
  } catch (err) {
    return res.status(500).json({ error: "Error getting sets" });
  }
};

exports.getSetsInSeries = async (req, res) => {
  try {
    let series = await Series.findAll();
    if (!series) {
      return res.status(404).json({ error: "No series found" });
    }

    let seriesWithSets = await Promise.all(
      series.map(async (series) => {
        let sets = await Sets.findAll({
          where: { series_id: series.series_id },
        });
        return {
          series: series.name,
          sets: sets.map((set) => set.name),
        };
      })
    );

    return res.status(200).json(seriesWithSets);
  } catch (err) {
    return res.status(500).json({ error: "Error getting sets" });
  }
};

exports.getEnergyTypes = async (req, res) => {
  try {
    let energyTypes = await EnergyType.findAll();
    if (!energyTypes) {
      return res.status(404).json({ error: "No energy types found" });
    }
    return res
      .status(200)
      .json((energyTypes = energyTypes.map((energyType) => energyType.type)));
  } catch (err) {
    return res.status(500).json({ error: "Error getting energy types" });
  }
};

exports.getRarities = async (req, res) => {
  try {
    let rarities = await Card.findAll({
      attributes: ["rarity"],
      group: ["rarity"],
      where: { rarity: { [Op.not]: null } },
      distinct: true,
    });
    if (!rarities) {
      return res.status(404).json({ error: "No rarities found" });
    }
    return res
      .status(200)
      .json((rarities = rarities.map((rarity) => rarity.rarity)));
  } catch (err) {
    return res.status(500).json({ error: "Error getting rarities" });
  }
};

exports.getSubtypes = async (req, res) => {
  try {
    let subtypes = await Subtype.findAll();
    if (!subtypes) {
      return res.status(404).json({ error: "No subtypes found" });
    }
    return res
      .status(200)
      .json((subtypes = subtypes.map((subtype) => subtype.type)));
  } catch (err) {
    return res.status(500).json({ error: "Error getting subtypes" });
  }
};
