import pool_connection from "../connection";

export function retrieveTodaysLogs() {
  console.log("Retrieving todays logs from the database!");

  return new Promise((resolve, reject) => {
    pool_connection.query(
      "SELECT id, log, date_time FROM logs WHERE CURDATE() = DATE(date_time)",
      (err, result) => {
      if (err) throw reject(err);
      resolve(result);
    });
  });
};