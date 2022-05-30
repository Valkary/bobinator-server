import pool_connection from "../connection";

export function logIntoDB(message: string) {
  return new Promise<{ success: boolean }>((resolve, reject) => {
    pool_connection.query(
      "INSERT logs (log) VALUE (?)", [message],
      (err, result) => {
        if (err) reject(err);
        resolve({ success: true });
      }
    );
  });
};