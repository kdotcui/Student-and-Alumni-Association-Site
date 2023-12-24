//Renders the basic web pages
exports.showAbout = (req,res) => {
  res.render("about");
}

exports.showContact = (req,res) => {
  res.render("contact");
}

exports.showEvents = (req,res) => {
  res.render("events");
}

exports.showHome = (req,res) => {
  res.render("index");
}

exports.showJobs = (req,res) => {
  res.render("jobs");
}

exports.chat = (req, res) => {
  res.render("chat");
}

