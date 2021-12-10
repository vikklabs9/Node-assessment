const express = require("express");
const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "kibalabs_db",
  password: "123@admin",
  port:5432,
});
let scorecard=0;

let sql_getquestion = `select * from questions ORDER BY id`;
let sql_selectOneQue = `select que from questions where id=$1 `;
let sql_updateAns = `UPDATE questions SET ans = $1 WHERE id = $2`;
let deleteAQue = `DELETE FROM questions WHERE id = $1`;
let sql_getAllQue = `select que from questions`;

pool.connect((err, response) => {
  if (err) console.log(err.message);
  console.log("connected to database successfully");
});

let getAllQuestions = (request, response) => {
  pool.query(sql_getquestion, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

let getOnlyAllQuestions = (request, response) => {
  pool.query(sql_getAllQue, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getQueById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(sql_selectOneQue, [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const updateAnswer = (request, response) => {
  const id = parseInt(request.params.id);
  const { ans } = request.body;

  pool.query(
    sql_updateAns,
    [ans, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User modified with id: ${id}`);
    }
  );
};

const deleteQues = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(deleteAQue, [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(204).send(`Question deleted with ID: ${id}`);
  }
  );
};

let postAllPythonQue = (request, response) => {
const { ans } = request.body;
let question_id = request.params["id"];
pool.query(`select * from questions where ans=$1 and id=${question_id}`,
[ans],
 (error, results) => {
 if (error) {
 throw error;
} else {
    if (results.rowCount == 1) {
       scorecard++;
       response.status(201).send(`Correct Answer: ${request.body.ans}, got 1 score and your total score is ${scorecard}`);

        } else {
        response.send({ message: "wrong answer" });
        }
      }
    });
  }



module.exports = {
  getAllQuestions,
  getQueById,
  postAllPythonQue,
  updateAnswer,
  deleteQues,
  getOnlyAllQuestions,
};
