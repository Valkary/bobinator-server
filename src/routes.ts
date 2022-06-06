import { Router } from "express";
import { Controller } from "./controllers/Controller";
import { ArduinoController } from "./controllers/ArduinoController";

const router = Router();

// GET requests
router.get('/', Controller.home);
router.get('/users', Controller.users);
router.get('/todays_logs', Controller.todays_logs);
router.get('/prod_state', Controller.global_prod_state);
router.get('/etapas_prod', Controller.get_prod_stages);
router.get('/orders', Controller.get_orders);
router.get('/orders/in_prod', Controller.get_order_in_prod);
router.get('/orders/approved', Controller.get_approved_orders);
router.get('/orders/finished', Controller.get_finished_orders);
router.get('/orders/on-hold', Controller.get_on_hold_orders);
router.get('/orders/order_history', Controller.get_order_history);
router.get('/orders/order_count', Controller.get_order_count);

// ARDUINO GET REQUESTS
router.get('/arduino/in_prod', ArduinoController.order_in_prod);
router.get('/arduino/prod_state', ArduinoController.global_prod_state);

// POST requests
router.post('/production/update_order', Controller.update_order);
router.post('/users/login_user', Controller.login);
router.post('/production/create_order', Controller.create_order);

export default router;