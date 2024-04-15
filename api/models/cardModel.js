// bit of a mess but this file contains all the models for the attributes of a card

const { DataTypes, Op } = require("sequelize");
const sequelize = require("../../config/db.js");

/**
 * CARD MODEL
 */
const Card = sequelize.define(
  "Card",
  {
    card_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("Pokemon", "Trainer", "Energy"),
      allowNull: false,
    },
    hp: {
      type: DataTypes.INTEGER,
    },
    rarity: {
      type: DataTypes.STRING,
    },
    level: {
      type: DataTypes.STRING,
    },
    number: {
      type: DataTypes.INTEGER,
    },
    artist: {
      type: DataTypes.STRING,
    },
    flavour_text: {
      type: DataTypes.TEXT,
    },
    pokedex_number: {
      type: DataTypes.INTEGER,
    },
    sets_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "card",
    timestamps: false,
    freezeTableName: true,
  }
);

/**
 * ABILITY MODEL
 */
const Ability = sequelize.define(
  "Ability",
  {
    ability_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "ability",
    timestamps: false,
    freezeTableName: true,
  }
);

/**
 * ATTACK MODEL
 */
const Attack = sequelize.define(
  "Attack",
  {
    attack_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    damage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cost_converted: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "attack",
    timestamps: false,
    freezeTableName: true,
  }
);

/**
 * ATTACK COST MODEL
 */
const AttackCost = sequelize.define(
  "AttackCost",
  {
    attack_cost_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    attack_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    energy_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "attack_cost",
    timestamps: false,
    freezeTableName: true,
  }
);

/**
 * BUFF/DEBUFF MODEL
 */

const BuffDebuff = sequelize.define(
  "BuffDebuff",
  {
    buff_debuff_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    energy_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    variable: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "buff_debuff",
    timestamps: false,
    freezeTableName: true,
  }
);

/**
 * CARD ABILITY MODEL
 */
const CardAbility = sequelize.define(
  "CardAbility",
  {
    card_ability_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    card_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ability_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "card_ability",
    timestamps: false,
    freezeTableName: true,
  }
);

/**
 * CARD ATTACK MODEL
 */
const CardAttack = sequelize.define(
  "CardAttack",
  {
    card_attack_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    card_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    attack_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "card_attack",
    timestamps: false,
    freezeTableName: true,
  }
);

/**
 * CARD BUFF/DEBUFF MODEL
 */
const CardBuffDebuff = sequelize.define(
  "CardBuffDebuff",
  {
    card_buff_debuff_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    card_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    buff_debuff_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "card_buff_debuff",
    timestamps: false,
    freezeTableName: true,
  }
);

/**
 * ENERGY TYPE MODEL
 */
const EnergyType = sequelize.define(
  "EnergyType",
  {
    energy_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "energy_type",
    timestamps: false,
    freezeTableName: true,
  }
);

/**
 * Card Energy Type Model
 */
const CardEnergyType = sequelize.define(
  "CardEnergyType",
  {
    card_energy_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    card_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    energy_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "card_energy_type",
    timestamps: false,
    freezeTableName: true,
  }
);

/**
 * RULES MODEL
 */
const Rules = sequelize.define(
  "Rules",
  {
    rules_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "rules",
    timestamps: false,
    freezeTableName: true,
  }
);

/**
 * CARD RULES MODEL
 */

const CardRules = sequelize.define(
  "CardRules",
  {
    card_rules_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    card_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rules_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "card_rules",
    timestamps: false,
    freezeTableName: true,
  }
);

/**
 * SUBTYPE MODEL
 */
const Subtype = sequelize.define(
  "Subtype",
  {
    subtype_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "subtype",
    timestamps: false,
    freezeTableName: true,
  }
);

/**
 * CARD SUBTYPE MODEL
 */
const CardSubtype = sequelize.define(
  "CardSubtype",
  {
    card_subtype_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    card_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subtype_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "card_subtype",
    timestamps: false,
    freezeTableName: true,
  }
);

/**
 * EVOLUTION MODEL
 */
const Evolution = sequelize.define(
  "Evolution",
  {
    evolution_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    card_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    evolves_to_name: {
      type: DataTypes.STRING,
    },
    evolves_from_name: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "evolution",
    timestamps: false,
    freezeTableName: true,
  }
);

/**
 * IMAGE MODEL
 */
const Image = sequelize.define(
  "Image",
  {
    image_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    card_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.ENUM("Small", "Large"),
      allowNull: false,
    },
  },
  {
    tableName: "image",
    timestamps: false,
    freezeTableName: true,
  }
);

/**
 * RETREAT COST MODEL
 */
const RetreatCost = sequelize.define(
  "RetreatCost",
  {
    retreat_cost_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    card_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    energy_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "retreat_cost",
    timestamps: false,
    freezeTableName: true,
  }
);

/**
 * SET MODEL
 */
const Set = sequelize.define(
  "Set",
  {
    sets_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total_cards: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    release_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
    standard_legality: {
      type: DataTypes.BOOLEAN,
    },
    expanded_legality: {
      type: DataTypes.BOOLEAN,
    },
    unlimited_legality: {
      type: DataTypes.BOOLEAN,
    },

    series_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "sets",
    timestamps: false,
    freezeTableName: true,
  }
);

/**
 * SERIES MODEL
 */
const Series = sequelize.define(
  "Series",
  {
    series_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "series",
    timestamps: false,
    freezeTableName: true,
  }
);

/**
 * ASSOCIATIONS
 */

// assosiations between Set & series
Series.hasMany(Set, { foreignKey: "series_id" });
Set.belongsTo(Series, { foreignKey: "series_id" });

// set has many cards / card belongs to one set
Set.hasMany(Card, { foreignKey: "sets_id" });
Card.belongsTo(Set, { foreignKey: "sets_id" });

// card has many images / image belongs to one card
Card.hasMany(Image, { foreignKey: "card_id" });
Image.belongsTo(Card, { foreignKey: "card_id" });

// evolution belongs to one card / card has one evolution
Card.hasOne(Evolution, { foreignKey: "card_id" });
Evolution.belongsTo(Card, { foreignKey: "card_id" });

// retreat cost belongs to card & energy type / card has many retreat costs
Card.hasMany(RetreatCost, { foreignKey: "card_id" });
RetreatCost.belongsTo(Card, { foreignKey: "card_id" });
RetreatCost.belongsTo(EnergyType, { foreignKey: "energy_type_id" });

// card has many abilities / ability belongs to many cards
Card.belongsToMany(Ability, { through: CardAbility, foreignKey: "card_id" });
Ability.belongsToMany(Card, {
  through: CardAbility,
  foreignKey: "ability_id",
});

// card has many attacks / attack belongs to many cards
Attack.belongsToMany(Card, { through: CardAttack, foreignKey: "attack_id" });
Card.belongsToMany(Attack, { through: CardAttack, foreignKey: "card_id" });

// attack has many attack costs / attack cost belongs to one attack
Attack.hasMany(AttackCost, { foreignKey: "attack_id" });
AttackCost.belongsTo(Attack, { foreignKey: "attack_id" });

// attack cost belongs to one energy type / energy type has many attack costs
EnergyType.hasMany(AttackCost, { foreignKey: "energy_type_id" });
AttackCost.belongsTo(EnergyType, { foreignKey: "energy_type_id" });

// card has many buff/debuffs / buff/debuff belongs to many cards
Card.belongsToMany(BuffDebuff, {
  through: CardBuffDebuff,
  foreignKey: "card_id",
});
BuffDebuff.belongsToMany(Card, {
  through: CardBuffDebuff,
  foreignKey: "buff_debuff_id",
});

// buff/debuff belongs to one energy type / energy type has many buff/debuffs
BuffDebuff.belongsTo(EnergyType, { foreignKey: "energy_type_id" });
EnergyType.hasMany(BuffDebuff, { foreignKey: "energy_type_id" });

// card has many energy types / energy type belongs to many cards
Card.belongsToMany(EnergyType, {
  through: CardEnergyType,
  foreignKey: "card_id",
});
EnergyType.belongsToMany(Card, {
  through: CardEnergyType,
  foreignKey: "energy_type_id",
});

// card has many rules / rule belongs to many cards
Card.belongsToMany(Rules, {
  through: CardRules,
  foreignKey: "card_id",
});
Rules.belongsToMany(Card, {
  through: CardRules,
  foreignKey: "rules_id",
});

// card has many subtypes / subtype belongs to many cards
Card.belongsToMany(Subtype, {
  through: CardSubtype,
  foreignKey: "card_id",
});
Subtype.belongsToMany(Card, {
  through: CardSubtype,
  foreignKey: "subtype_id",
});

/**
 * Function to get all card info by its id
 * @param {} cardid
 * @returns card object in json format
 */

Card.getCard = async function (cardId) {
  const card = await this.findOne({
    where: {
      card_id: cardId,
    },
    include: [
      {
        model: Set,
        attributes: [
          "name",
          "release_date",
          "standard_legality",
          "expanded_legality",
          "unlimited_legality",
        ],
        include: [{ model: Series, attributes: ["name"] }],
      },
      { model: Image, attributes: ["url"] },
      {
        model: Evolution,
        attributes: ["evolves_to_name", "evolves_from_name"],
      },
      {
        model: RetreatCost,
        attributes: {
          exclude: ["energy_type_id", "card_id"],
        },
        include: [
          {
            model: EnergyType,
            attributes: ["type"],
          },
        ],
      },
      {
        model: Ability,
        attributes: ["name", "description", "type"],
      },
      {
        model: Attack,
        attributes: ["name", "description", "damage", "cost_converted"],
        include: [
          {
            model: AttackCost,
            attributes: {
              exclude: ["attack_id", "energy_type_id"],
            },
            include: [
              {
                model: EnergyType,
                attributes: ["type"],
              },
            ],
          },
        ],
      },

      {
        model: BuffDebuff,
        attributes: ["type", "variable"],
        include: [{ model: EnergyType, attributes: ["type"] }],
      },
      {
        model: EnergyType,
        attributes: ["type"],
      },
      {
        model: Rules,
        attributes: ["description"],
      },
      { model: Subtype, attributes: ["type"] },
    ],
  });

  if (card) {
    return card.get({ plain: true });
  } else {
    return null;
  }
};

/**
 * Gets all cards names with its image for card grid
 * includes a count of total cards
 * @param {*} cardId
 * @returns card and image url in json format
 */
Card.getCardTile = async function ({ limit, offset, cardIds }) {
  let whereClause = {};

  // if no card ids specified, whereClause will be an empty object and ignored in the below query
  if (cardIds) {
    whereClause.card_id = cardIds;
  }

  const { count, rows } = await this.findAndCountAll({
    where: whereClause,
    attributes: ["card_id", "name"],
    limit: limit,
    offset: offset,
    include: [
      {
        model: Image,
        where: { size: "Small" },
        attributes: ["url"],
      },
    ],
  });

  if (rows) {
    data = rows.map((rows) => {
      const imageUrl = rows.Images[0].url;
      const { card_id, name } = rows.dataValues;
      return {
        card_id,
        name,
        image: imageUrl,
      };
    });
    return { data, count };
  } else {
    return null;
  }
};

module.exports = {
  Card,
  Ability,
  Attack,
  AttackCost,
  BuffDebuff,
  CardAbility,
  CardAttack,
  CardBuffDebuff,
  EnergyType,
  CardEnergyType,
  Rules,
  CardRules,
  Subtype,
  CardSubtype,
  Evolution,
  Image,
  RetreatCost,
  Set,
  Series,
};
