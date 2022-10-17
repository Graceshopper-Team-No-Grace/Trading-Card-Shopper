const {
  createCustomer,
  closeCart,
  createCart,
  createCartProduct,
  adminCheckById,
  adminCreateProduct,
  adminGetProductIdByName,
  adminUpdateProductById,
  adminSetActiveProductById,
  adminGetCustomerByUsername,
  getCartIdbyCustomerId,
  getOpenCartByCustomerId,
  getPastOrdersByCustomerId,
} = require("./");
const client = require("./client");

const dropTables = async () => {
  console.log("DROPPING TABLES");
  try {
    await client.query(`
      DROP TABLE IF EXISTS cart_products;
      DROP TABLE IF EXISTS carts;
      DROP TABLE IF EXISTS products;      
      DROP TABLE IF EXISTS customers;
        `);
  } catch (err) {
    console.log("ERROR DROPPING TABLES");
    throw err;
  }
};

const createTables = async () => {
  try {
    await client.query(`
            CREATE TABLE customers (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                firstname VARCHAR(50) NOT NULL,
                lastname VARCHAR(50) NOT NULL,
                address VARCHAR(255) NOT NULL,
                email VARCHAR(50) UNIQUE NOT NULL,
                isadmin BOOLEAN DEFAULT false
            ); 
            
            CREATE UNIQUE INDEX uname_email on customers (username, email);

            CREATE TABLE products (
              id SERIAL PRIMARY KEY,
              name VARCHAR(50) UNIQUE NOT NULL,
              price VARCHAR(20) NOT NULL,
              condition VARCHAR(50) NOT NULL,
              rarity VARCHAR(50) NOT NULL,
              ability1 VARCHAR(500) NOT NULL,
              ability2 VARCHAR(500),
              imagelink VARCHAR(255) NOT NULL,
              inventorycount INTEGER NOT NULL,
              isactive BOOLEAN DEFAULT true
            );

            CREATE TABLE carts (
              id SERIAL PRIMARY KEY,
              customerid INTEGER REFERENCES customers(id),
              isopen BOOLEAN DEFAULT true
            );

            CREATE TABLE cart_products (
              id SERIAL PRIMARY KEY,
              cartid INTEGER REFERENCES carts(id),
              productid INTEGER REFERENCES products(id),
              quantity INTEGER NOT NULL,
              UNIQUE (cartid, productid)
            );
        `);
    console.log("FINISHED BUILDING TABLES!");
  } catch (err) {
    console.log("ERROR BUILDING TABLES!");
    throw err;
  }
};

const createInitialUsers = async () => {
  console.log("STARTING TO CREATE USERS");
  try {
    const customersToCreate = [
      {
        username: "albert",
        password: "bertie99",
        firstname: "Al",
        lastname: "Bert",
        email: "Al.Bert@gmail.com",
        address: "123 Sesame St",
        isadmin: true,
      },
      {
        username: "sandra",
        password: "sandra123",
        firstname: "San",
        lastname: "Dra",
        email: "San.Dra@gmail.com",
        address: "1234 Sesame St",
      },
      {
        username: "glamgal",
        password: "glamgal123",
        firstname: "Glam",
        lastname: "Gal",
        email: "Glam.Gal@gmail.com",
        address: "12345 Sesame St",
      },
    ];
    console.log("CUSTOMERS TO CREATE", customersToCreate);
    const customers = await Promise.all(customersToCreate.map(createCustomer));

    console.log("CUSTOMERS", customers);

    console.log("FINISHED CREATING CUSTOMERS");
  } catch (err) {
    console.log("ERROR CREATING CUSTOMERS");
    throw err;
  }
};

const createInitialProducts = async () => {
  console.log("STARTING TO CREATE PRODUCTS");
  try {
    const productsToCreate = [
      {
        name: "Gardevoir",
        price: "50",
        condition: "Mint",
        rarity: "Holo",
        ability1:
          "Astonish: Flip a coin. If heads, choose a random card from your opponent's hand. Your opponent reveals that cards and shuffles it into his or her deck.",
        ability2:
          "Miracle Powder: Flip a coin. If heads, choose a Special Condition. The Defending Pokémon is now affected by that Special Condition.",
        imagelink: "https://images.pokemontcg.io/xy7/54_hires.png",
        inventorycount: 10,
        isactive: true,
      },
      {
        name: "Amoonguss",
        price: "50",
        condition: "Mint",
        rarity: "Holo",
        ability1:
          "Bright Heal: Once during your turn (before your attack), you may heal 20 damage from each of your Pokémon.",
        ability2:
          "Telekinesis: This attack does 50 damage to 1 of your opponent's Pokémon. This attack's damage isn't affected by Weakness or Resistance.",
        imagelink: "https://images.pokemontcg.io/bw8/13_hires.png",
        inventorycount: 10,
        isactive: true,
      },
      {
        name: "Mewtwo",
        price: "10,000",
        condition: "Good",
        rarity: "Holo",
        ability1:
          "Psychic: Does 10 damage plus 10 more damage for each Energy card attached to the Defending Pokémon.",
        ability2:
          "Barrier: Discard 1 Psychic Energy card attached to Mewtwo in order to prevent all effects of attacks, including damage, done to Mewtwo during your opponent's next turn.",
        imagelink: "https://images.pokemontcg.io/base1/10_hires.png",
        inventorycount: 3,
        isactive: true,
      },
      {
        name: "Snorlax",
        price: "1,000",
        condition: "Mint",
        rarity: "Holo",
        ability1:
          "Thick Skinned: Snorlax can't become Asleep, Confused, Paralyzed, or Poisoned. This power can't be used if Snorlax is already Asleep, Confused, or Paralyzed.",
        ability2:
          "	Body Slam: Flip a coin. If heads, the Defending Pokémon is now Paralyzed.",
        imagelink: "https://images.pokemontcg.io/base2/11_hires.png",
        inventorycount: 3,
        isactive: true,
      },
      {
        name: "Charizard",
        price: "30,000",
        condition: "Good",
        rarity: "Holo",
        ability1:
          "Energy Burn: As often as you like during your turn (before your attack), you may turn all Energy attached to Charizard into Fire Energy for the rest of the turn. This power can't be used if Charizard is Asleep, Confused, or Paralyzed.",
        ability2:
          "Fire Spin: Discard 2 Energy cards attached to Charizard in order to use this attack.",
        imagelink: "https://images.pokemontcg.io/base1/4_hires.png",
        inventorycount: 35,
        isactive: true,
      },
      {
        name: "Blastoise",
        price: "50,000",
        condition: "Mint",
        rarity: "Holo",
        ability1:
          "Rain Dance: As often as you like during your turn (before your attack), you may attach 1 Water Energy card to 1 of your Water Pokémon. (This doesn't use up your 1 Energy card attachment for the turn.) This power can't be used if Blastoise is Asleep, Confused, or Paralyzed.",
        ability2:
          "Hydro Pump: Does 40 damage plus 10 more damage for each Water Energy attached to Blastoise but not used to pay for this attack's Energy cost. Extra Water Energy after the 2nd doesn't count.",
        imagelink: "https://images.pokemontcg.io/base1/2_hires.png",
        inventorycount: 50,
        isactive: true,
      },
      {
        name: "Venusaur",
        price: "5,000",
        condition: "Poor",
        rarity: "Holo",
        ability1:
          "Energy Trans: As often as you like during your turn (before your attack), you may take 1 Grass Energy card attached to 1 of your Pokémon and attach it to a different one. This power can't be used if Venusaur is Asleep, Confused, or Paralyzed.",
        ability2: "Solarbeam",
        imagelink: "https://images.pokemontcg.io/base1/15_hires.png",
        inventorycount: 10,
        isactive: true,
      },
      {
        name: "Zapdos",
        price: "300",
        condition: "Poor",
        rarity: "Holo",
        ability1:
          "Thunder: Flip a coin. If tails, Zapdos does 30 damage to itself.",
        ability2:
          "Thunderbolt: Discard all Energy cards attached to Zapdos in order to use this attack.",
        imagelink: "https://images.pokemontcg.io/base1/16_hires.png",
        inventorycount: 1,
        isactive: true,
      },
      {
        name: "Raichu",
        price: "69.99",
        condition: "Good",
        rarity: "Holo",
        ability1:
          "Agility: Flip a coin. If heads, during your opponent's next turn, prevent all effects of attacks, including damage, done to Raichu.",
        ability2:
          "Thunder: Flip a coin. If tails, Raichu does 30 damage to itself.",
        imagelink: "https://images.pokemontcg.io/base1/14_hires.png",
        inventorycount: 2,
        isactive: true,
      },
      {
        name: "Dragonair",
        price: "77",
        condition: "Mint",
        rarity: "Holo",
        ability1:
          "Slam: Flip 2 coins. This attack does 30 damage times the number of heads.",
        ability2:
          "Hyper Beam: If the Defending Pokémon has any Energy cards attached to it, choose 1 of them and discard it.",
        imagelink: "https://images.pokemontcg.io/base4/22_hires.png",
        inventorycount: 2,
        isactive: true,
      },
      {
        name: "Chansey",
        price: "100",
        condition: "Good",
        rarity: "Holo",
        ability1:
          "Scrunch: Flip a coin. If heads, prevent all damage done to Chansey during your opponent's next turn. (Any other effects of attacks still happen.)",
        ability2: "Double-edge: Chansey does 80 damage to itself.",
        imagelink: "https://images.pokemontcg.io/base4/3_hires.png",
        inventorycount: 5,
        isactive: true,
      },
      {
        name: "Hitmonchan",
        price: "1111",
        condition: "Mint",
        rarity: "Holo",
        ability1: "Jab",
        ability2: "Special Punch",
        imagelink: "https://images.pokemontcg.io/base4/8_hires.png",
        inventorycount: 13,
        isactive: true,
      },
      {
        name: "Aerodactyl",
        price: "8",
        condition: "Damaged",
        rarity: "Holo",
        ability1:
          "Prehistoric Power: No more Evolution cards can be played. This power stops working while Aerodactyl is Asleep, Confused, or Paralyzed.",
        ability2: "Wing Attack",
        imagelink: "https://images.pokemontcg.io/base3/1_hires.png",
        inventorycount: 9,
        isactive: true,
      },
      {
        name: "Ditto",
        price: "132",
        condition: "Good",
        rarity: "Holo",
        ability1: "Transform",
        ability2: "",
        imagelink: "https://images.pokemontcg.io/base3/3_hires.png",
        inventorycount: 132,
        isactive: true,
      },
      {
        name: "Gengar",
        price: "94",
        condition: "Good",
        rarity: "Holo",
        ability1:
          "Curse:Once during your turn (before your attack), you may move 1 damage counter from 1 of your opponent's Pokémon to another (even if it would Knock Out the other Pokémon). This power can't be used if Gengar is Asleep, Confused, or Paralyzed.",
        ability2:
          "Dark Mind:If your opponent has any Benched Pokémon, choose 1 of them and this attack does 10 damage to it. (Don't apply Weakness and Resistance for Benched Pokémon.)",
        imagelink: "https://images.pokemontcg.io/base3/5_hires.png",
        inventorycount: 94,
        isactive: true,
      },
      {
        name: "Lapras",
        price: "131",
        condition: "Good",
        rarity: "Holo",
        ability1:
          "Water Gun: Does 10 damage plus 10 more damage for each Water Energy attached to Lapras but not used to pay for this attack's Energy cost. You can't add more than 20 damage in this way.",
        ability2:
          "Confuse Ray: Flip a coin. If heads, the Defending Pokémon is now Confused.",
        imagelink: "https://images.pokemontcg.io/base3/10_hires.png",
        inventorycount: 31,
        isactive: true,
      },
      {
        name: "Mew",
        price: "151",
        condition: "Mint",
        rarity: "Holo",
        ability1:
          "Psywave: Does 10 damage times the number of Energy cards attached to the Defending Pokémon.",
        ability2:
          "Devolution Beam: Choose an evolved Pokémon (your own or your opponent's). Return the highest Stage Evolution card on that Pokémon to its player's hand. That Pokémon is no longer Asleep, Confused, Paralyzed, or Poisoned, or anything else that might be the result of an attack (just as if you had evolved it).",
        imagelink: "https://images.pokemontcg.io/basep/9_hires.png",
        inventorycount: 51,
        isactive: true,
      },

      {
        name: "Gyarados",
        price: "130",
        condition: "Good",
        rarity: "Holo",
        ability1: "Dragon Rage",
        ability2:
          "Bubblebeam: Flip a coin. If heads, the Defending Pokémon is now Paralyzed.",
        imagelink: "https://images.pokemontcg.io/base1/6_hires.png",
        inventorycount: 15,
        isactive: true,
      },

      {
        name: "Magneton",
        price: "82",
        condition: "Poor",
        rarity: "Holo",
        ability1:
          "Thunder Wave: Flip a coin. If heads, the Defending Pokémon is now Paralyzed.",
        ability2:
          "Selfdestruct: Does 20 damage to each Pokémon on each player's Bench. (Don't apply Weakness and Resistance for Benched Pokémon.) Magneton does 80 damage to itself.",
        imagelink: "https://images.pokemontcg.io/base1/9_hires.png",
        inventorycount: 20,
        isactive: true,
      },

      {
        name: "Ninetails",
        price: "38",
        condition: "Mint",
        rarity: "Holo",
        ability1:
          "Lure: If your opponent has any Benched Pokémon, choose 1 of them and switch it with his or her Active Pokémon.",
        ability2:
          "Fire Blast: Discard 1 Fire Energy card attached to Ninetales in order to use this attack.",
        imagelink: "https://images.pokemontcg.io/base1/12_hires.png",
        inventorycount: 5,
        isactive: true,
      },

      {
        name: "Beedrill",
        price: "15",
        condition: "Poor",
        rarity: "Regular",
        ability1:
          "Twineedle: Flip 2 coins. This attack does 30 damage times the number of heads.",
        ability2:
          "Poison Sting: Flip a coin. If heads, the Defending Pokémon is now Poisoned.",
        imagelink: "https://images.pokemontcg.io/base1/17_hires.png",
        inventorycount: 30,
        isactive: true,
      },

      {
        name: "Nidoking",
        price: "34",
        condition: "Mint",
        rarity: "Holo",
        ability1:
          "Thrash: Flip a coin. If heads, this attack does 30 damage plus 10 more damage; if tails, this attack does 30 damage and Nidoking does 10 damage to itself.",
        ability2:
          "Toxic: The Defending Pokémon is now Poisoned. It now takes 20 Poison damage instead of 10 after each player's turn (even if it was already Poisoned).",
        imagelink: "https://images.pokemontcg.io/base1/11_hires.png",
        inventorycount: 35,
        isactive: true,
      },

      {
        name: "Poliwrath",
        price: "62",
        condition: "Mint",
        rarity: "Holo",
        ability1:
          "Water Gun: Does 30 damage plus 10 more damage for each Water Energy attached to Poliwrath but not used to pay for this attack's Energy cost. Extra Water Energy after the 2nd doesn't",
        ability2:
          "Whirlpool: If the Defending Pokémon has any Energy cards attached to it, choose 1 of them and discard it.",
        imagelink: "https://images.pokemontcg.io/base1/13_hires.png",
        inventorycount: 40,
        isactive: true,
      },

      {
        name: "Alakazam",
        price: "65",
        condition: "Mint",
        rarity: "Holo",
        ability1:
          "Damage Swap: As often as you like during your turn (before your attack), you may move 1 damage counter from 1 of your Pokémon to another as long as you don't Knock Out that Pokémon. This power can't be used if Alakazam is Asleep, Confused, or Paralyzed.",
        ability2:
          "Confuse Ray: Flip a coin. If heads, the Defending Pokémon is now Confused.",
        imagelink: "https://images.pokemontcg.io/base1/1_hires.png",
        inventorycount: 50,
        isactive: true,
      },

      {
        name: "Arceus VSTAR",
        price: "1000000",
        condition: "Mint",
        rarity: "Rainbow Rare",
        ability1:
          "Starbirth: During your turn, you may search your deck for up to 2 cards and put them into your hand. Then, shuffle your deck. (You can't use more than 1 VSTAR Power in a game.)",
        ability2: "Trinity Nova",
        imagelink: "https://images.pokemontcg.io/swsh9/176_hires.png",
        inventorycount: 1,
        isactive: true,
      },
    ];

    console.log("PRODUCTS TO CREATE", productsToCreate);
    const products = await Promise.all(
      productsToCreate.map(adminCreateProduct)
    );
    console.log("PRODUCTS", products);
    console.log("FINISHED CREATING PRODUCTS");
  } catch (err) {
    console.log("ERROR CREATING PRODUCTS");
    throw err;
  }
};

const createInitialCarts = async () => {
  console.log("STARTING TO CREATE CARTS");
  try {
    const cartsToCreate = [3, 2, 1];
    console.log("CARTS TO CREATE", cartsToCreate);
    const carts = await Promise.all(cartsToCreate.map(createCart));
    console.log("CARTS", carts);
    console.log("FINISHED CREATING CARTS");
  } catch (err) {
    console.log("ERROR CREATING CARTS");
    throw err;
  }
};

const createInitialCartProducts = async () => {
  console.log("STARTING TO CREATE CART-PRODUCTS");
  try {
    const cartProductsToCreate = [
      {
        cartid: 1,
        productid: 2,
        quantity: 3,
      },
      {
        cartid: 1,
        productid: 4,
        quantity: 1,
      },
      {
        cartid: 2,
        productid: 2,
        quantity: 2,
      },
      {
        cartid: 3,
        productid: 3,
        quantity: 1,
      },
    ];

    console.log("CART PRODUCTS TO CREATE", cartProductsToCreate);
    const cartproducts = await Promise.all(
      cartProductsToCreate.map(createCartProduct)
    );
    console.log("CART PRODUCTS", cartproducts);
    console.log("FINISHED CREATING CART PRODUCTS");
  } catch (err) {
    console.log("ERROR CREATING CART PRODUCTS");
    throw err;
  }
};

// const testAdminCheckById = async (id) => {
//   try {
//     const testing = await adminCheckById(id);
//     console.log("TESTING", testing);
//     return testing;
//   } catch (error) {
//     throw error;
//   }
// };

// const testAdminCreateProduct = async (
//   name,
//   price,
//   condition,
//   rarity,
//   ability1,
//   ability2,
//   imagelink,
//   inventorycount,
//   isactive
// ) => {
//   try {
//     const testing = await adminCreateProduct(
//       name,
//       price,
//       condition,
//       rarity,
//       ability1,
//       ability2,
//       imagelink,
//       inventorycount,
//       isactive
//     );
//     console.log("TESTING", testing);
//   } catch (error) {
//     throw error;
//   }
// };

// const testAdminGetProductIdByName = async (name) => {
//   try {
//     const testing = await adminGetProductIdByName(name);
//     console.log("TESTING", testing);
//   } catch (error) {
//     throw error;
//   }
// };

// const fields = { id: 4, name: "Mew", isactive: false };

// const testAdminUpdateProductById = async (fields) => {
//   try {
//     const testing = await adminUpdateProductById(fields);
//     console.log("TESTING", testing);
//   } catch (error) {
//     throw error;
//   }
// };

// const testAdminSetActiveProductById = async (id, bool) => {
//   try {
//     const testing = await adminSetActiveProductById(id, bool);
//     console.log("TESTING", testing);
//   } catch (error) {
//     throw error;
//   }
// };

// const testAdminGetCustomerByUsername = async (username) => {
//   try {
//     const testing = await adminGetCustomerByUsername(username);
//     console.log("TESTING", testing);
//   } catch (error) {
//     throw error;
//   }
// };

// const testGetOpenCartByCustomerId = async(customerId) => {
//   const test = await getOpenCartByCustomerId(customerId);
//   console.log("ALBERT'S CART", test)
//   console.log("ALBERT'S FIRST PRODUCT", test[0].products)
//   // console.log("ALBERT'S SECOND PRODUCT", test[1].products)

// }
// const testGetPastOrderByCustomerId = async(customerId) => {
//   const test = await getPastOrdersByCustomerId(customerId);
//   console.log("ALBERT'S ORDERS", test)
//   // console.log("ALBERT'S FIRST ORDER PRODUCT", test[0].products)
// }

// const testGetCartIdbyCustomerId = async(customerId) => {
//   const test = await getCartIdbyCustomerId(customerId);
//   console.log("ALBERTS CART ID", test)
// }

const rebuildDB = async () => {
  try {
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialProducts();
    await createInitialCarts();
    //await closeCart(3);

    await createInitialCartProducts();
    // await testGetOpenCartByCustomerId(1);
    // await testGetPastOrderByCustomerId(1);
    // await testGetCartIdbyCustomerId(3);
    // await testAdminCreateProduct({
    //   name: "Mewtwo",
    //   price: "1,000,000",
    //   condition: "mint",
    //   rarity: "holo",
    //   ability1: "psychic",
    //   ability2: "psychic2",
    //   imagelink: "https://images.pokemontcg.io/base1/10_hires.png",
    //   inventorycount: 1,
    //   isactive: true,
    // });
  } catch (err) {
    console.log("ERROR DURING REBUILDDB");
    throw err;
  }
};

module.exports = {
  rebuildDB,
};
