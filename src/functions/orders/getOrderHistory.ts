import pool_connection from "../connection";
import { NamedOrder } from './../../types';

export function getOrderHistory() {
  console.log("Getting order history");
  return new Promise<[NamedOrder]>((resolve, reject) => {
    pool_connection.query("SELECT p.id, p.vueltas, ep.name as etapa, pr.prod_time FROM produccion pr INNER JOIN pedidos p ON p.id = pr.id_pedido INNER JOIN etapas_produccion ep ON ep.id = pr.id_etapa ORDER BY pr.prod_time DESC;", (err, result: any) => {
      if (err) throw reject(err);
      resolve(result);
    });
  });
};