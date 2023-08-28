const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { dirname } = require("path");
const e = require("express");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

mongoose.connect(
  "mongodb+srv://pratt:prattato@cluster0.liaqlfn.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const taskSchema = new mongoose.Schema({
  task: String,
  order: Number,
});

const timetableSchema = new mongoose.Schema({
  tag: String,
  taskAt11: String,
  taskAt12: String,
  taskAt13: String,
  taskAt14: String,
  taskAt15: String,
  taskAt16: String,
  taskAt17: String,
  taskAt18: String,
  taskAt19: String,
});

const task = new mongoose.model("task", taskSchema);
const timetable = new mongoose.model("timetable", timetableSchema);

app.get("/", (req, res) => {
  task.find({}).then((foundTasks) => {
    timetable.find({}).then((foundTimetable) => {
      // const randomIndex = Math.floor(Math.random() * foundTasks.length);
      res.render("index", {
        // currentTask: foundTasks[randomIndex],
        timetable: foundTimetable,
        tasks: foundTasks,
      });
    });
  });
});

app.get("/assignOrder", (req, res) => {
  task.find({}).then((foundTasks) => {
    for (i = 11; i < 20; i++) {
      const randomTask = Math.floor(Math.random() * foundTasks.length);

      // foundTasks[randomTask].order = i;
      console.log("looking for" + foundTasks[randomTask].task);
      task
        .findOneAndUpdate({ task: foundTasks[randomTask].task }, { order: i })
        .then((err) => {
          console.log(err);
        });
    }
    res.redirect("/");
  });
});

app.get("/clearTimetable", (req, res) => {
  timetable.deleteOne({ tag: "pratt" }).then((err) => {
    console.log("deleted yesterday timetable");
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
});

app.post("/create", async (req, res) => {
  // console.log(req.body);

  console.log(task);

  const newTask = new task({
    task: req.body.taskName,
    order: 0,
  });

  newTask.save();

  res.redirect("/");

  // res.json({ message: "Array received successfully" });
});

app.post("/timetable", (req, res) => {
  console.log(req.body);

  timetable.findOne({ tag: "pratt" }).then((foundTT) => {
    if (foundTT != null) {
      console.log("foundTT is not null");
      timetable
        .findOneAndUpdate(
          { tag: "pratt" },
          {
            taskAt11: req.body.taskAt11,
            taskAt12: req.body.taskAt12,
            taskAt13: req.body.taskAt13,
            taskAt14: req.body.taskAt14,
            taskAt15: req.body.taskAt15,
            taskAt16: req.body.taskAt16,
            taskAt17: req.body.taskAt17,
            taskAt18: req.body.taskAt18,
            taskAt19: req.body.taskAt19,
          }
        )
        .then((err) => {
          console.log(err);
          res.redirect("/");
        });
    } else {
      console.log("did not find TT");
      const newTimetable = new timetable({
        tag: "pratt",
        taskAt11: req.body.taskAt11,
        taskAt12: req.body.taskAt12,
        taskAt13: req.body.taskAt13,
        taskAt14: req.body.taskAt14,
        taskAt15: req.body.taskAt15,
        taskAt16: req.body.taskAt16,
        taskAt17: req.body.taskAt17,
        taskAt18: req.body.taskAt18,
        taskAt19: req.body.taskAt19,
      });

      newTimetable.save();
      res.redirect("/");
    }
  });
});

app.listen(process.env.PORT || 3000, (req, res) => {
  console.log("Server Running");
});
