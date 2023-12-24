const router = require("express").Router();
const eventsController = require("../controllers/eventsController");
const usersController = require("../controllers/usersController");

//api security check
router.use(usersController.verifyToken);

//route for loading event index in modal
router.get(
  "/events",
  eventsController.index,
  eventsController.filterUserEvents,
  eventsController.respondJSON
);


//route for attending event from modal
router.get(
  "/events/:id/attend",
  eventsController.attend,
  eventsController.respondJSON
);

//router for json error
router.use(eventsController.errorJSON);

//exporting
module.exports = router;
