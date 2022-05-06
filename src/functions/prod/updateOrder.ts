import pool_connection from "../connection";

export function getCurrentOrderStatus(id: number) {
  return new Promise<[{ id_etapa: number }]>((resolve, reject) => {
    pool_connection.query(`SELECT grouped_pedidos.id_etapa FROM(SELECT pedidos.id, pedidos.vueltas, pedidos.cliente, ranked_prod.id_etapa, ranked_prod.prod_time FROM pedidos LEFT JOIN (SELECT id_pedido, id_etapa, prod_time, RANK() OVER(PARTITION BY id_pedido ORDER BY prod_time DESC) date_rank FROM produccion) as ranked_prod ON ranked_prod.id_pedido = pedidos.id WHERE ranked_prod.date_rank = 1) as grouped_pedidos INNER JOIN etapas_produccion ON etapas_produccion.id = grouped_pedidos.id_etapa WHERE grouped_pedidos.id = ?;`, [id], (err, result: any) => {
      if (err) throw reject(400);
      resolve(result);
    });
  });
};

export function updateOrder(id:number, next_stage: number) {
  return new Promise<any>((resolve, reject) => {
    pool_connection.query(`INSERT INTO produccion (id_pedido, id_etapa) VALUES (?,?);`, [id, next_stage], (err, result: any) => {
      if (err) throw reject(err);
      resolve({ success: true, message: `El pedido #${id} ha pasado a la etapa no. ${next_stage} de manera exitosa en la línea ${result.insertId}!`});
    });
  });
}