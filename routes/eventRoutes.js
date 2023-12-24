const router = require("express").Router();
const eventsController = require("../controllers/eventsController");

//routing to events index
router.get("/", eventsController.index, eventsController.indexView);
router.get("/new", eventsController.new);
router.post(
  "/create",
  eventsController.create,
  eventsController.redirectView
);

//routes for getting a specific event and being able to edit, and update it
router.get("/:id", eventsController.show, eventsController.showView);
router.get("/:id/edit", eventsController.edit);

router.put(
  "/:id/update",
  eventsController.update,
  eventsController.redirectView
);
//route for deletion
router.delete(
  "/:id/delete",
  eventsController.delete,
  eventsController.redirectView
);
//routes for when a user wants to attend an event either signed in or not signed in

router.get(
  "/:id/attend",
  eventsController.attend,
  eventsController.redirectView
);
//Router to not-signed in for event interaction
router.get(
  "/:eventId/notSignedIn",
  eventsController.notSignedIn,
  eventsController.redirectView
);

module.exports = router;

