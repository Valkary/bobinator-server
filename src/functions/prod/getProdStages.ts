import pool_connection from "../connection";

export function getProdStages() {
  return new Promise((resolve, reject) => {
    pool_connection.query("SELECT * FROM etapas_produccion;", (err, result) => {
      if (err) throw reject(err);
      resolve(result);
    });
  });
};