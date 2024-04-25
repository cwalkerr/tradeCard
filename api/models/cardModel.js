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
    retreat_cost: {
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
 * SET MODEL
 */
const Sets = sequelize.define(
  "Sets",
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
Series.hasMany(Sets, { foreignKey: "series_id" });
Sets.belongsTo(Series, { foreignKey: "series_id" });

// set has many cards / card belongs to one set
Sets.hasMany(Card, { foreignKey: "sets_id" });
Card.belongsTo(Sets, { foreignKey: "sets_id" });

// card has many images / image belongs to one card
Card.hasMany(Image, { foreignKey: "card_id" });
Image.belongsTo(Card, { foreignKey: "card_id" });

// evolution belongs to one card / card has one evolution
Card.hasOne(Evolution, { foreignKey: "card_id" });
Evolution.belongsTo(Card, { foreignKey: "card_id" });

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
 * this query gets card details with all joined data that is useful
 * i.e. it excludes id's etc where possible
 * it can be used as a independant api endpoint, and is used in the view card details page
 * @param {*} whereClause
 * @param {*} page
 * @returns
 */
Card.getCardDetails = async function (whereClause = {}, page) {
  page = Number(page) || 1;
  const itemsPerPage = 30;
  const offset = (page - 1) * itemsPerPage;

  const result = await this.findAndCountAll({
    where: whereClause,
    distinct: true,
    limit: itemsPerPage,
    offset: offset,
    attributes: { exclude: ["sets_id"] },
    include: [
      {
        model: Sets,
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
        model: Ability,
        attributes: ["name", "description", "type"],
        through: { attributes: [] },
      },
      {
        model: Attack,
        attributes: ["name", "description", "damage", "cost_converted"],
        through: { attributes: [] },
        include: [
          {
            model: AttackCost,
            attributes: {
              exclude: ["attack_id", "attack_cost_id"],
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
        through: { attributes: [] },
        include: [{ model: EnergyType, attributes: ["type"] }],
      },
      {
        model: EnergyType,
        through: { attributes: [] },
        attributes: ["type"],
      },
      {
        model: Rules,
        through: { attributes: [] },
        attributes: ["description"],
      },
      { model: Subtype, attributes: ["type"], through: { attributes: [] } },
    ],
  });

  const totalPages = Math.ceil(result.count / itemsPerPage);

  if (result.count > 0) {
    return {
      cards: result.rows,
      count: result.count,
      totalPages: totalPages,
      currentPage: page,
      itemsPerPage: itemsPerPage,
    };
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
Card.getCardGrid = async function (cardIds = [], page) {
  page = Number(page) || 1;
  const itemsPerPage = 30;
  const offset = (page - 1) * itemsPerPage;

  let whereClause = {};
  if (cardIds.length > 0) {
    whereClause.card_id = { [Op.in]: cardIds };
  }

  const result = await this.findAndCountAll({
    where: whereClause,
    attributes: ["card_id", "name"],
    limit: itemsPerPage,
    offset: offset,
    include: [
      {
        model: Image,
        where: { size: "Small" },
        attributes: ["url"],
      },
    ],
  });

  const totalPages = Math.ceil(result.count / itemsPerPage);

  if (result.count > 0) {
    return {
      cards: result.rows,
      count: result.count,
      totalPages: totalPages,
      currentPage: page,
      itemsPerPage: itemsPerPage,
    };
  } else {
    return null;
  }
};

Card.filterResultIds = async function (whereClause = {}) {
  let cardWhereClause = {};
  let include = [];
  const cardTableKeys = ["rarity", "artist", "type", "hp", "retreat_cost"];

  // generate the where clause for the card model
  for (let key in whereClause) {
    if (cardTableKeys.includes(key)) {
      cardWhereClause[key] = whereClause[key];
    }
  }

  // deal with what to include in the query
  if (whereClause.Subtype) {
    include.push({
      model: Subtype,
      where: whereClause.Subtype,
      required: true,
      through: {
        model: CardSubtype,
        required: true,
      },
    });
  }

  if (whereClause.Sets || whereClause.Series) {
    let includeSets = {
      model: Sets,
      where: whereClause.Sets,
      required: true,
    };

    if (whereClause.Series) {
      includeSets.include = [
        {
          model: Series,
          where: whereClause.Series,
          required: true,
        },
      ];
    }
    include.push(includeSets);
  }

  if (whereClause.EnergyType) {
    include.push({
      model: EnergyType,
      where: whereClause.EnergyType,
      required: true,
      through: {
        model: CardEnergyType,
        required: true,
      },
    });
  }

  if (whereClause.Ability) {
    include.push({
      model: Ability,
      where: whereClause.Ability,
      required: true,
      through: {
        model: CardAbility,
        required: true,
      },
    });
  }

  if (whereClause.Resistance) {
    include.push({
      model: BuffDebuff,
      where: whereClause.Resistance,
      required: true,
      through: {
        model: CardBuffDebuff,
        required: true,
      },
      include: [
        {
          model: EnergyType,
          required: true,
          where: whereClause.ResistanceEnergyType,
        },
      ],
    });
  }

  if (whereClause.Weakness) {
    include.push({
      model: BuffDebuff,
      where: whereClause.Weakness,
      required: true,
      through: {
        model: CardBuffDebuff,
        required: true,
      },
      include: [
        {
          model: EnergyType,
          required: true,
          where: whereClause.WeaknessEnergyType,
        },
      ],
    });
  }

  if (whereClause.Attack) {
    include.push({
      model: Attack,
      where: whereClause.Attack,
      required: true,
      through: {
        model: CardAttack,
        required: true,
      },
    });
  }

  try {
    const { count, rows } = await this.findAndCountAll({
      attributes: ["card_id"],
      where: cardWhereClause,
      include: include,
    });

    return {
      cards: rows.map((card) => card.card_id),
      count: count,
    };
  } catch (err) {
    console.log(err);
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
  Sets,
  Series,
};
