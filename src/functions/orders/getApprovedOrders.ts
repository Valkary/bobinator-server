import pool_connection from "../connection";

export function getApprovedOrders() {
  return new Promise((resolve, reject) => {
    pool_connection.query("SELECT grouped_pedidos.*, etapas_produccion.name FROM (SELECT pedidos.id, pedidos.vueltas, pedidos.cliente, ranked_prod.id_etapa, ranked_prod.prod_time FROM pedidos LEFT JOIN (SELECT id_pedido, id_etapa, prod_time, RANK() OVER(PARTITION BY id_pedido ORDER BY prod_time DESC) date_rank FROM produccion) as ranked_prod ON ranked_prod.id_pedido = pedidos.id WHERE ranked_prod.date_rank = 1) as grouped_pedidos INNER JOIN etapas_produccion ON etapas_produccion.id = grouped_pedidos.id_etapa WHERE id_etapa = 2;", (err, result) => {
      if (err) throw reject(err);
      resolve(result);
    });
  });
};