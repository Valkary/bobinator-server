import pool_connection from "../connection";
import { Order } from './../../types';

function nextInProd() {
  return new Promise<number>((resolve, reject) => {
    pool_connection.query(
      `SELECT grouped_pedidos.*, etapas_produccion.name FROM (SELECT pedidos.id, pedidos.vueltas, pedidos.cliente, ranked_prod.id_etapa, ranked_prod.prod_time FROM pedidos LEFT JOIN (SELECT id_pedido, id_etapa, prod_time, RANK() OVER(PARTITION BY id_pedido ORDER BY prod_time DESC) date_rank FROM produccion) as ranked_prod ON ranked_prod.id_pedido = pedidos.id WHERE ranked_prod.date_rank = 1) as grouped_pedidos INNER JOIN etapas_produccion ON etapas_produccion.id = grouped_pedidos.id_etapa WHERE id_etapa = 2 ORDER BY prod_time ASC LIMIT 0,1;`,
      (err: any, result: Order[]) => {
        if (err) throw err;

        const next_in_prod = typeof result[0] === "undefined" ? 0 : result[0].id;
        resolve(next_in_prod);
      }
    )
  });
}

function updateGlobalProdState(prod_id: number, curr_order: number) {
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

export async function productionLine() {
  const next_in_line = await nextInProd();

  // No hay mas pedidos en la cola de produccion
  if (next_in_line === 0) {
    // Actualizamos al estado de produccion waiting
    const update = await updateGlobalProdState(3, next_in_line);
    console.log(update);
  } else {
    // Actualizamos al estado de produccion in-prod
    const update = await updateGlobalProdState(1, next_in_line);
    console.log(update);
  }
}