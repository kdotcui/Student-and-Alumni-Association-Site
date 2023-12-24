const Event = require("../models/event");
const httpStatus = require("http-status-codes");
//Initializes a event model to pull data from
const getEventParams = (body) => {
  return {
    title: body.title,
    description: body.description,
    location: body.location,
    startDate: body.startDate,
    endDate: body.endDate,
    isOnline: body.isOnline,
    registrationLink: body.registrationLink,
    organizer: body.organizer,
    attendees: body.attendees
  };
};


module.exports = {
  //Handles displaying all events, singular events, creating new events
  index: (req, res, next) => {
    Event.find()
      .then((events) => {
        res.locals.events = events;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching events: ${error.message}`);
        next(error);
      });
  },
  //Redirects user to the singular event view
  indexView: (req, res) => {
    res.render("events/index");
  },
  //Renders page to take in new event info
  new: (req, res) => {
    res.render("events/new");
  },
  //Given the params for a new evnet, creates event
  create: (req, res, next) => {
    if (req.body.organizer === undefined) {
      req.flash("error", "Please sign in to create an event");
      res.locals.redirect = "/users/login";
      return next();
    }
    let eventParams = getEventParams(req.body);
    Event.create(eventParams)
      .then((event) => {
        req.flash("success", `${event.title} event created successfully!`);
        res.locals.redirect = "/events";
        res.locals.event = event;
        next();
      })
      .catch((error) => {
        console.log(`Error saving event: ${error.message}`);
        req.flash("error", `Failed to create event because: ${error.message}.`);
        res.locals.redirect = "/events/new";
        next();
      });
  },
  //Redirects user to appropriate page
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
  //shows Specific details about one event
  show: (req, res, next) => {
    let eventId = req.params.id;
    Event.findById(eventId)
      .then((event) => {
        Event.populate(event, "users").then((event) => {
          console.log(event);
          res.locals.event = event;
          next();
        });
      })
      .catch((error) => {
        console.log(`Error fetching event by ID: ${error.message}`);
        res.locals.redirect = "/events";
        next(error);
      });
  },

  //Renders the page taht displays the individual details
  showView: (req, res) => {
    res.render("events/show");
  },

  //Renders the page for editing the event
  edit: (req, res, next) => {
    let eventId = req.params.id;
    Event.findById(eventId)
      .then((event) => {
        if (res.locals.currentUser.id == event.organizer || res.locals.currentUser.isAdmin) {
          res.render("events/edit", {
            event: event,
          });
        } else {
          req.flash("error", "You do not have permission to edit this events");
          res.redirect("/users/login");
          return next();
        }
      })
      .catch((error) => {
        console.log(`Error fetching event by ID: ${error.message}`);
        next(error);
      });
  },
  //Sets the events params to the given params | used for edit and register
  update: (req, res, next) => {
    let eventId = req.params.id,
      eventParams = getEventParams(req.body);
    Event.findByIdAndUpdate(eventId, {
      $set: eventParams,
    })
      .then((event) => {
        res.locals.redirect = `/events/${eventId}`;
        res.locals.event = event;
        next();
      })
      .catch((error) => {
        console.log(`Error updating event by ID: ${error.message}`);
        next(error);
      });
  },
  
  //Deletes an event given event id
  delete: (req, res, next) => {
    if (!res.locals.currentUser.isAdmin) {
      req.flash("error", "You do not have permission to delete this job");
      res.redirect("/users/login");
      return next();
    }
    let eventId = req.params.id;
    Event.findByIdAndRemove(eventId)
      .then(() => {
        res.locals.redirect = "/events";
        next();
      })
      .catch((error) => {
        console.log(`Error deleting event by ID: ${error.message}`);
        next();
      });
  },

  //Given a eventId, adds the userID to event attendees
  attend: (req, res, next) => {
    let eventId = req.params.id,
        user = res.locals.currentUser;
    if (user === undefined) {
      req.flash("error", "Please sign in to attend events");
      res.locals.redirect = "/users/login";
      return next();
    }
    Event.updateOne({ _id: eventId }, { $push: { attendees: user } })
      .then((result) => {
        req.flash(
          "You have been registered!"
        );
        res.locals.success = true;
        res.locals.redirect = "/events";
        console.log(result);
        next();
      })
      .catch((error) => {
        console.log(`Error attending event: ${error.message}`);
        next(error);
      });
  },
  //Default method for when non-signed in users try interacting with event
  notSignedIn: (req, res, next) => {
    let eventId = req.params.eventId,
    userId = req.params.userId;
    if (userId === undefined) {
    req.flash("error", "Please sign in to interact with events");
    res.locals.redirect = "/users/login";
    return next();
  }
  },
  //Validate method using express-validator
  validate: (req, res, next) => {
    req.check("title", "title cannot be empty").notEmpty();
    req.check("description", "Description cannot be empty").notEmpty();
    req.check("registrationLink", "Link is invalid").isURL();
    req.check("contactPhone", "Contact Phone is invalid").notEmpty().isInt().equals(req.body.contactPhone);
    req.check("startDate", "Start date must be before end date")
      .custom((startDate, { req }) => {
        const endDate = req.body.endDate;
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);

        if (startDateObj < endDateObj) {
          return true;
        }
        throw new Error("Start date must be before end date");
    });
    req.getValidationResult().then((error) => {
      if (!error.isEmpty()) {
        let messages = error.array().map((e) => e.msg);
        req.skip = true;
        req.flash("error", messages.join(" and "));
        res.locals.redirect = "/events/new";
        next();
      } else {
        next();
      }
    });
  },
  //responds with json format
  respondJSON: (req, res) => {
    res.json({
      status: httpStatus.OK,
      data: res.locals,
    });
  },
  //handles error for json indexing
  errorJSON: (error, req, res, next) => {
    let errorObject;
    if (error) {
      errorObject = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    } else {
      errorObject = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Unknown Error.",
      };
    }
    res.json(errorObject);
  },
  //filters which user events get displayed
  filterUserEvents: (req, res, next) => {
    // Get the current user from res.locals
    let currentUser = res.locals.currentUser;
    // Check if there is a current user
    if (currentUser) {
      // Map through the events in res.locals
      let mappedEvents = res.locals.events.map((event) => {
        // Check if the current user has joined the course
        let userJoined = event.attendees.includes(currentUser.id);        // Add a 'joined' property to the course object indicating whether the user has joined
        return Object.assign(event.toObject(), { joined: userJoined });
      });
      // Update res.locals.courses with the mapped courses
      res.locals.events = mappedEvents;
      // Continue to the next middleware
      next();
    } else {
      // If there is no current user, continue to the next middleware
      next();
    }
  },
  

};
