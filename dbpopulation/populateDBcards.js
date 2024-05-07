const axios = require("axios");
const db = require("../config/db");
const api = require("pokemontcgsdk");
const { connect } = require("../routes/login");

api.configure({ apiKey: process.env.POKEMON_API_KEY });

/**
 * Card Queries
 */
const createCard =
  "INSERT INTO card (name, type, hp, rarity, level, number, artist, flavour_text, pokedex_number, sets_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

/**
 * Set Queries
 */
const findSetId = "SELECT sets_id FROM sets WHERE name = ?";

/**
 * Subtype Queries
 */
const findSubtypeId = "SELECT subtype_id FROM subtypes WHERE type = ?";

/**
 * Energy Type Queries
 */
const findEnergyTypeId =
  "SELECT energy_type_id FROM energy_type WHERE type = ?";
const insertEnergyType =
  "INSERT INTO card_energy_type (card_id, energy_type_id) VALUES (?, ?)";

/**
 * Rule Queries
 */
const findRuleId = "SELECT rules_id FROM rules WHERE rule_description = ?";
const insertRule = "INSERT INTO rules (rule_description) VALUES (?)";
const assignRuleToCard =
  "INSERT INTO card_rules (card_id, rules_id) VALUES (?, ?)";

/**
 * Image Queries
 */
const insertImage = "INSERT INTO image (card_id, url, size) VALUES (?, ?, ?)";

/**
 * Retreat Cost Queries
 */
const insertRetreatCost =
  "INSERT INTO retreat_cost (card_id, energy_type_id) VALUES (?, ?)";

/**
 * Ability Queries
 */
const findAbilityId = "SELECT ability_id FROM ability WHERE name = ?";

const promise = api.card.all();
console.log(Promise.resolve(promise) === promise); // true

/**
 * GET EACH CARD AND POPULATE DATABASE
 */

api.card
  .all({ q: "set.series:Gym" }) // just brute forced each of the series to get all the cards - wouldnt let me get all cards in one go
  .then(async (cards) => {
    console.log(cards.length);
    let cardCount = 0;

    const connection = await db;
    connection.connect();
    connection.beginTransaction();

    for (const card of cards) {
      console.log("STARTING CARD: ");
      console.log(card.name);
      let card_id;
      let sets_id;
      const name = card.name;
      const supertype = card.supertype;
      const level = card.level; // will default to null if undefined
      const hp = card.hp;
      const evolvesFrom = card.evolvesFrom;
      const setName = card.set.name;
      const number = card.number;
      const rarity = card.rarity;
      const artist = card.artist;
      const flavorText = card.flavorText;

      const imageSmall = card.images.small;
      console.log(card.images.small);
      const imageLarge = card.images.large;
      console.log(card.images.large);

      let nationalPokedexNumber;
      if (
        !card.nationalPokedexNumbers ||
        card.nationalPokedexNumbers.length === 0
      ) {
        console.log("National Pokedex Number is null for card: " + card.name);
      } else {
        console.log(
          "National Pokedex Number found : " + card.nationalPokedexNumbers[0]
        );
        nationalPokedexNumber = card.nationalPokedexNumbers[0];
      }

      try {
        // find set id for card - all sets should be in the database
        let setIdResult = await connection.query(findSetId, [setName]);
        if (setIdResult[0] && setIdResult[0][0]) {
          sets_id = setIdResult[0][0].sets_id;
          console.log(
            "name : " + name + " set : " + setName + " ID: " + sets_id
          );
          // create card

          try {
            let cardInsert = await connection.query(createCard, [
              name,
              supertype,
              hp,
              rarity,
              level,
              number,
              artist,
              flavorText,
              nationalPokedexNumber,
              sets_id,
            ]);
            // get card id
            if (cardInsert[0]) {
              card_id = cardInsert[0].insertId;
              console.log("Card ID : " + card_id);
              console.log("Card Inserted : ");
              let showCard = await connection.query(
                "SELECT * FROM card WHERE card_id = ?",
                [card_id]
              );
              console.log(showCard[0]);
            } else {
              console.log("Card Insert Error");
              continue;
            }
          } catch (err) {
            console.log("Card Insert Error : " + err);
            continue;
          }
        } else {
          console.log("Set ID not found for : " + setName);
          return;
        }
      } catch (err) {
        console.log("Set ID Error : " + err);
        return; // this should never happen
      }

      // insert images

      try {
        let insertSmallImage = await connection.query(insertImage, [
          card_id,
          imageSmall,
          "Small",
        ]);
        if (!insertSmallImage) {
          console.log("Small Image not inserted");
          continue;
        } else {
          console.log(
            "Small Image inserted - as id : " + insertSmallImage[0].insertId
          );
        }

        let insertLargeImage = await connection.query(insertImage, [
          card_id,
          imageLarge,
          "Large",
        ]);
        if (!insertLargeImage) {
          console.log("Large Image not inserted");
          continue;
        } else {
          console.log(
            "Large Image inserted - as id : " + insertLargeImage[0].insertId
          );
        }
      } catch (err) {
        console.log("Image Error : " + err);
        continue;
      }

      // assign all energy types to card

      try {
        if (!card.types || card.types.length === 0) {
          console.log("Types are null for card: " + card.name);
        } else {
          let cardTypeCount = 0;
          console.log("Card types found : " + card.types.length);
          for (const energyType of card.types) {
            let energyIdResult = await connection.query(findEnergyTypeId, [
              energyType,
            ]);

            let energy_type_id = energyIdResult[0][0].energy_type_id;
            console.log(
              energyType + " = " + energyIdResult[0][0].energy_type_id
            );

            let assignToCard = await connection.query(insertEnergyType, [
              card_id,
              energy_type_id,
            ]);

            console.log(
              "Energy type assigned to card : into card_energy_type as id :" +
                assignToCard[0].insertId
            );
            cardTypeCount++;
            console.log("Card Type Count : " + cardTypeCount);
          }
        }
      } catch (err) {
        console.log("Energy Type Error : " + err);
        continue;
      }

      // deal with card rules
      if (!card.rules || card.rules.length === 0) {
        console.log("Rules are null for card: " + card.name);
      } else {
        try {
          let rulesCount = 0;
          let rules_id;
          console.log("Rules found in card: " + card.rules.length);
          // add new rules and assign to card
          for (const rule of card.rules) {
            const [rows, fields] = await connection.query(findRuleId, [rule]);

            if (!rows[0]) {
              console.log("No rule found");
              let insertRuleResult = await connection.query(insertRule, [rule]);
              rules_id = insertRuleResult[0].insertId;
              console.log("New Rule inserted as : " + rules_id);

              let assignToCard = await connection.query(assignRuleToCard, [
                card_id,
                rules_id,
              ]);
              console.log(
                "Rule assigned to card as id : " + assignToCard[0].insertId
              );
              rulesCount++;
            } else {
              if (rows[0].rules_id != null) {
                console.log("Rule found");
                rules_id = rows[0].rules_id;
                let assignToCard = await connection.query(assignRuleToCard, [
                  card_id,
                  rules_id,
                ]);
                console.log(
                  "Rule assigned to card as id : " + assignToCard[0].insertId
                );
                rulesCount++;
              } else {
                console.log("Rule ID is null");
                return;
              }
            }
          }
          console.log("Rules Inserted : " + rulesCount);
        } catch (err) {
          console.log("Card Rules Error : " + err);
          continue;
        }
      }

      /**
       * Deal with subtype
       */

      try {
        if (!card.subtypes || card.subtypes.length === 0) {
          console.log("Subtypes are null for card: " + card.name);
        } else {
          let assignToCard;
          let subtypeCount = 0;
          console.log("Subtypes found : " + card.subtypes.length);
          for (const subtype of card.subtypes) {
            console.log("Subtype : " + subtype);
            let subtypeIdResult = await connection.query(
              "SELECT subtype_id FROM subtype WHERE type = ?",
              [subtype]
            );
            if (!subtypeIdResult[0] || !subtypeIdResult[0][0]) {
              console.error("Subtype " + subtype + " not found");

              const insertSubtype = await connection.query(
                "INSERT INTO subtype (type) VALUES (?)",
                [subtype]
              );
              console.log(
                "Subtype inserted as id : " + insertSubtype[0].insertId
              );
              assignToCard = await connection.query(
                "INSERT INTO card_subtype (card_id, subtype_id) VALUES (?, ?)",
                [card_id, insertSubtype[0].insertId]
              );
              console.log(
                "Subtype assigned to card as id : " + assignToCard[0].insertId
              );
            } else {
              console.log("Subtype ID : " + subtypeIdResult[0][0].subtype_id);

              assignToCard = await connection.query(
                "INSERT INTO card_subtype (card_id, subtype_id) VALUES (?, ?)",
                [card_id, subtypeIdResult[0][0].subtype_id]
              );
              console.log(
                "Subtype assigned to card as id : " + assignToCard[0].insertId
              );
              subtypeCount++;
            }
          }
          console.log("Subtypes Assigned : " + subtypeCount);
        }
      } catch (err) {
        console.log("Subtype Error : " + err);
        continue;
      }

      /**
       * Deal with retreat cost
       */

      if (!card.retreatCost || card.retreatCost.length === 0) {
        console.log("Retreat Cost is null for card: " + card.name);
      } else {
        let retreatCostCount = 0;
        console.log("Retreat Cost found : " + card.retreatCost.length);
        try {
          for (const energyType of card.retreatCost) {
            let energyIdResult = await connection.query(findEnergyTypeId, [
              energyType,
            ]);
            let energy_type_id = energyIdResult[0][0].energy_type_id;
            console.log(
              "Energy Type ID found for Retreat Cost : " + energy_type_id
            );

            let assignToCard = await connection.query(insertRetreatCost, [
              card_id,
              energy_type_id,
            ]);

            console.log(
              "Energy type assigned to card as retreat cost id : " +
                assignToCard[0].insertId
            );
            retreatCostCount++;
          }
        } catch (err) {
          console.log("Retreat Cost Error : " + err);
          continue;
        }
        console.log("Retreat Costs Inserted : " + retreatCostCount);
      }

      /**
       * Deal with abilities
       */

      if (!card.abilities || card.abilities.length === 0) {
        console.log(
          "Abilities are null for card: " +
            card.name +
            "(" +
            card.supertype +
            ")"
        );
      } else {
        try {
          let abilityCount = 0;
          console.log("Abilities found : " + card.abilities.length);
          for (const ability of card.abilities) {
            // check if ability exists already
            const [rows, fields] = await connection.query(findAbilityId, [
              ability.name,
            ]);

            if (!rows[0]) {
              console.log("No ability found with name: " + ability.name);

              // insert ability if it doesn't exist
              let insertAbility = await connection.query(
                "INSERT INTO ability (name, description, type) VALUES (?, ?, ?)",
                [ability.name, ability.text, ability.type]
              );

              console.log("Ability inserted as : " + insertAbility[0].insertId);

              // assign new inserted ability to card
              let assignAbilityToCard = await connection.query(
                "INSERT INTO card_ability (card_id, ability_id) VALUES (?, ?)",
                [card_id, insertAbility[0].insertId]
              );
              console.log(
                "Ability assigned to card as id : " +
                  assignAbilityToCard[0].insertId
              );
              abilityCount++;
            } else {
              // assign ability to card if it exists
              if (rows[0].ability_id != null) {
                let assignAbilityToCard = await connection.query(
                  "INSERT INTO card_ability (card_id, ability_id) VALUES (?, ?)",
                  [card_id, rows[0].ability_id]
                );
                console.log(
                  "Ability ID : " +
                    rows[0].ability_id +
                    " assigned as card abilty id: " +
                    assignAbilityToCard[0].insertId
                );
                abilityCount++;
              } else {
                console.log("Ability ID is null");
                continue;
              }
            }
          }
          console.log("Abilities Inserted : " + abilityCount);
        } catch (err) {
          console.log("Ability Error : " + err);
          continue;
        }
      }

      /**
       * Deal with attacks
       */

      if (!card.attacks || card.attacks.length === 0) {
        console.log(
          "Attacks are null for card: " + card.name + "(" + card.supertype + ")"
        );
      } else {
        try {
          let attackCount = 0;
          console.log("Attacks found : " + card.attacks.length);
          for (const attack of card.attacks) {
            let attack_id;
            let assignAttackToCard;
            const [rows, fields] = await connection.query(
              "SELECT attack_id FROM attack WHERE name = ? AND damage = ? AND cost_converted = ?",
              [attack.name, attack.damage, attack.convertedEngeryCost]
            );

            if (!rows[0]) {
              console.log("No attack found with name: " + attack.name);

              let insertAttack = await connection.query(
                "INSERT INTO attack (name, description, damage, cost_converted) VALUES (?, ?, ?, ?)",
                [
                  attack.name,
                  attack.text,
                  attack.damage,
                  attack.convertedEnergyCost,
                ]
              );

              console.log(
                "Attack inserted with id : " + insertAttack[0].insertId
              );

              assignAttackToCard = await connection.query(
                "INSERT INTO card_attack (card_id, attack_id) VALUES (?, ?)",
                [card_id, insertAttack[0].insertId]
              );

              console.log(
                "Attack assigned to card as id : " +
                  assignAttackToCard[0].insertId
              );
              attackCount++;
              attack_id = insertAttack[0].insertId;
            } else {
              if (rows[0].attack_id != null) {
                assignAttackToCard = await connection.query(
                  "INSERT INTO card_attack (card_id, attack_id) VALUES (?, ?)",
                  [card_id, rows[0].attack_id]
                );

                console.log(
                  "Attack ID : " +
                    rows[0].attack_id +
                    " assigned to card as card_attack id: " +
                    assignAttackToCard[0].insertId
                );
                attackCount++;
                attack_id = rows[0].attack_id;
              } else {
                console.log("Attack ID is null");
                continue;
              }
            }

            // attack cost
            let attackCostCount = 0;

            console.log("Attack Cost size : " + attack.cost.length);
            for (const energyType of attack.cost) {
              let energyIdResult = await connection.query(findEnergyTypeId, [
                energyType,
              ]);

              let energy_type_id = energyIdResult[0][0].energy_type_id;

              let assignToAttackCost = await connection.query(
                "INSERT INTO attack_cost (attack_id, energy_type_id) VALUES (?, ?)",
                [attack_id, energy_type_id]
              );

              console.log(
                "Single attack cost as id : " + assignToAttackCost[0].insertId
              );

              attackCostCount++;
            }

            console.log("Attack Costs Inserted : " + attackCostCount);
          }
          console.log("Attacks Inserted : " + attackCount);
        } catch (err) {
          console.log("Attack Error : " + err);
          continue;
        }
      }

      /**
       * Deal with weaknesses & resistances
       */

      if (
        (!card.weaknesses || card.weaknesses.length === 0) &&
        (!card.resistances || card.resistances.length === 0)
      ) {
        console.log(
          "Weaknesses & Resistances are null for card: " +
            card.name +
            "(" +
            card.supertype +
            ")"
        );
      } else if (!card.weaknesses || card.weaknesses.length === 0) {
        console.log(
          "Weaknesses are null for card: " +
            card.name +
            "(" +
            card.supertype +
            ")"
        );

        // no weaknesses, but resistances
        try {
          let energy_type_id;
          console.log("Resistances but no Weaknesses");
          for (const resistance of card.resistances) {
            // check if resistance exists already
            const checkEnergyType = await connection.query(findEnergyTypeId, [
              resistance.type,
            ]);

            energy_type_id = checkEnergyType[0][0].energy_type_id;
            console.log(
              "Energy Type ID found for resistance check : " + energy_type_id
            );

            const [rows, fields] = await connection.query(
              "SELECT buff_debuff_id FROM buff_debuff WHERE energy_type_id = ? AND type = 'Resistance' AND variable = ?",
              [energy_type_id, resistance.value]
            );
            console.log(rows[0]);

            if (!rows[0]) {
              console.log("Resistance not found");
              // insert resistance if it doesn't exist
              let insertResistance = await connection.query(
                "INSERT INTO buff_debuff (energy_type_id, type, variable) VALUES (?, ?, ?)",
                [energy_type_id, "Resistance", resistance.value]
              );
              console.log(
                "Resistance inserted as id : " + insertResistance[0].insertId
              );
              // assign new inserted resistance to card
              let assignResistanceToCard = await connection.query(
                "INSERT INTO card_buff_debuff (card_id, buff_debuff_id) VALUES (?, ?)",
                [card_id, insertResistance[0].insertId]
              );
              console.log(
                "Resistance assigned to card as id : " +
                  assignResistanceToCard[0].insertId
              );
            } else {
              if (rows[0].buff_debuff_id != null) {
                let assignResistanceToCard = await connection.query(
                  "INSERT INTO card_buff_debuff (card_id, buff_debuff_id) VALUES (?, ?)",
                  [card_id, rows[0].buff_debuff_id]
                );
                console.log(
                  "Resistance ID : " +
                    rows[0].buff_debuff_id +
                    " assigned to card as card_buff_debuff id: " +
                    assignResistanceToCard[0].insertId
                );
              } else {
                console.log("Resistance ID is null");
                return;
              }
            }
          }
        } catch (err) {
          console.log("Resistance Error : " + err);
          continue;
        }
      } else if (!card.resistances || card.resistances.length === 0) {
        console.log(
          "Resistances are null for card: " +
            card.name +
            "(" +
            card.supertype +
            ")"
        );
        // no resistances, but weaknesses
        try {
          console.log("Weaknesses but no Resistances");
          for (const weakness of card.weaknesses) {
            // check if weakness exists already
            let energyCheck = await connection.query(findEnergyTypeId, [
              weakness.type,
            ]);
            energy_type_id = energyCheck[0][0].energy_type_id;

            console.log(
              "Energy Type ID found for weakness check : " + energy_type_id
            );

            const [rows, fields] = await connection.query(
              "SELECT buff_debuff_id FROM buff_debuff WHERE energy_type_id = ? AND type = 'Weakness' AND variable = ?",
              [energy_type_id, weakness.value]
            );
            console.log(rows[0]);

            if (!rows[0]) {
              console.log("Weakness not found");
              // insert weakness if it doesn't exist
              let insertWeakness = await connection.query(
                "INSERT INTO buff_debuff (energy_type_id, type, variable) VALUES (?, ?, ?)",
                [energy_type_id, "Weakness", weakness.value]
              );
              console.log(
                "weakness inserted as id : " + insertWeakness[0].insertId
              );
              // assign new inserted weakness to card
              let assignWeaknessToCard = await connection.query(
                "INSERT INTO card_buff_debuff (card_id, buff_debuff_id) VALUES (?, ?)",
                [card_id, insertWeakness[0].insertId]
              );
              console.log(
                "Weakness assigned to card as id : " +
                  assignWeaknessToCard[0].insertId
              );
            } else {
              if (rows[0].buff_debuff_id != null) {
                let assignWeaknessToCard = await connection.query(
                  "INSERT INTO card_buff_debuff (card_id, buff_debuff_id) VALUES (?, ?)",
                  [card_id, rows[0].buff_debuff_id]
                );
                console.log(
                  "Weakness ID : " +
                    rows[0].buff_debuff_id +
                    " assigned to card as card_buff_debuff id: " +
                    assignWeaknessToCard[0].insertId
                );
              } else {
                console.log("Weakness ID is null");
                return;
              }
            }
          }
        } catch (err) {
          console.log("Weakness Error : " + err);
          continue;
        }
      } else {
        // both weaknesses and resistances
        try {
          console.log("Weaknesses and Resistances found");
          for (const weakness of card.weaknesses) {
            // check if weakness exists already
            let energyCheck = await connection.query(findEnergyTypeId, [
              weakness.type,
            ]);

            energy_type_id = energyCheck[0][0].energy_type_id;
            console.log(
              "Energy Type ID found for resistance/weakness (weakness) check : " +
                energy_type_id
            );
            const [rows, fields] = await connection.query(
              "SELECT buff_debuff_id FROM buff_debuff WHERE energy_type_id = ? AND type = 'Weakness' AND variable = ?",
              [energy_type_id, weakness.value]
            );
            console.log(rows[0]);

            if (!rows[0]) {
              // insert weakness if it doesn't exist
              console.log("Weakness not found");
              let insertWeakness = await connection.query(
                "INSERT INTO buff_debuff (energy_type_id, type, variable) VALUES (?, ?, ?)",
                [energy_type_id, "Weakness", weakness.value]
              );
              console.log(
                "Weakness inserted as id : " + insertWeakness[0].insertId
              );
              // assign new inserted weakness to card
              let assignWeaknessToCard = await connection.query(
                "INSERT INTO card_buff_debuff (card_id, buff_debuff_id) VALUES (?, ?)",
                [card_id, insertWeakness[0].insertId]
              );
              console.log(
                "Weakness assigned to card as id : " +
                  assignWeaknessToCard[0].insertId
              );
            } else {
              if (rows[0].buff_debuff_id != null) {
                console.log("Weakness already exists");
                let assignWeaknessToCard = await connection.query(
                  "INSERT INTO card_buff_debuff (card_id, buff_debuff_id) VALUES (?, ?)",
                  [card_id, rows[0].buff_debuff_id]
                );
                console.log(
                  "Weakness ID : " +
                    rows[0].buff_debuff_id +
                    " assigned to card as card_buff_debuff id: " +
                    assignWeaknessToCard[0].insertId
                );
              } else {
                console.log("Weakness ID is null");
                return;
              }
            }
          }

          for (const resistance of card.resistances) {
            // check if resistance exists already
            let energyCheck = await connection.query(findEnergyTypeId, [
              resistance.type,
            ]);

            energy_type_id = energyCheck[0][0].energy_type_id;
            console.log(
              "Energy Type ID found for weakness/resistance (resistance) check : " +
                energy_type_id
            );

            const [rows, fields] = await connection.query(
              "SELECT buff_debuff_id FROM buff_debuff WHERE energy_type_id = ? AND type = 'Resistance' AND variable = ?",
              [energy_type_id, resistance.value]
            );

            console.log(rows[0]);

            if (!rows[0]) {
              // insert resistance if it doesn't exist
              console.log("Resistance not found");
              let insertResistance = await connection.query(
                "INSERT INTO buff_debuff (energy_type_id, type, variable) VALUES (?, ?, ?)",
                [energy_type_id, "Resistance", resistance.value]
              );
              console.log(
                "Resistance inserted as id : " + insertResistance[0].insertId
              );
              // assign new inserted resistance to card
              let assignResistanceToCard = await connection.query(
                "INSERT INTO card_buff_debuff (card_id, buff_debuff_id) VALUES (?, ?)",
                [card_id, insertResistance[0].insertId]
              );
              console.log(
                "Resistance assigned to card as id : " +
                  assignResistanceToCard[0].insertId
              );
            } else {
              console.log("Resistance already exists");
              if (rows[0].buff_debuff_id != null) {
                let assignResistanceToCard = await connection.query(
                  "INSERT INTO card_buff_debuff (card_id, buff_debuff_id) VALUES (?, ?)",
                  [card_id, rows[0].buff_debuff_id]
                );
                console.log(
                  "Resistance ID : " +
                    rows[0].buff_debuff_id +
                    " assigned to card as card_buff_debuff id: " +
                    assignResistanceToCard[0].insertId
                );
              } else {
                console.log("Resistance ID is null");
                return;
              }
            }
          }
        } catch (err) {
          console.log("Weakness OR Resistance Error : " + err);
          continue;
        }
      }

      /**
       * Deal with Evolutions
       */

      try {
        if (!card.evolvesTo || card.evolvesTo.length === 0) {
          console.log("Evolution To is null for card: " + card.name);
        } else {
          for (const evolution of card.evolvesTo) {
            let insertEvolution = await connection.query(
              "INSERT INTO evolution (card_id, evolves_to_name, evolves_from_name) VALUES (?, ?, ?)",
              [card_id, evolution, evolvesFrom]
            );
            console.log(
              "Evolution inserted as id : " + insertEvolution[0].insertId
            );
          }
        }
      } catch (err) {
        console.log("Evolution Error : " + err);
        continue;
      }

      cardCount++;
      console.log("Card Count : " + cardCount + "/" + cards.length);
    }
    connection.commit();
  })

  .catch((err) => {
    console.log(err);
  });
