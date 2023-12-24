const router = require("express").Router();
const errorController = require("../controllers/errorController");

//Routing to Errors
router.use(errorController.pageNotFoundError);
router.use(errorController.internalServerError);

//export methods
module.exports = router;

