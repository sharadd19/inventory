#! /usr/bin/env node

console.log(
  "This script populates some test items and categories to your database."
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const ItemModel = require("./models/itemModel");
const CategoryModel = require("./models/categoryModel");
const items = [];
const categories = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// category[0] will always be the vegetables category, regardless of the order
// in which the elements of promise.all's argument complete.
async function createCategory(index, name, description) {
  const categoryDetail = {
    name: name,
    description: description
  };

  const category = new CategoryModel(categoryDetail);

  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function createItem(index, name, description, category, price, stock) {
  const itemDetail = {
    name: name, 
    description: description, 
    category: category, 
    price: price, 
    stock: stock
  };

  const item = new ItemModel(itemDetail);
  await item.save();
  items[index] = item;
  console.log(`Added item: ${name}`);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    createCategory(0, "Vegetables", "Get one of your five a day!"),
    createCategory(1, "Meats", "Get your protein" ),
    createCategory(2, "Dairy", "Get your fats" ),
    createCategory(3, "Fruits", "Get another of your five a day!!" ),
    createCategory(4, "Bath", "Keep your bathroom clean"),
  ]);
}

async function createItems() {
  console.log("Adding items");
  await Promise.all([
    createItem(0, "Carrot", "Heals the eyes", categories[0], 1, 30),
    createItem(1, "Potato", "Feeds the soul", categories[0], 3, 20),
    createItem(2, "Chicken", "Energises the muscles", categories[1], 8, 20),
    createItem(3, "Beef", "Satisfies the stomach", categories[1], 5, 6),
    createItem(4, "Pork", "Satiates the belly", categories[1], 10, 4),
    createItem(5, "Cheese", "Smells terrible", categories[2], 2, 50),
    createItem(6, "Milk", "Develops the bones", categories[2],2, 100),
    createItem(7, "Yoghurt", "Promotes the gut", categories[2], 2, 15),
    createItem(8, "Apple", "One of your five a day", categories[3], 3, 8),
    createItem(9, "Blueberries", "Nutritiously delicious ", categories[3], 4, 5),
    createItem(10, "Banana", "Great for a smoothie", categories[3], 2, 20),
    createItem(11, "Orange", "Tantalises the tastebuds", categories[3], 3, 9)
  ]);
}
