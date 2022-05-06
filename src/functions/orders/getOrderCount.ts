import { percentages } from './../../types';
import pool_connection from "../connection";

export function countOrdersWithoutApproval() {
  return new Promise<number>((resolve, reject) => {
    pool_connection.query("SELECT COUNT(*) AS por_aprobar FROM pedidos LEFT JOIN(SELECT id_pedido, id_etapa, prod_time, RANK() OVER(PARTITION BY id_pedido ORDER BY prod_time DESC) date_rank FROM produccion) as ranked_prod ON ranked_prod.id_pedido = pedidos.id WHERE ranked_prod.date_rank = 1 AND id_etapa = 1;", (err, result: [{por_aprobar: number }]) => {
      if (err) throw reject(err);
      resolve(result[0].por_aprobar);
    });
  });
}

export function countApprovedOrders() {
  return new Promise<number>((resolve, reject) => {
    pool_connection.query("SELECT COUNT(*) AS aprobados FROM pedidos LEFT JOIN(SELECT id_pedido, id_etapa, prod_time, RANK() OVER(PARTITION BY id_pedido ORDER BY prod_time DESC) date_rank FROM produccion) as ranked_prod ON ranked_prod.id_pedido = pedidos.id WHERE ranked_prod.date_rank = 1 AND id_etapa = 2;", (err, result: [{ aprobados: number }]) => {
      if (err) throw reject(err);
      resolve(result[0].aprobados);
    });
  });
}

export function countOrdersInProduction() {
  return new Promise<number>((resolve, reject) => {
    pool_connection.query("SELECT COUNT(*) AS en_produccion FROM pedidos LEFT JOIN(SELECT id_pedido, id_etapa, prod_time, RANK() OVER(PARTITION BY id_pedido ORDER BY prod_time DESC) date_rank FROM produccion) as ranked_prod ON ranked_prod.id_pedido = pedidos.id WHERE ranked_prod.date_rank = 1 AND id_etapa > 2 AND id_etapa < 6;", (err, result: [{ en_produccion: number }]) => {
      if (err) throw reject(err);
      resolve(result[0].en_produccion);
    });
  });
}

export function countFinishedOrders() {
  return new Promise<number>((resolve, reject) => {
    pool_connection.query("SELECT COUNT(*) AS terminadas FROM pedidos LEFT JOIN(SELECT id_pedido, id_etapa, prod_time, RANK() OVER(PARTITION BY id_pedido ORDER BY prod_time DESC) date_rank FROM produccion) as ranked_prod ON ranked_prod.id_pedido = pedidos.id WHERE ranked_prod.date_rank = 6;", (err, result: [{ terminadas: number }]) => {
      if (err) throw reject(err);
      resolve(result[0].terminadas);
    });
  });
}

export function calculatePercentages() {
  return new Promise<percentages>(async (resolve, reject) => {
    const not_approved = await countOrdersWithoutApproval();
    const approved = await countApprovedOrders();
    const in_prod = await countOrdersInProduction();
    const finished = await countFinishedOrders();

    const total_sum = not_approved + approved + in_prod + finished;

    const percentages = {
      total_orders: total_sum,
      not_approved: (not_approved * 100) / total_sum,
      not_approved_count: not_approved,
      approved: (approved * 100) / total_sum,
      approved_count: approved,
      in_prod: (in_prod * 100) / total_sum,
      in_prod_count: in_prod,
      finished: (finished * 100) / total_sum,
      finished_count: finished,
    }
    
    resolve(percentages);
  });
}

