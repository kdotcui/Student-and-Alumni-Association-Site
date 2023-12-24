const router = require("express").Router()

//requires the routes.
const userRoutes = require("./userRoutes"),
 eventRoutes = require("./eventRoutes"),
 jobRoutes = require("./jobRoutes"),
 homeRoutes = require("./homeRoutes"),
 errorRoutes = require("./errorRoutes"),
 apiRoutes = require("./apiRoutes");

//uses all the routes
router.use("/users", userRoutes);
router.use("/events", eventRoutes);
router.use("/jobs", jobRoutes);
router.use("/", homeRoutes);
router.use("/api", apiRoutes);

router.use("/", errorRoutes);

//exports the routes
module.exports = router;
