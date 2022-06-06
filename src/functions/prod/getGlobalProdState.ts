import pool_connection from "../connection";

export function getGlobalProdState() {
  console.log("Getting global prod state...");
  return new Promise<any[]>((resolve, reject) => {
    pool_connection.query("SELECT gsn.name FROM global_state gs INNER JOIN global_state_names gsn ON gs.state = gsn.id;", (err: any, result: any[]) => {
      if (err) throw reject(err);
      resolve(result);
    });
  });
};