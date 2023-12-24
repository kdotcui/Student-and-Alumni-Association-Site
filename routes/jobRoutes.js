const router = require("express").Router();
const jobsController = require("../controllers/jobsController");

//Routing to Jobs
router.get("/", jobsController.index, jobsController.indexView);
router.get("/new", jobsController.new);
router.post(
  "/create",
  jobsController.create,
  jobsController.redirectView
);
router.get("/:id", jobsController.show, jobsController.showView);
router.get("/:id/edit", jobsController.edit);
router.put(
  "/:id/update",
  jobsController.update,
  jobsController.redirectView
);
router.delete(
  "/:id/delete",
  jobsController.delete,
  jobsController.redirectView
);

//Router to not-signed in for event interaction
router.get(
  "/:id/notSignedIn",
  jobsController.notSignedIn,
  jobsController.redirectView
);


module.exports = router;

