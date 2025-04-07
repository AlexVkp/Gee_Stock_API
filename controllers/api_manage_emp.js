const mysql = require('mysql');
require("dotenv").config();
const bcrypt = require("bcrypt");
const connection_final= require("../components/connection_final");

// exports.select_all_emp = (req, res, next) => {
//     try {
//         connection_final.query(
//             'SELECT * FROM employee',
//             [],
//             (err, results, fields) => {
//                 if (err) {
//                     console.log("Error select data from the database", err);
//                     return res.status(400).send();
//                 } else {
//                     let _allUser = results
//                     res.status(200).json({
//                         "result_code": "200",
//                         "result": "Success",
//                         "user_info": _allUser,
//                     });
//                 }
//             }
//         )
//     } catch (err) {
//         console.log(err);
//         return res.status(500).send();
//     }
// }

exports.select_all_emp = (req, res, next) => {
    try {
        let sql = `
            SELECT 
                e.emp_id, e.emp_name, e.emp_lname, e.gender, e.date_of_b, 
                e.tel, e.address, e.start_date, e.username, e.status, e.active
            FROM employee e
            
        `;

        connection_final.query(sql, [], (err, results, fields) => {
            if (err) {
                console.log("Error selecting data from the database", err);
                return res.status(400).send();
            } else {
                res.status(200).json({
                    "result_code": "200",
                    "result": "Success",
                    "user_info": results,
                });
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
};

exports.select_emp_with_id = (req, res, next) => {
    let _data = req.body;
    let _empID = _data.emp_id;

    if (typeof _empID != 'undefined') {
        try {
            connection_final.query(
                `
             SELECT 
                e.emp_id, e.emp_name, e.emp_lname, e.gender, e.date_of_b, 
                e.tel, e.address, e.start_date, e.username, e.status, e.active
            FROM employee e
            where emp_id = ?
        `,
                [_empID],
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


exports.search_employee = (req, res, next) => {
    const { keyword } = req.body;

    if (!keyword) {
        return res.status(400).json({ result: "Keyword is required" });
    }

    try {
        const searchQuery = `
            SELECT 
                e.emp_id, e.emp_name, e.emp_lname, e.gender, e.date_of_b, 
                e.tel, e.address, e.start_date, e.username, e.status, e.active
            FROM employee e
            WHERE 
                e.emp_id LIKE ? OR
                e.emp_name LIKE ? OR
                e.emp_lname LIKE ? OR
                e.gender LIKE ? OR
                e.date_of_b LIKE ? OR
                e.tel LIKE ? OR
                e.address LIKE ? OR
                e.start_date LIKE ? OR
                e.username LIKE ? OR
                e.status LIKE ? OR
                e.active LIKE ?
        `;

        const searchValue = `%${keyword}%`;

        // ใส่ searchValue ทั้งหมด 11 ครั้ง ให้ตรงกับจำนวน field
        const values = new Array(11).fill(searchValue);

        connection_final.query(
            searchQuery,
            values,
            (err, results) => {
                if (err) {
                    console.error("Database search error:", err);
                    return res.status(500).json({ result: "Database Error" });
                }

                res.status(200).json({
                    result_code: "200",
                    result: "Search completed",
                    user_info: results
                });
            }
        );
    } catch (error) {
        console.error("Search function error:", error);
        res.status(500).json({ result: "Internal Server Error" });
    }
};





exports.insert_employee = async (req, res, next) => {
    let { 
        emp_id, emp_name, emp_lname, gender, date_of_b, 
        tel, address, start_date, 
        username, password, status, active 
    } = req.body;

    // Validate required fields
    if (!emp_name || !emp_lname || !gender || !date_of_b || 
        !tel || !address || !start_date || 
        !username || !password || !status || active === undefined) {
        return res.status(400).json({ "result": "All fields are required" });
    }

    try {
        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        let sql = `INSERT INTO employee 
            (emp_id, emp_name, emp_lname, gender, date_of_b, 
            tel, address, start_date, 
             username, password, status, active) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        let values = [
            emp_id, emp_name, emp_lname, gender, date_of_b, 
            tel, address, start_date, 
            username, hashedPassword, status, active
        ];

        connection_final.query(sql, values, (err, results) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ "result": "Database Error" });
            }

            res.status(201).json({
                "result_code": "201",
                "result": "Employee Inserted Successfully",
                "employee_id": emp_id
            });
        });

    } catch (error) {
        console.error("Hashing Error:", error);
        res.status(500).json({ "result": "Error hashing password" });
    }
};



exports.update_employee = async (req, res, next) => {
    let { 
        emp_id, emp_name, emp_lname, gender, date_of_b, 
        tel, address, start_date, 
        username, password, status, active 
    } = req.body;

    // ตรวจสอบว่ามี emp_id ไหม
    if (!emp_id) {
        return res.status(400).json({ "result": "Employee ID is required" });
    }

    try {
        // สร้างอาร์เรย์สำหรับค่าที่จะอัปเดต
        let updateFields = [];
        let values = [];

        if (emp_name) { updateFields.push("emp_name = ?"); values.push(emp_name); }
        if (emp_lname) { updateFields.push("emp_lname = ?"); values.push(emp_lname); }
        if (gender) { updateFields.push("gender = ?"); values.push(gender); }
        if (date_of_b) { updateFields.push("date_of_b = ?"); values.push(date_of_b); }
        if (tel) { updateFields.push("tel = ?"); values.push(tel); }
        if (address) { updateFields.push("address = ?"); values.push(address); }
        if (start_date) { updateFields.push("start_date = ?"); values.push(start_date); }
        if (username) { updateFields.push("username = ?"); values.push(username); }
        if (status) { updateFields.push("status = ?"); values.push(status); }
        if (active !== undefined) { updateFields.push("active = ?"); values.push(active); }

        // ตรวจสอบว่ามีการอัปเดตรหัสผ่านไหม
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateFields.push("password = ?");
            values.push(hashedPassword);
        }

        // ถ้าไม่มีค่าที่ต้องอัปเดต ให้ส่ง error กลับ
        if (updateFields.length === 0) {
            return res.status(400).json({ "result": "No fields to update" });
        }

        // สร้าง SQL Update
        let sql = `UPDATE employee SET ${updateFields.join(", ")} WHERE emp_id = ?`;
        values.push(emp_id); // ใส่ emp_id เป็นเงื่อนไข

        // Execute SQL
        connection_final.query(sql, values, (err, results) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ "result": "Database Error" });
            }

            // เช็คว่ามีการอัปเดตข้อมูลจริงไหม
            if (results.affectedRows === 0) {
                return res.status(404).json({ "result": "Employee not found" });
            }

            res.status(200).json({
                "result_code": "200",
                "result": "Employee Updated Successfully",
                "employee_id": emp_id
            });
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ "result": "Internal Server Error" });
    }
};


exports.delete_employee = (req, res, next) => {
    let { emp_id } = req.body;  

    if (!emp_id) {
        return res.status(400).json({ "result": "Missing emp_id parameter" });
    }

    console.log("Received emp_id:", emp_id); 

    try {
        
        connection_final.query(
            'DELETE FROM employee WHERE emp_id = ?',
            [emp_id],
            (err, results) => {
                if (err) {
                    console.log("Error deleting employee", err);
                    return res.status(400).json({ "result": "Database Error" });
                }

                if (results.affectedRows === 0) {
                    return res.status(404).json({ "result": "Village Not Found" });
                }

                res.status(200).json({
                    "result_code": "200",
                    "result": "Delete Employee Success",
                    "affected_rows": results.affectedRows,
                });
            }
        );
    } catch (err) {
        console.log(err);
        return res.status(500).json({ "result": "Server Error" });
    }
};



exports.login_employee = async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ result: "Username and password are required" });
    }

    try {
        const sql = `SELECT * FROM employee WHERE username = ? LIMIT 1`;
        connection_final.query(sql, [username], async (err, results) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ result: "Database Error" });
            }

            if (results.length === 0) {
                console.log("User not found:", username);
                return res.status(401).json({ result: "Invalid username or password" });
            }

            const user = results[0];

            // ตรวจสอบว่า account นี้ถูกเปิดใช้งานหรือไม่
            if (user.active !== 1) {
                console.log("Account inactive:", username);
                return res.status(403).json({ result: "This account is inactive" });
            }

            // เปรียบเทียบรหัสผ่านที่กรอกกับรหัสผ่านที่เก็บไว้ในฐานข้อมูล
            console.log("Entered password:", password);
            console.log("Stored hashed password:", user.password);

            const isMatch = await bcrypt.compare(password, user.password);
            console.log('Password Match:', isMatch);

            if (!isMatch) {
                console.log("Password mismatch!");
                return res.status(401).json({ result: "Invalid username or password" });
            }

            // ถ้าทุกอย่างถูกต้อง ส่งข้อมูลกลับ
            res.status(200).json({
                result_code: "200",
                result: "Login successful",
                employee: {
                    emp_id: user.emp_id,
                    emp_name: user.emp_name,
                    emp_lname: user.emp_lname,
                    status: user.status,
                    active: user.active
                }
            });
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ result: "Server Error" });
    }
};



    


// const plaintext = '9999'; // สมมุติรหัสที่คุณกรอก
// const hashed = '$2b$10$VkckeSXOn6C6v/Snct'; // คัดลอกจากฐานข้อมูล

// bcrypt.compare(plaintext, hashed).then(console.log); // true หรือ false
