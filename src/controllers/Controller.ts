import { Request, Response } from 'express';
import { io } from '../socket';

import { logIntoDB } from '../functions/logs/logIntoDB';
import { retrieveTodaysLogs } from '../functions/logs/retrieveTodaysLogs';
import { getApprovedOrders } from '../functions/orders/getApprovedOrders';
import { getFinishedOrders } from '../functions/orders/getFinishedOrders';
import { getOrderInProd } from '../functions/orders/getOrderInProd';
import { getOrders } from '../functions/orders/getOrders';
import { getOrdersOnHold } from '../functions/orders/getOrdersOnHold';
import { getGlobalProdState } from '../functions/prod/getGlobalProdState';
import { getProdStages } from '../functions/prod/getProdStages';
import { getCurrentOrderStatus, updateOrder } from '../functions/prod/updateOrder';
import { getUsers } from '../functions/users/getUsers';
import { getUserEncryptedPassword, verifyHashedPasswords } from '../functions/users/loginUser';
import { getOrderHistory } from '../functions/orders/getOrderHistory';
import { calculatePercentages } from '../functions/orders/getOrderCount';
import { createOrder, createProdOrder } from '../functions/prod/createOrder';
import { productionLine } from '../functions/prod/prodLine';
import { updateGlobalProdState } from '../functions/prod/updateGlobalProdState';
import { globalProdState } from '../functions/prod/globalProdState';

export const Controller = {
  home: async (req: Request, res: Response) => {
    res.status(200).send('Bienvenido al servidor de Bobinator!');
  },
  users: async (req: Request, res: Response) => {
    const users = await getUsers();
    res.status(200).send(users);
  },
  todays_logs: async (req: Request, res: Response) => {
    const todays_logs = await retrieveTodaysLogs();
    res.status(200).send(todays_logs);
  },
  global_prod_state: async (req: Request, res: Response) => {
    console.log("Getting prod state");
    const prod_state = await getGlobalProdState();
    res.status(200).send(prod_state);
  },
  get_prod_stages: async (req: Request, res: Response) => {
    const prod_stages = await getProdStages();
    res.status(200).send(prod_stages);
  },
  get_orders: async (req: Request, res: Response) => {
    const orders = await getOrders();
    res.status(200).send(orders);
  },
  get_order_in_prod: async (req: Request, res: Response) => {
    const order_in_prod = await getOrderInProd();
    res.status(200).send(order_in_prod);
  },
  get_approved_orders: async (req: Request, res: Response) => {
    const approved_orders = await getApprovedOrders();
    res.status(200).send(approved_orders);
  },
  get_finished_orders: async (req: Request, res: Response) => {
    const finished_orders = await getFinishedOrders();
    res.status(200).send(finished_orders);
  },
  get_on_hold_orders: async (req: Request, res: Response) => {
    const orders_on_hold = await getOrdersOnHold();
    res.status(200).send(orders_on_hold);
  },
  get_order_history: async (req: Request, res: Response) => {
    const order_history = await getOrderHistory();
    res.status(200).send(order_history);
  },
  get_order_count: async (req: Request, res: Response) => {
    const percentages = await calculatePercentages();
    res.status(200).send(percentages);
  },

  update_order: async (req: Request, res: Response) => {
    const { id } = req.query;
    console.log(`Actualizando la orden #${id}`);
    const int_id = typeof id === "string" ? parseInt(id.toString(), 10) : 0
    
    // Verificamos que el id sea un numero valido
    if(typeof int_id !== 'undefined' && int_id !== null && int_id > 0) {
      const current_order_status = await getCurrentOrderStatus(int_id);
      const next_order_status = current_order_status[0].id_etapa + 1;

      const update_order = await updateOrder(int_id, next_order_status);
      
      if(update_order.success) {
        console.log("Actualizacion realizada con exito!");
        logIntoDB(`El pedido #${int_id} ha sido movido a etapa de producc??n no. ${next_order_status} y fue insertado en el registro ${update_order.insertId}`);
        
        if (next_order_status === 2) {
          logIntoDB(`El pedido #${int_id} fue aprovado para producci??n`);
          const prod_state = await globalProdState();
          
          if (prod_state[0].curr_order === 0) {
            updateGlobalProdState(1, int_id);
          }
        } else if (next_order_status === 6) {
          await productionLine();
        }
        io.emit("order_update");
        res.status(200).send({ success: " true", message: update_order.message});
      } else {
        res.status(400).send({ error: true, message: "Ha ocurrido un error al actualizar la produccion" });
      }
    } else {
      res.status(400).send({ error: true, message: "Incorrect id" });
    }
  },
  
  login: async (req: Request, res: Response) => {
    const { username, password } = req.query;

    if (typeof username === "string" && username.length > 0 && typeof password === "string" && password.length > 0 && typeof username !== "undefined" && password !== "undefined") {
      const db_password = await getUserEncryptedPassword(username);

      if (typeof db_password === "undefined" || db_password.length === 0) return res.status(200).send({ success: false, message: "Nombre de usuario o contrase??a no encontrados!" });
      
      const compare_hashes = await verifyHashedPasswords(password, db_password);

      if (compare_hashes) {
        console.log("User found on database. Logging in...");
        return res.status(200).send({ success: true, message: "Loggeando usuario!" });
      } else {
        console.log("User not found. Verify credentials");
        return res.status(200).send({ success: false, message: "Nombre de usuario o contrase??a no encontrados!" });
      }
    } else {
      console.log("Empty credentials.");
      res.status(200).send({ success: false, message: "Nombre de usuario o contrase??a no encontrados!" });
    }
  },

  create_order: async (req: Request, res: Response) => {
    const { metros } = req.query;

    if (metros) {
      const parsed_metros = typeof metros === "string" ? parseInt(metros.toString(), 10) : 0;
      const create_order = await createOrder(parsed_metros);

      // @ts-ignore
      if(create_order && !isNaN(create_order)) {
        // @ts-ignore
        const create_prod_order = await createProdOrder(create_order);
        const log = await logIntoDB(`El pedido #${create_order} de ${metros} metros ha sido creado y esta en espera de aprobaci??n para producci??n!`);
        if(log) {
          io.emit('order_update');
        }
        return res.status(200).send({ success: true, message: "Pedido creado exitosamente"});  
      } else {
        return res.status(200).send({ success: false, message: "Error en metros" });
      }
    } else {
      return res.status(200).send({ success: false, message: "Error en metros" });
    }
  }
};