import pool_connection from "../connection";

export function globalProdState() {
  console.log("Getting global prod state...");
  return new Promise<any[]>((resolve, reject) => {
    pool_connection.query("SELECT * FROM global_state;", (err: any, result: any[]) => {
      if (err) throw reject(err);
      resolve(result);
    });
  });
};