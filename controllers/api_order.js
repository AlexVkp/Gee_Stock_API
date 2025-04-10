const mysql = require('mysql');
require("dotenv").config();
const connection_final= require("../components/connection_final");



//************************************************** Order ************************************************************
exports.select_all_order = (req, res, next) => {
    try {
        connection_final.query(
            'SELECT * FROM orders',
            [],
            (err, results, fields) => {
                if (err) {
                    console.log("Error select data from the database", err);
                    return res.status(400).send();
                } else {
                    let _allUser = results
                    res.status(200).json({
                        "result_code": "200",
                        "result": "Success",
                        "user_info": _allUser,
                    });
                }
            }
        )
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
}


exports.insert_order = (req, res, next) => {
    let { sup_id, emp_id, order_date } = req.body;
    if (!sup_id ||!emp_id ||!order_date ) {
        return res.status(400).json({ "result": "Missing required parameters" });
    }
        try {
            connection_final.query(
                'INSERT INTO orders (sup_id, emp_id, order_date) VALUES (?,?,?,?)',
                [order_id, sup_id, emp_id, order_date],
                (err, results, fields) => {
                    if (err) {
                        console.log("Error insert data to the database", err);
                        return res.status(400).send();
                    } else {
                        res.status(200).json({
                            "result_code": "200",
                            "result": "Success",
                            "order_id": results.insertId,
                        });
                    }
                }
            )
        } catch (err) {
            console.log(err);
            return res.status(500).send();
        }
}

exports.update_order = (req, res, next) => {
    let { order_id, sup_id, emp_id, order_date } = req.body;
    if (!order_id ||!sup_id ||!emp_id ||!order_date ) {
        return res.status(400).json({ "result": "Missing required parameters" });
    }
    try {
        connection_final.query(
            'UPDATE orders SET sup_id = ?, emp_id = ?, order_date = ? WHERE order_id = ?',
            [sup_id, emp_id, order_date, order_id],
            (err, results, fields) => {
                if (err) {
                    console.log("Error update data to the database", err);
                    return res.status(400).send();
                } else {
                    res.status(200).json({
                        "result_code": "200",
                        "result": "Update Success",
                    });
                }
            }
        )
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
}

exports.delete_order = (req, res, next) => {
    let { order_id } = req.body;
    if (!order_id) {
        return res.status(400).json({ "result": "Missing required parameters" });
    }
    try {
        connection_final.query(
            'DELETE FROM orders WHERE order_id = ?',
            [order_id],
            (err, results, fields) => {
                if (err) {
                    console.log("Error delete data from the database", err);
                    return res.status(400).send();
                } else {
                    res.status(200).json({
                        "result_code": "200",
                        "result": "Delete Success",
                    });
                }
            }
        )
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
}


//**************************************** Order Details ******************************************************************************


exports.select_all_order_detail = (req, res, next) => {
    try {
        connection_final.query(
            `SELECT od.order_d_id, p.ProductName, od.order_id, od.qty FROM order_detail od
            LEFT JOIN products p ON od.proid = p.proid`,
            [],
            (err, results, fields) => {
                if (err) {
                    console.log("Error select data from the database", err);
                    return res.status(400).send();
                } else {
                    let _allUser = results
                    res.status(200).json({
                        "result_code": "200",
                        "result": "Success",
                        "user_info": _allUser,
                    });
                }
            }
        )
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
}



exports.select_order_detail_with_orderid = (req, res, next) => {
    let _data = req.body;
    let _order_id = _data.order_id;
    if (typeof _order_id != 'undefined') {
        try {
            connection_final.query(
                `SELECT od.order_d_id, p.ProductName, od.order_id, od.qty FROM order_detail
                LEFT JOIN product p ON od.pro_id = p.pro_id where order_id =?`,
                [_order_id],
                (err, results, fields) => {
                    if (err) {
                        console.log("Error select data from the database", err);
                        return res.status(400).send();
                    } else {
                        let _userInfo = results
                        res.status(200).json({
                            "result_code": "200",
                            "result": "Success",
                            "user_info": _userInfo,
                        });
                    }
                }
            )
        } catch (err) {
            console.log(err);
            return res.status(500).send();
        }
    } else {
        res.status(404).json({ "result": "Incorrect Parameter" });
    }
}




exports.insert_order_detail = (req, res, next) => {
    let { order_d_id, pro_id, order_id, qty } = req.body;
    if (!order_id || !product_id || !quantity || !price ) {
        return res.status(400).json({ "result": "Missing required parameters" });
    }
    try {
        connection_final.query(
            'INSERT INTO order_detail (order_d_id, pro_id, order_id, qty) VALUES (?,?,?,?)',
            [order_d_id, pro_id, order_id, qty],
            (err, results, fields) => {
                if (err) {
                    console.log("Error insert data to the database", err);
                    return res.status(400).send();
                } else {
                    res.status(200).json({
                        "result_code": "200",
                        "result": "Success",
                        "order_id": results.insertId,
                    });
                }
            }
        )
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
}


// code chat

exports.select_orders = (req, res, next) => {
    try {
        let sql = `
            SELECT o.order_id, o.order_date, s.sup_name, e.emp_name,
                   od.proid, p.ProductName, od.qty
            FROM orders o
            JOIN suppliers s ON o.sup_id = s.sup_id
            JOIN employees e ON o.emp_id = e.emp_id
            JOIN order_detail od ON o.order_id = od.order_id
            JOIN products p ON od.proid = p.proid
        `;

        connection_final.query(sql, [], (err, results) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ "result": "Database Error" });
            }
            res.status(200).json({
                "result_code": "200",
                "result": "Success",
                "orders": results
            });
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ "result": "Internal Server Error" });
    }
};


exports.insert_orders = async (req, res) => {
    const { sup_id, emp_id, items } = req.body;
  
    if (!sup_id || !emp_id || !items || items.length === 0) {
      return res.status(400).json({ result: "Invalid data" });
    }
  
    const order_date = new Date().toISOString().split("T")[0];
  
    const conn = await connection.getConnection();
    try {
      await conn.beginTransaction();
  
      // Insert order
      const [orderResult] = await conn.execute(
        "INSERT INTO `orders` (sup_id, emp_id, order_date) VALUES (?, ?, ?)",
        [sup_id, emp_id, order_date]
      );
      const order_id = orderResult.insertId;
  
      // Insert order details
      const orderDetailsValues = items.map(item => [item.proid, order_id, item.qty]);
      await conn.query(
        "INSERT INTO order_detail (proid, order_id, qty) VALUES ?",
        [orderDetailsValues]
      );
  
      await conn.commit();
      res.status(200).json({ result: "Order saved successfully", order_id });
  
    } catch (err) {
      await conn.rollback();
      console.error(err);
      res.status(500).json({ result: "Order save failed", error: err });
    } finally {
      conn.release();
    }
  };
  
  



exports.update_orders = (req, res, next) => {
    let { order_id, sup_id, emp_id, order_date, products } = req.body;

    if (!order_id || !sup_id || !emp_id || !order_date || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ "result": "Missing required fields or products" });
    }

    try {
        // อัปเดตตาราง `orders`
        let updateOrderQuery = `UPDATE orders SET sup_id = ?, emp_id = ?, order_date = ? WHERE order_id = ?`;
        connection_final.query(updateOrderQuery, [sup_id, emp_id, order_date, order_id], (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ "result": "Database Error" });
            }

            // ลบ `order_detail` เก่า แล้วเพิ่มใหม่
            let deleteDetailQuery = `DELETE FROM order_detail WHERE order_id = ?`;
            connection_final.query(deleteDetailQuery, [order_id], (err, delResult) => {
                if (err) {
                    console.error("Database Error:", err);
                    return res.status(500).json({ "result": "Database Error" });
                }

                let insertDetailQuery = `INSERT INTO order_detail (pro_id, order_id, qty) VALUES ?`;
                let detailValues = products.map(p => [p.pro_id, order_id, p.qty]);

                connection_final.query(insertDetailQuery, [detailValues], (err, detailResult) => {
                    if (err) {
                        console.error("Database Error:", err);
                        return res.status(500).json({ "result": "Database Error" });
                    }

                    res.status(200).json({
                        "result_code": "200",
                        "result": "Order Updated Successfully"
                    });
                });
            });
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ "result": "Internal Server Error" });
    }
};



exports.delete_orders = (req, res, next) => {
    let { order_id } = req.body;

    if (!order_id) {
        return res.status(400).json({ "result": "Missing order_id" });
    }

    try {
        // ลบจาก `order_detail`
        let deleteDetailQuery = `DELETE FROM order_detail WHERE order_id = ?`;
        connection_final.query(deleteDetailQuery, [order_id], (err, detailResult) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ "result": "Database Error" });
            }

            // ลบจาก `orders`
            let deleteOrderQuery = `DELETE FROM orders WHERE order_id = ?`;
            connection_final.query(deleteOrderQuery, [order_id], (err, orderResult) => {
                if (err) {
                    console.error("Database Error:", err);
                    return res.status(500).json({ "result": "Database Error" });
                }

                res.status(200).json({
                    "result_code": "200",
                    "result": "Order Deleted Successfully"
                });
            });
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ "result": "Internal Server Error" });
    }
};
