const Job = require("../models/job");
const User = require("../models/user");
//model for a job
const getJobParams = (body) => {
  return {
    title: body.title,
    company: body.company,
    location: body.location,
    description: body.description,
    requirements: body.requirements,
    salary: body.salary,
    contactEmail: body.contactEmail,
    contactPhone: body.contactPhone,
    postDate: body.postDate,
    deadlineDate: body.deadlineDate,
    isActive: body.isActive,
    organizer: body.organizer,
  };
};

//EXports the CRUD Functions of a job, 
module.exports = {
  //Displays each job within a page
  index: (req, res, next) => {
    Job.find()
      .then((jobs) => {
        res.locals.jobs = jobs;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching jobs: ${error.message}`);
        next(error);
      });
  },
  //Renders the job index page
  indexView: (req, res) => {
    res.render("jobs/index");
  },
  //Renders page to create new job
  new: (req, res) => {
    res.render("jobs/new");
  },

  //Creates a new job
  create: (req, res, next) => {
    if (req.body.organizer === undefined) {
      req.flash("error", "Please sign in to create an job");
      res.locals.redirect = "/users/login";
      return next();
    }
    let jobParams = getJobParams(req.body);
    Job.create(jobParams)
      .then((job) => {
        req.flash(
          "success",
          `${job.title} job created successfully!`
        );
        res.locals.redirect = "/jobs";
        res.locals.job = job;
        next();
      })
      .catch((error) => {
        console.log(`Error saving course: ${error.message}`);
        req.flash(
          "error",
          `Failed to create job account because: ${error.message}.`
        );
        res.locals.redirect = "/jobs/new";
        next();
      });
  },

  //directs to new page
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
  //Renders Job info given id, on one page
  show: (req, res, next) => {
    let jobId = req.params.id;
    Job.findById(jobId)
      .then((job) => {
        req.flash(
          "success",
          `Job retrieved successfully!`
        );
        res.locals.job = job;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching job by ID: ${error.message}`);
        req.flash(
          "error",
          `Failed to find job because: ${error.message}.`
        );
        res.locals.redirect = "/jobs";
        next();
      });
  },

  //The view of the job info
  showView: (req, res) => {
    res.render("jobs/show");
  },

  //Allows for editing of job
  edit: (req, res, next) => {
    let jobId = req.params.id;
    Job.findById(jobId)
      .then((job) => {
        if (res.locals.currentUser.id == job.organizer || res.locals.currentUser.isAdmin) {
          res.render("jobs/edit", {
            job: job,
          });
        } else {
          req.flash("error", "You do not have permission to edit this job");
          res.redirect("/users/login");
          return next();
        }
      })
      .catch((error) => {
        console.log(`Error fetching job by ID: ${error.message}`);
        next(error);
      });
  },
  //CRUD Update method for job
  update: (req, res, next) => {
    let jobId = req.params.id,
      jobParams = getJobParams(req.body);
    Job.findByIdAndUpdate(jobId, {
      $set: jobParams,
    })
      .then((job) => {
        res.locals.redirect = `/jobs/${jobId}`;
        res.locals.job = job;
        next();
      })
      .catch((error) => {
        console.log(`Error updating job by ID: ${error.message}`);
        next(error);
      });
  },

  //CRUD Delete method for job
  delete: (req, res, next) => {
    if (!res.locals.currentUser.isAdmin) {
      req.flash("error", "You do not have permission to delete this job");
      res.redirect("/users/login");
      return next();
    }
    let jobId = req.params.id;
    Job.findByIdAndRemove(jobId)
      .then(() => {
        res.locals.redirect = "/jobs";
        next();
      })
      .catch((error) => {
        console.log(`Error deleting job by ID: ${error.message}`);
        next();
      });
  },
  //Validate job info using express-validator
  validate: (req, res, next) => {
    req.check("title", "title cannot be empty").notEmpty();
    req.check("contactEmail", "Email is invalid").isEmail();
    req.check("contactPhone", "Contact Phone is invalid")
      .notEmpty()
      .isInt()
      .equals(req.body.contactPhone);
    req.check("description", "Description cannot be empty").notEmpty();
    req.getValidationResult().then((error) => {
      if (!error.isEmpty()) {
        let messages = error.array().map((e) => e.msg);
        req.skip = true;
        req.flash("error", messages.join(" and "));
        res.locals.redirect = "/jobs/new";
        next();
      } else {
        next();
      }
    });
  },
  //Default method for when non-signed in users try interacting with job
  notSignedIn: (req, res, next) => {
    let userId = req.params.userId;
    if (userId === undefined) {
    req.flash("error", "Please sign in to interact with jobs");
    res.locals.redirect = "/users/login";
    return next();
  }
  },
};
