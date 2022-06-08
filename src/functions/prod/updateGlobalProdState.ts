import pool_connection from "../connection";

export function updateGlobalProdState(prod_id: number, curr_order: number) {
  console.log("Updating!");
  return new Promise((resolve, reject) => {
    pool_connection.query(
      `UPDATE global_state SET state = ?, curr_order = ? WHERE state = 1 OR state = 2 OR state = 3;`,
      [prod_id, curr_order],
      (err, result) => {
        if (err) reject(err);
        resolve(true);
      }
    )
  });
}