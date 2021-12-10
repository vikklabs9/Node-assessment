const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "kiba_labs",
  password: "123@admin",
  port: 5432,
});
var validator = require("email-validator");

const ph = require("libphonenumber-js");

const bcrypt = require("bcrypt");

var passwordValidator = require("password-validator");

var schema = new passwordValidator();
const verify = schema
  .is()
  .min(8)
  .is()
  .max(100)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits(2)
  .has()
  .not()
  .spaces()
  .has()
  .symbols()
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123"]);

let sql_selectall =
  "select first_name,last_name,email,password,phone from users";
let sql_selectOne = `select * from users where id=$1`;
let sql_addAUser = `insert into users (first_name,last_name,email,password,confirm_password,phone) values ($1,$2,$3,$4,$5,$6)`;
let sql_updateAUser = `update users set first_name = $1,last_name=$2,phone =$3 where id= $4`;
let deleteAUser = `DELETE FROM users WHERE id = $1`;

pool.connect((err, response) => {
  if (err) console.log(err.message);
  console.log("connected to database successfully");
});

let getUsers = (request, response) => {
  pool.query(sql_selectall, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(sql_selectOne, [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const createUser = (request, response) => {
  const { first_name, last_name, email, password, confirm_password, phone } =
    request.body;
  let secretpass = request.body.password;
  if (verify.validate(request.body.password) == false) {
    response.send(
      "Password must have minimum 8 lenght ,atleast 1 uppercase letter and 1 lowercase letter , 2 digits , 1 special character and no space in between"
    );
  } else if (request.body.password !== request.body.confirm_password) {
    response.send("Password not  match");
  } else if (last_name == "") {
    response.send("last name not be null");
  } else if (validator.validate(request.body.email) != true) {
    response.send("Invalid email");
  } else if (ph.isValidNumber(request.body.phone) == false) {
    response.send("Invalid phone number");
  } else {
    bcrypt.hash(secretpass, 10, function (err, hash) {
      pool.query(
        sql_addAUser,
        [first_name, last_name, email, hash, hash, phone],
        (error, results) => {
          if (error) {
            throw error;
          }
          response
            .status(201)
            .send(
              `User added with name: ${request.body.first_name} The successful registration take place`
            );
        }
      );
    });
  }
};

const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { first_name, last_name, phone } = request.body;
  if (ph.isValidNumber(request.body.phone) == false) {
    response.send("Invalid phone number");
  } else {
    pool.query(
      sql_updateAUser,

      [first_name, last_name, phone, id],
      (error, results) => {
        if (error) {
          throw error;
        }
        response.status(200).send(`User modified with id: ${id}`);
      }
    );
  }
};

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(deleteAUser, [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`User deleted with ID: ${id}`);
  });
};

const loginuser = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  pool.query(
    `select  * from users where email=$1 and password= $2`,
    [email, password],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      } else {
        if (result) {
          res.status(201).send({
            message: `${result.rows[0].first_name}, You are Successfully logged in`,
          });
        } else {
          res.send({ message: "wrong username/password comninations!" });
        }
      }
    }
  );
};

const forgotPassword = (request, response) => {
  const id = parseInt(request.params.id);
  const { password, email } = request.body;

  pool.query(
    `update users set  password=$1 where email =$2 or id=$3`,

    [password, email, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response
        .status(200)
        .send(
          `password is successfully change of id  ${id} and email is ${request.body.email} `
        );
    }
  );
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginuser,
  forgotPassword,
};
