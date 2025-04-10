var express = require('express');
var router = express.Router();
const api_order= require("../controllers/api_order");

// Order Route
router.get('/All/Order', api_order.select_all_order);
router.post('/Insert/Order', api_order.insert_order);
router.put('/Update/Order', api_order.update_order);
router.delete('/Delete/Order', api_order.delete_order);

// Order_Detail Route
router.get('/All/Order_Detail', api_order.select_all_order_detail);
router.post('/Order_Detail/With/OrderID', api_order.select_order_detail_with_orderid);
router.post('/Insert/Order_Detail', api_order.insert_order_detail);

// order and order_detail Route by chat
router.get('Get/Orders', api_order.select_orders);
router.post('Insert/Orders', api_order.insert_orders);
router.put('Update/Orders', api_order.update_orders);
router.delete('Delete/Orders', api_order.delete_orders);

module.exports = router;