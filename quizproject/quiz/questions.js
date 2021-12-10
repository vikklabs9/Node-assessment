const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "kiba_labs",
  password: "123@admin",
  port: 5432,
});
let scorecard = 0;
let allquess = `select ques from  nodequestions`;
let sql_getnodequestion = "select ques from nodequestions where id=$1";
let sql_getjavaquestion = "select * from nodequestions";
let upadte_ans = "update nodequestions set answer=$1 where id=$2";
let delete_ques = "DELETE FROM  nodequestions WHERE id = $1";
pool.connect((err, response) => {
  if (err) console.log(err.message);
  console.log("connected to database successfully");
});

let getallquess = (request, response) => {
  pool.query(allquess, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

let getAllNodeQuestions = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(sql_getnodequestion, [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

let postAllNodeQuestions = (request, response) => {
  const { answer } = request.body;
  let question_id = request.params["id"];

  pool.query(
    `select * from nodequestions where lower(answer)=$1 and id=${question_id}`,
    [answer],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        if (results.rowCount == 1) {
          scorecard++;
          response
            .status(201)
            .send(
              `Correct Answer: ${request.body.answer} and you got 1 marks and  the total score is ${scorecard}🏆`
            );
        } else {
          response.send({ message: "wrong answer" });
        }
      }
    }
  );
};

let getAllJavaQuestions = (request, response) => {
  pool.query(sql_getjavaquestion, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const updateAns = (request, response) => {
  const id = parseInt(request.params.id);
  const { answer } = request.body;

  pool.query(
    upadte_ans,

    [answer, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Answer modified with id: ${id}`);
    }
  );
};

const deleteques = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(delete_ques, [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(` Question  deleted with ID: ${id}`);
  });
};

module.exports = {
  getAllNodeQuestions,
  getAllJavaQuestions,
  updateAns,
  deleteques,
  postAllNodeQuestions,
  getallquess,
};
