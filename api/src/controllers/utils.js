const axios = require("axios");
const { Pokemon, Type } = require("../db");

//Get forty pokemon from the api.
const getApiInfo = async (url) => {
  try {
    const apiInfo = await axios.get(url);
    const promises = apiInfo.data.results.map((p) => axios.get(p.url));
    const pokePromises = await axios.all(promises);
    const pokemon = pokePromises.map((p) => {
      return {
        id: p.data.id,
        name: p.data.name,
        height: p.data.height,
        hp: p.data.stats[0].base_stat,
        attack: p.data.stats[1].base_stat,
        defense: p.data.stats[2].base_stat,
        speed: p.data.stats[5].base_stat,
        weight: p.data.weight,
        types: p.data.types.map((e) => e.type.name),
        img: p.data.sprites.versions["generation-v"]["black-white"].animated
          .front_default,
        backImg:
          p.data.sprites.versions["generation-v"]["black-white"].animated
            .back_default,
      };
    });
    return pokemon;
  } catch (error) {
    console.log(error);
  }
};

//Alternative (by now, main) way to find a single pokemon, if we know it's from api.
const getOnePokemon = async (id) => {
  try {
    const poke = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    const pokemon = {
      id: poke.data.id,
      name: poke.data.name,
      height: poke.data.height,
      hp: poke.data.stats[0].base_stat,
      attack: poke.data.stats[1].base_stat,
      defense: poke.data.stats[2].base_stat,
      speed: poke.data.stats[5].base_stat,
      weight: poke.data.weight,
      types: poke.data.types.map((e) => e.type.name),
      img: poke.data.sprites.versions["generation-v"]["black-white"].animated
        .front_default,
      backImg:
        poke.data.sprites.versions["generation-v"]["black-white"].animated
          .back_default,
    };
    return pokemon;
  } catch (error) {
    console.log(error);
  }
};

const getDbInfo = async () => {
  try {
    //Find all pokemon in db
    const dbInfo = await Pokemon.findAll({
      where: {},
      include: {
        model: Type,
        attributes: ["name"],
      },
    });
    //Map em to look like the api pokemon.
    const pokeWithTypes = dbInfo.map((p) => {
      return {
        id: p.dataValues.id,
        name: p.dataValues.name,
        hp: p.dataValues.hp,
        attack: p.dataValues.attack,
        defense: p.dataValues.defense,
        speed: p.dataValues.speed,
        weight: p.dataValues.weight,
        height: p.dataValues.height,
        img: p.dataValues.img, // (down below), this is the way to access every single type
        types: p.dataValues.types.map((t) => t.dataValues.name),
      };
    });
    return pokeWithTypes;
  } catch (error) {
    console.log(error);
  }
};

//Concatenate the pokemon from api and the created pokemon from db.
const getAllInfo = async () => {
  try {
    const pokeApiInfo = await getApiInfo(
      "https://pokeapi.co/api/v2/pokemon?offset=0&limit=150"
    );
    const pokeDbInfo = await getDbInfo();
    const allInfo = [...pokeApiInfo, ...pokeDbInfo];
    return allInfo;
  } catch (error) {
    console.log(error);
  }
};

//Save the types from the api to the db
const saveTypes = async () => {
  try {
    const apiInfo = await axios.get("https://pokeapi.co/api/v2/type");
    const types = apiInfo.data.results.map((t) => {
      return { name: t.name };
    });

    let dbTypes = await Type.findAll();
    if (dbTypes.length === 0) {
      await Type.bulkCreate(types);
    }
  } catch (error) {
    console.log(error);
  }
};

//Get the previously added to db types 
const getTypesFromDB = async () => {
  try {
    let typesFromDB = await Type.findAll();
    typesFromDB = typesFromDB.map((t) => t.toJSON());
    return typesFromDB;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getApiInfo,
  getDbInfo,
  getAllInfo,
  getOnePokemon,
  saveTypes,
  getTypesFromDB,
};
