const asyncHandler = require("express-async-handler");
const ItemModel = require("../models/itemModel");
const CategoryModel = require("../models/categoryModel");
const { body, validationResult } = require("express-validator");

exports.viewItems = asyncHandler(async (req, res, next) => {
  const itemList = await ItemModel.find({}).exec();

  res.render("viewItems", {
    itemList: itemList,
  });
});

exports.getItem = asyncHandler(async (req, res, next) => {
  const item = await ItemModel.findById(req.params.id)
    .populate("category")
    .exec();

  res.render("item", {
    item: item,
  });
});

//we don't need async handler since we're not awaiting on any db
exports.createItemForm = asyncHandler(async (req, res, next) => {
  const [categoryExists, categories] = await Promise.all([
    CategoryModel.findById(req.params.id).exec(),
    CategoryModel.find({}, "name").exec()
  ])
  res.render("itemForm", {
    title: "Create Item",
    categories: categories,
    categoryExists: categoryExists,
  });
});

exports.updateItemForm = asyncHandler(async (req, res, next) => {
  const [item, categories] = await Promise.all([
    ItemModel.findById(req.params.id).exec(),
    CategoryModel.find({}, "name").exec(),
  ]);

  res.render("itemForm", {
    title: "Update Item",
    item: item,
    categories: categories,
  });
});

exports.deleteItemForm = asyncHandler(async (req, res, next) => {
  const item = await ItemModel.findById(req.params.id)
    .populate("category")
    .exec();

  res.render("deleteItem", {
    title: "Delete Item",
    item: item,
  });
});

exports.deleteItem = asyncHandler(async (req, res) => {
  await ItemModel.deleteOne({ _id: req.params.id });

  res.redirect("/inventory/items");
});

exports.saveItem = [
  // Validate and sanitize the name field.
  body("name", "Item name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category", "Category must not be empty")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const categories = await CategoryModel.find({}, "name").exec();
    const item = new ItemModel({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
    });
    // If we have an id from the request params, we know we are updating a item
    const updateItem = JSON.stringify(req.params.id) !== undefined;

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      const title = updateItem ? "Update Item" : "Create Item";

      res.render("itemForm", {
        title: title,
        item: item,
        categories: categories,
        errors: errors.array(),
      });
      return;
    } else {
      if (updateItem) {
        item._id = req.params.id;
        await ItemModel.findByIdAndUpdate(req.params.id, item);
        res.redirect(item.url);
      } else {
        // We are creating a item
        await item.save();
        res.redirect(item.url);
      }
    }
  }),
];
