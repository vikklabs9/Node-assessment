const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const db = require("./db/queries");
const ques = require("./que/questions");
const port = 9001;

// const whitelist = ["http://localhost:3000"]
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin || whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error("Not allowed by CORS"))
//     }
//   },
//   //credentials: true,
// }
//app.use(cors(corsOptions))
app.use(cors());

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.get("/", (err, res) => {
  if (err) console.log(err.message);
  res.json({
    info: "online quyiz application",
  });
});

app.get("/users", db.getUsers);
app.get("/users/:id", db.getUserById);
app.post("/users", db.createUser);
app.put("/users/:id", db.updateUser);
app.delete("/users/:id", db.deleteUser);
app.get("/python/questions",ques.getAllQuestions);
app.post("/login",db.loginUser);
app.get("/python/questions/:id",ques.getQueById);
app.post("/python/questions/:id",ques.postAllPythonQue);
app.put("/python/questions/answer/:id",ques.updateAnswer);
app.delete("/python/questions/:id",ques.deleteQues);
app.get("/python/onlyquestions",ques.getOnlyAllQuestions);


app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
