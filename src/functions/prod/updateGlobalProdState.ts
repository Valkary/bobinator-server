import pool_connection from "../connection";

export function updateGlobalProdState(prod_id: number, curr_order: number) {
  return new Promise((resolve, reject) => {
    pool_connection.query(
      `UPDATE global_state SET state = ?, curr_order = ? WHERE state = 1;`,
      [prod_id, curr_order],
      (err, result) => {
        if (err) reject(err);
        resolve(true);
      }
    )
  });
}