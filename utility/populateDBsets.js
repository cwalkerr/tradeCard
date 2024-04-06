const axios = require("axios");
const db = require("./db");
const api = require("pokemontcgsdk");

api.configure({ apiKey: process.env.POKEMON_API_KEY });

// SET QUERYS

// FIND SERIES ID

const findSeriesId = "SELECT series_id FROM series WHERE name = ?";
const insertSeries = "INSERT INTO series (name) VALUES (?)";
const insertSet =
  "INSERT INTO sets (name, logo, total_cards, release_date, updated_at, standard_legality, expanded_legality, unlimited_legality, series_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

api.set.all().then(async (sets) => {
  console.log(sets.length);

  let setCount = 0;

  // this was needed for using the promise wrapped version of mysql
  const connection = await db;

  // iterate through sets
  for (const set of sets) {
    const name = set.name;
    const totalCards = set.printedTotal;
    let standardLegal = 0;
    let expandedLegal = 0;
    let unlimitedLegal = 0;
    const releaseDate = set.releaseDate;
    const updatedAt = set.updatedAt;
    const logo = set.images.logo;

    // Deal with legalities
    if (set.legalities.standard === "Legal") standardLegal = 1;

    if (set.legalities.expanded === "Legal") expandedLegal = 1;

    if (set.legalities.unlimited === "Legal") unlimitedLegal = 1;

    // Deal with series
    let series = set.series;

    try {
      let result = await connection.query(findSeriesId, [series]);
      if (result[0].length === 0) {
        result = await connection.query(insertSeries, [series]);
        series = result[0].insertId;
      } else {
        if (result[0][0]) {
          series = result[0][0].series_id;
        } else {
          series = 36; // Default to 36 if no series_id is found - 36 = Unknown
          console.log("Error with series :" + series);
        }
      }

      // Insert set into database
      await connection.query(insertSet, [
        name,
        logo,
        totalCards,
        releaseDate,
        updatedAt,
        standardLegal,
        expandedLegal,
        unlimitedLegal,
        series,
      ]);
      setCount++;
      console.log("Set inserted" + setCount + "/" + sets.length);
    } catch (err) {
      console.log(err);
    }
  }
});
