const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const itemController = require("../controllers/itemController");

// HOME PAGE
router.get("/", categoryController.index);

// CATEGORY ROUTES

// View all categories - Index page
router.get("/categories", categoryController.viewCategories);

// This has to come before "/:id otherwise it will read create as an id"
router.get("/category/create", categoryController.createCategoryForm);

router.post("/category/save", categoryController.saveCategory);

router.get("/category/:id/update", categoryController.updateCategoryForm);

router.post("/category/:id/save", categoryController.saveCategory);

router.get("/category/:id/delete", categoryController.deleteCategoryForm);

router.post("/category/:id/delete", categoryController.deleteCategory);



router.get("/category/:id", categoryController.getCategory);

router.get("/items", itemController.viewItems);

router.get("/item/create", itemController.createItemForm);

router.get("/category/:id/createItem", itemController.createItemForm)

router.post("/item/save", itemController.saveItem);


router.get("/item/:id/update", itemController.updateItemForm);

router.post("/item/:id/save", itemController.saveItem);

router.get("/item/:id/delete", itemController.deleteItemForm);

router.post("/item/:id/delete", itemController.deleteItem);

router.get("/item/:id", itemController.getItem);

/* router.post("/item/create", itemController.createItem ) */
/*router.get("/category/create", categoryController.createCategory)

router.get("/category/:id/update", categoryController.updateCategory)

router.post("/category/:id/delete", categoryController.deleteCategory)

router.post("/category/:id?/save", categoryController.saveCategory)



router.get("/category/:id/item/create", categoryController.createItem)

router.get("/category/:id/item/:id/update", categoryController.updateCategory)

router.post("/category/:id/item/:id/delete", categoryController.deleteCategory)

router.post("/category/:id/item/:id?/save", categoryController.saveCategory)
*/

module.exports = router;
