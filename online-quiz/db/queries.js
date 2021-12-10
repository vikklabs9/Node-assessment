const Pool = require("pg").Pool;
const validator = require("validator");
 const bcrypt = require("bcrypt");
// const saltRounds = 10;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "kibalabs_db",
  password: "123@admin",
  port: 5432,
});

let sql_selectall = "select * from users order by id";
let sql_selectOne = `select * from users where id=$1`;
let sql_addAUser = `INSERT INTO users (first_name, last_name, email, password,confirm_password, phone) VALUES ( $1, $2, $3, $4, $5, $6)`;
let sql_updateAUser = `UPDATE users SET first_name = $1, last_name = $2, phone = $3 WHERE id = $4`;
let deleteAUser = `DELETE FROM users WHERE id = $1`;
let sql_loginUser = `select * from users where email=$1 and password=$2`;

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
  const {first_name, last_name, email, password,confirm_password, phone } = request.body;
  

  let phnVal= request.body.phone;
  let passVal = request.body.password;
  let emailVal = request.body.email;

  // let atPlace = emailVal.indexOf("@");
  // let dotPlace = emailVal.lastIndexOf(".");
  
  
  if(request.body.first_name==""){
    response.send({message:"first name is empty"});
  }
   else if(phnVal.length!==10){
    response.send({message: "phone number must be 10 digit"});
  }
  else if(validator.isEmail.emailVal=false){
    response.send({message:"invalid email"})

  }
    else if(passVal.length<6){
    response.send({message: "password must be atleast 6 character"});
  }
  else if(request.body.password !== request.body.confirm_password){
      response.send({message:"confirm password not match"})
  }
  else {
    bcrypt.hash(passVal,10,function(err, hash){
      pool.query(
        sql_addAUser,
        [first_name, last_name, email, hash,hash, phone],
        (error, results) => {
          if (error) {
            throw error;
          }
          response.status(201).send(`Successfully registered`);
      });
    })
  } 
}


  const loginUser = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  pool.query(sql_loginUser,
  [email, password],
  (err, result)=>{
      if(err){
          res.send({err: err});
      } else {
        if(result){
          res.send(result);
      } else {
          res.send({message: "wrong username/password combination"});
      }
    }
  });
};

const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { first_name, last_name, phone } = request.body;

  pool.query(
    sql_updateAUser,
    [first_name, last_name, phone,id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User modified with id: ${id}`);
    }
  );
};


const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(deleteAUser, [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(204).send(`User deleted with ID: ${id}`);
  }
  );
};



module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
};
