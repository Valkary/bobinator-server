import pool_connection from "../connection";

export function getGlobalProdState() {
  return new Promise((resolve, reject) => {
    pool_connection.query("SELECT gsn.name FROM global_state gs INNER JOIN global_state_names gsn ON gs.state = gsn.id;", (err, result) => {
      if (err) throw reject(err);
      resolve(result);
    });
  });
};