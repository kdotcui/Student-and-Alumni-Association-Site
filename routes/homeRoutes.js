const router = require("express").Router();
const homeController = require("../controllers/homeController");

router.get("/", homeController.showHome);
router.get("/index", homeController.showHome);
router.get("/about", homeController.showAbout);
router.get("/contact", homeController.showContact);
router.get("/chat", homeController.chat);

module.exports = router;

