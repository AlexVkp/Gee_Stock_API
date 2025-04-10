const mysql = require('mysql');
require("dotenv").config();
const connection_final = require("../components/connection_final");

exports.insert_sales = (req, res, next) => {
    const { cus_id, emp_id, subtotal, pay, money_change, products } = req.body;

    // ตรวจสอบให้แน่ใจว่ามีข้อมูลที่จำเป็นครบถ้วน
    if (!cus_id || !emp_id || !subtotal || !pay || !money_change || !products) {
        return res.status(400).json({ "result": "Missing required parameters" });
    }

    // เริ่มต้นการทำงานใน try-catch
    try {
        // 1. Insert into sales
        connection_final.query(
            `INSERT INTO sale (cus_id, emp_id, date_sale, subtotal, pay, money_change)
            VALUES (?, ?, NOW(), ?, ?, ?)`,
            [cus_id, emp_id, subtotal, pay, money_change],
            (err, result) => {
                if (err) {
                    console.log("Error inserting into sales:", err);
                    return res.status(400).send();
                }

                const saleId = result.insertId;

                // 2. Insert each product into sale_detail
                const detailSql = `INSERT INTO sale_detail (sale_id, proid, qty, price, total) VALUES ?`;
                const detailValues = products.map(p => [saleId, p.proid, p.qty, p.price, p.total]);

                connection_final.query(detailSql, [detailValues], (err) => {
                    if (err) {
                        console.log("Error inserting sale details:", err);
                        return res.status(400).send();
                    }

                    // 3. Update stock
                    const updateTasks = products.map(p => {
                        return new Promise((resolve, reject) => {
                            const updateSql = `UPDATE products SET qty = qty - ? WHERE proid = ?`;
                            connection_final.query(updateSql, [p.qty, p.proid], (err) => {
                                if (err) reject(err);
                                else resolve();
                            });
                        });
                    });

                    // รอให้การอัปเดตสินค้าเสร็จ
                    Promise.all(updateTasks)
                        .then(() => {
                            res.status(200).json({
                                "result_code": "200",
                                "result": "Insert sale success",
                                "sale_id": saleId
                            });
                        })
                        .catch((err) => {
                            console.log("Error updating product stock:", err);
                            res.status(500).send();
                        });
                });
            }
        );
    } catch (err) {
        console.log("Error:", err);
        res.status(500).send();
    }
};
