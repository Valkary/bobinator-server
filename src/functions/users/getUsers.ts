import pool_connection from "../connection";

export function getUsers() {
  console.log("Retrieving all users information from the database!");

  return new Promise((resolve, reject) => {
    pool_connection.query("SELECT * FROM users;", (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  })
};