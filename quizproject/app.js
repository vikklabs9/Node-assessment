const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db/queries");
const app = express();
const port = 4120;

const ques = require("./quiz/questions");

app.use(express.static("./public"));

app.use(cors());

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.get("/users", db.getUsers);
app.get("/users/:id", db.getUserById);
app.post("/users", db.createUser);
app.put("/users/:id", db.updateUser);
app.delete("/users/:id", db.deleteUser);
app.post("/login", db.loginuser);
app.put("/change/:id", db.forgotPassword);
app.get("/node/questions/:id", ques.getAllNodeQuestions);
app.put("/node/questions/update/:id", ques.updateAns);
app.post("/node/questions/:id", ques.postAllNodeQuestions);
app.get("/node/questions", ques.getAllJavaQuestions);
app.delete("/node/questions/del/:id", ques.deleteques);
app.get("/all", ques.getallquess);
// app.get("/python/questions", ques.getAllPythonQuestions);
app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
