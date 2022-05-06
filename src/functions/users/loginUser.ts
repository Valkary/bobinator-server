import pool_connection from "../connection";
const bcrypt = require('bcrypt');

export function getUserEncryptedPassword(username: string) {
  console.log("Searching if user is in the database!");

  return new Promise<string>((resolve, reject) => {
    pool_connection.query("SELECT password FROM users WHERE username = ?;", [username], (err, result: any) => {
      if (err) reject(err);
      resolve(result[0]?.password);
    });
  })
}

export function encryptUserPassword(password: string) {
  return new Promise<string>((resolve, reject) => {
    bcrypt.hash(password, 10, (err: any, hash: string) => {
      if (err) reject(err);
      resolve(hash);
    });
  });
}

export function verifyHashedPasswords(password: string, db_password: string) {
  return new Promise<boolean>(async (resolve, reject) => {
    const match: boolean = await bcrypt.compare(password, db_password);
    resolve(match);
  });
}