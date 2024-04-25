const { Op } = require("sequelize");

exports.formatFilters = (queryString) => {
  let queryObj = new URLSearchParams(queryString);
  let keys = [...queryObj.keys()];
  let query = {};

  if (keys.includes("pokemonName")) {
    query.name = { [Op.substring]: `%${queryObj.get("pokemonName")}%` };
    console.log("query.name", query.name);
  }

  if (keys.includes("cardType")) {
    query.type = { [Op.in]: queryObj.get("cardType").split(",") };
  }

  if (keys.includes("rarity")) {
    query.rarity = { [Op.in]: queryObj.get("rarity").split(",") };
  }

  if (keys.includes("artist") && keys.includes("artistName")) {
    query.artist = {
      [Op.or]: [
        { [Op.in]: queryObj.get("artist").split(",") },
        { [Op.substring]: `%${queryObj.get("artistName")}%` },
      ],
    };
  } else if (keys.includes("artist")) {
    query.artist = { [Op.in]: queryObj.get("artist").split(",") };
  } else if (keys.includes("artistName")) {
    query.artist = { [Op.substring]: `%${queryObj.get("artistName")}%` };
  }

  if (keys.includes("health")) {
    const health = queryObj.get("health").split(",");
    if (!(health[0] === "0" && health[1] === "340")) {
      query.hp = {
        [Op.between]: [parseInt(health[0]), parseInt(health[1])],
      };
    }
  }

  if (keys.includes("retreatCost")) {
    const retreatCost = queryObj.get("retreatCost").split(",");
    if (!(retreatCost[0] === "0" && retreatCost[1] === "5")) {
      query.retreat_cost = {
        [Op.between]: [parseInt(retreatCost[0]), parseInt(retreatCost[1])],
      };
    }
  }

  if (keys.includes("subtype")) {
    query.Subtype = {
      type: { [Op.in]: queryObj.get("subtype").split(",") },
    };
  }

  if (keys.includes("series")) {
    query.Series = {
      name: { [Op.in]: queryObj.get("series").split(",") },
    };
  }

  if (keys.includes("set")) {
    query.Sets = { name: { [Op.in]: queryObj.get("set").split(",") } };
  }

  if (keys.includes("abilityType")) {
    query.Ability = {
      type: { [Op.in]: queryObj.get("abilityType").split(",") },
    };
  }

  if (keys.includes("energyType")) {
    query.EnergyType = {
      type: { [Op.in]: queryObj.get("energyType").split(",") },
    };
  }

  if (keys.includes("weaknessEnergyType")) {
    query.Weakness = {
      type: { [Op.eq]: "Weakness" },
    };
    query.WeaknessEnergyType = {
      type: { [Op.in]: queryObj.get("weaknessEnergyType").split(",") },
    };
  }

  if (keys.includes("resistanceEnergyType")) {
    query.Resistance = {
      type: { [Op.eq]: "Resistance" },
    };
    query.ResistanceEnergyType = {
      type: { [Op.in]: queryObj.get("resistanceEnergyType").split(",") },
    };
  }

  if (keys.includes("attackCost")) {
    const attackCost = queryObj.get("attackCost").split(",");
    if (!(attackCost[0] === "0" && attackCost[1] === "5")) {
      query.Attack = {
        cost_converted: {
          [Op.between]: [parseInt(attackCost[0]), parseInt(attackCost[1])],
        },
      };
    }
  }
  if (keys.includes("attackName")) {
    if (!query.Attack) {
      query.Attack = {};
    }
    query.Attack.name = { [Op.substring]: `%${queryObj.get("attackName")}%` };
  }

  return query;
};
