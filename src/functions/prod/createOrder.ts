import pool_connection from "../connection";

export function createOrder(metros: number) {
  return new Promise((resolve, reject) => {
    pool_connection.query(
      "INSERT INTO pedidos (vueltas, cliente, aprobado, aprobado_por, etapa) VALUES (?, 1, 1, 1, 1)", [metros], (err, result: any) => {
      if (err) throw reject(err);
      resolve(result.insertId);
    });
  });
};

export function createProdOrder(id: number) {
  return new Promise((resolve, reject) => {
    pool_connection.query(
      "INSERT INTO produccion (id_pedido, id_etapa) VALUES (?, 1)", [id], (err, result) => {
      if (err) throw reject(err);
      resolve(true);
    });
  });
};