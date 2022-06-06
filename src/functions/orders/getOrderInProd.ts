import pool_connection from "../connection";

export function getOrderInProd() {
  return new Promise<any[]>((resolve, reject) => {
    pool_connection.query("SELECT grouped_pedidos.*, gs.curr_order, p.vueltas, p.cliente FROM(SELECT pedidos.id, pedidos.vueltas, pedidos.cliente, ranked_prod.id_etapa, ranked_prod.prod_time FROM pedidos LEFT JOIN (SELECT id_pedido, id_etapa, prod_time, RANK() OVER(PARTITION BY id_pedido ORDER BY prod_time DESC) date_rank FROM produccion) as ranked_prod ON ranked_prod.id_pedido = pedidos.id WHERE ranked_prod.date_rank = 1) as grouped_pedidos INNER JOIN global_state gs ON gs.curr_order = grouped_pedidos.id INNER JOIN pedidos p ON gs.curr_order = p.id WHERE grouped_pedidos.id = gs.curr_order;", (err: any, result: any[]) => {
      if (err) throw reject(err);
      resolve(result);
    });
  });
};