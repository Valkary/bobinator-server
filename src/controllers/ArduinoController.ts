import { Response, Request } from 'express';
import { getOrderInProd } from '../functions/orders/getOrderInProd';
import { getGlobalProdState } from '../functions/prod/getGlobalProdState';

export const ArduinoController = {
  // GET REQUESTS
  order_in_prod : async (req: Request, res: Response) => {
    console.log("Retrieving current order in prod");
    const order_in_prod = await getOrderInProd();
    
    if (order_in_prod) {
      const order = order_in_prod[0];

      if (order) {        
              const { id, vueltas } = order;
        
              const return_object = { id, metros: vueltas };
        
              res.status(200).send(return_object);

      } else {
       res.status(200).send({ success: false }); 
      }
    } else {
      res.status(200).send({ success: false })
    }
  },

  global_prod_state: async (req: Request, res: Response) => {
    console.log("Retrieving current production state");
    const prod_state = await getGlobalProdState();

    const fixed_prod_state = prod_state[0]; 
    res.status(200).send(fixed_prod_state);
  },

  // POST REQUESTS
}