const { on } = require("events");
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.get("/api/notes:id", (req, res) => {
  let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf-8"));
  res.json(savedNotes[Number(req.params.id)]);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.post("/api/notes", (req, res) => {
  let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf-8"));
  let newNote = req.body;
  let uniqueID = savedNotes.length.toString();
  newNote.id = uniqueID;
  savedNotes.push(newNote);
  fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
  res.json(newNote);
});

// ADD DELETE FUNCTIONALITY IF ABLE
app.delete("/api/notes:id", (req, res) => {
  let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf-8"));
  let noteID = req.params.id;
  let newID = 0;
  savedNotes = savedNotes.filter((currentNote) => {
    return currentNote.id != noteID;
  });

  for (currentNote of savedNotes) {
    currentNote.id = newID.toString();
    newID++;
  }

  fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
  res.json(savedNotes);
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
