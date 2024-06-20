// const { body, validationResult } = require("express-validator");
const CategoryModel = require("../models/categoryModel");
const asyncHandler = require("express-async-handler");
const ItemModel = require("../models/itemModel");
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
  // Get details of the categories
  const [categoryList, itemList] = await Promise.all([
    CategoryModel.countDocuments({}).exec(),
    ItemModel.countDocuments({}).exec(),
  ]);

  res.render("index", {
    categoryListCount: categoryList,
    itemListCount: itemList,
  });
});

exports.viewCategories = asyncHandler(async (req, res, next) => {
  const categoryList = await CategoryModel.find({}).exec();

  res.render("viewCategories", {
    categoryList: categoryList,
  });
});

exports.getCategory = asyncHandler(async (req, res, next) => {
  const [category, itemList] = await Promise.all([
    CategoryModel.findById(req.params.id).exec(),
    ItemModel.find({ category: req.params.id }).exec(),
  ]);

  res.render("category", {
    category: category,
    itemList: itemList,
  });
});

//we don't need async handler since we're not awaiting on any db
exports.createCategoryForm = (req, res, next) => {
  res.render("categoryForm", { title: "Create Category" });
};

exports.updateCategoryForm = asyncHandler(async (req, res, next) => {
  const category = await CategoryModel.findById(req.params.id).exec();

  res.render("categoryForm", {
    title: "Update Category",
    category: category,
  });
});

exports.saveCategory = [
  // Validate and sanitize the name field.
  body("name", "Category name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new CategoryModel({
      name: req.body.name,
      description: req.body.description,
    });

    // If we have an id from the request params, we know we are updating a category
    const updateCategory = JSON.stringify(req.params.id) !== undefined;

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      const title = updateCategory ? "Update Category" : "Create Category";

      res.render("categoryForm", {
        title: title,
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      if (updateCategory) {
        category._id = req.params.id;
        await CategoryModel.findByIdAndUpdate(req.params.id, category);
        res.redirect(category.url);
      } else {
        // We are creating a category
        await category.save();
        res.redirect(category.url);
      }
    }
  }),
];

exports.deleteCategoryForm = asyncHandler(async (req, res, next) => {
  const [category, itemList] = await Promise.all([
    CategoryModel.findById(req.params.id).exec(),
    ItemModel.find({ category: req.params.id }).exec(),
  ]);

  res.render("deleteCategory", {
    title: "Delete Category",
    category: category,
    itemList: itemList,
  });
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  await CategoryModel.deleteOne({ _id: req.params.id });
  await ItemModel.deleteMany({ category: req.params.id });

  res.redirect("/inventory/categories");
});
