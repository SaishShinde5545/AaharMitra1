

const express = require("express");
const cors = require("cors");
//app.use(cors());


const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(cors());
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // frontend files

// MySQL connection
const db = mysql.createConnection({
  host: "sql12.freesqldatabase.com:3360",
  user: "sql12805514",       // change if different
  password: "kdCtrEXSua",       // add your MySQL password
  database: "sql12805514"
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL database");
});

app.get("/", (req, res) => {
  res.send("Backend server is running 🚀");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ----------------- REGISTER ROUTE -----------------
app.post("/register", (req, res) => {
  const { name, username, mobile, password, role } = req.body;

  const sql = "INSERT INTO registration (name, username, mobile, password, role) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [name, username, mobile, password, role], (err, result) => {
    if (err) {
      console.error("DB Error: ", err);  // <--- shows actual MySQL error
      return res.status(500).json({ error: "Database error", details: err.message });
    }
    res.status(201).json({ message: "User registered successfully!" });
  });
});

// ----------------- LOGIN ROUTE -----------------
// app.post('/login', (req, res) => {
//   const { username, password } = req.body;

//   db.query('SELECT * FROM registration WHERE username = ? AND password = ?', 
//   [username, password], (err, results) => {
//     if (err) return res.status(500).json({ success: false, message: "DB error" });

//     if (results.length > 0) {
//       const user = results[0];
//       res.json({
//         success: true,
//         message: "Login successful",
//         role: user.role,   // assuming you have a 'role' column in DB
//         username: user.username
//       });
//     } else {
//       res.status(401).json({ success: false, message: "Invalid credentials" });
//     }
//   });
// });


//New Login Route 
// ✅ LOGIN ROUTE
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    const query = "SELECT * FROM registration WHERE username = ? AND password = ?";
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error("❌ DB Error:", err);
            return res.status(500).json({ message: "Server error" });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // ✅ User found
        const user = results[0];

        // Assign role (owner or student)
        let role = "student";
        if (user.username === "dilip") {
            role = "owner";
        }

        // Generate dummy token (replace with JWT if you want later)
        const token = `token-${Date.now()}`;

        res.json({
            token,
            role,
           username: user.username,   // ✅ add username
            name: user.name            // ✅ add name if you want to show in expense
        });
    });
});


//------Feedback Route----------//
//POST /feedback  insert feedback
app.post("/feedback", (req, res) => {
    const { name, mobile, feedback } = req.body;

    if (!name || !mobile || !feedback) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const sql = "INSERT INTO feedback (name, mobile, feedback) VALUES (?, ?, ?)";
    db.query(sql, [name, mobile, feedback], (err, result) => {
        if (err) {
            console.error("DB Error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.status(200).json({ message: "Feedback saved successfully" });
    });
});


//-----New Feedback Route-------//

// GET /viewFeedback - fetch all feedback
app.get("/viewFeedback", (req, res) => {
    const sql = "SELECT name, mobile, feedback, created_at FROM feedback ORDER BY created_at DESC";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("DB Error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json(result);
    });
});


// ================= AbsenteeMark Route =================
// Absentee Mark Route
// Absentee Mark Route
app.post("/absenteeMark", (req, res) => {
  const { username, date, slots } = req.body; // now expecting slots as an array

  if (!slots || slots.length === 0) {
    return res.status(400).json({ success: false, message: "⚠️ Please select at least one slot" });
  }

  // Prepare SQL query
  const sql = "INSERT INTO absentee (username, date, slot) VALUES ?";
  
  // Create values array for bulk insert
  const values = slots.map((slot) => [username, date, slot.toLowerCase()]);

  db.query(sql, [values], (err, result) => {
    if (err) {
      console.error("❌ Error inserting absentee:", err);
      return res.status(500).json({ success: false, message: "Failed to mark absentee" });
    }
    res.json({ success: true, message: `✅ Absentee marked for ${slots.join(", ")}.` });
  });
});


//-----------View Feedback Route---------//
app.get("/viewFeedback", (req, res) => {
  const sql = "SELECT name, email, feedback, created_at FROM feedback ORDER BY created_at DESC";
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching feedback:", err);
      return res.status(500).json({ success: false, message: "Failed to fetch feedback" });
    }
    res.json({ success: true, data: results });
  });
});

//----Add Menu Route-----//
app.post("/menu", (req, res) => {
  const { date, day, lunch, dinner } = req.body;

  if (!date || !day || !lunch || !dinner) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  const sql = "INSERT INTO menu (date, day, lunch, dinner) VALUES (?, ?, ?, ?)";
  db.query(sql, [date, day, lunch, dinner], (err, result) => {
    if (err) {
      console.error("Error inserting menu:", err);
      return res.status(500).json({ success: false, message: "Failed to add menu" });
    }
    res.json({ success: true, message: "Menu added successfully" });
  });
});

//----view menu route----//
// GET route to fetch menu items
app.get("/menu", (req, res) => {
    const sql = "SELECT * FROM menu ORDER BY date DESC";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching menu:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

//------View Expesnse Route--------//
// View Monthly Expense Route
app.get("/viewExpense/:username/:month", (req, res) => {
    const { username, month } = req.params;

    const monthInt = parseInt(month, 10);
    const year = new Date().getFullYear();
    const daysInMonth = new Date(year, monthInt, 0).getDate();

    const totalCost = daysInMonth * 90; // 90 per day (2 slots)

    // 👇 FIXED: joined with "registration" table
    const query = `
        SELECT r.name, a.date, a.slot
        FROM absentee a
        JOIN registration r ON a.username = r.username
        WHERE a.username = ? AND MONTH(a.date) = ? AND YEAR(a.date) = ?
    `;

    db.query(query, [username, monthInt, year], (err, results) => {
        if (err) {
            console.error("Error fetching absentee data:", err);
            return res.status(500).json({ error: "Database error" });
        }

        console.log("Absentee query results:", results);

        let deduction = 0;
        results.forEach(absent => {
            if (absent.slot.toLowerCase() === "morning" || absent.slot.toLowerCase() === "evening") {
                deduction += 45;
            }
        });

        const finalExpense = totalCost - deduction;

        res.json({
            username,
            name: results.length > 0 ? results[0].name : null,
            month: monthInt,
            year,
            totalDays: daysInMonth,
            totalCost,
            deduction,
            finalExpense,
            absentees: results
        });
    });
});


//--------Student List Route----------//
// Ensure you have: app.use(express.json());

// app.post("/studentlist", (req, res) => {
//     const { month, year } = req.body;

//     if (!month || !year) return res.json([]);

//     // Step 1: Fetch students + absent slots for the selected month
//     const query = `
//         SELECT s.name, s.username, s.mobile,
//                COUNT(a.slot) AS absent_slots,
//                IFNULL(sl.paid_amount, 0) AS paid_amount
//         FROM registration s
//         LEFT JOIN absentee a
//           ON s.username = a.username
//           AND MONTH(a.date) = ?
//           AND YEAR(a.date) = ?
//         LEFT JOIN studentlist sl
//           ON s.username = sl.username AND sl.month = ? AND sl.year = ?
//         GROUP BY s.username
//     `;
//     db.query(query, [month, year, month, year], (err, results) => {
//         if (err) {
//             console.error("DB error:", err);
//             return res.status(500).json({ error: "Database query failed" });
//         }

//         // Backend returns only basic info + absent_slots + paid_amount
//         // Frontend calculates total_expense & remaining_amount
//         res.json(results || []);
//     });
// });
app.post("/studentlist", (req, res) => {
    const { month, year } = req.body;
    if (!month || !year) return res.json([]);

    // 1️⃣ Fetch all students and their absent slots
    const query = `
        SELECT s.username, s.name, s.mobile,
               COUNT(a.slot) AS absent_slots,
               IFNULL(sl.paid_amount, 0) AS paid_amount
        FROM registration s
        LEFT JOIN absentee a
          ON s.username = a.username
          AND MONTH(a.date) = ?
          AND YEAR(a.date) = ?
        LEFT JOIN studentlist sl
          ON s.username = sl.username AND sl.month = ? AND sl.year = ?
        GROUP BY s.username
    `;

    db.query(query, [month, year, month, year], (err, results) => {
        if (err) {
            console.error("DB error:", err);
            return res.status(500).json([]);
        }

        // 2️⃣ Insert/update all students into studentlist table
        const sqlInsert = `
            INSERT INTO studentlist
              (username, name, mobile, absent_slots, paid_amount, remaining_amount, month, year)
            VALUES ?
            ON DUPLICATE KEY UPDATE
              absent_slots = VALUES(absent_slots),
              paid_amount = VALUES(paid_amount),
              remaining_amount = VALUES(remaining_amount)
        `;

        const values = results.map(s => {
            const totalDays = new Date(year, month, 0).getDate();
            const deduction = (s.absent_slots || 0) * 45;
            const totalExpense = (totalDays * 90) - deduction;
            return [
                s.username,
                s.name,
                s.mobile,
                s.absent_slots || 0,
                s.paid_amount || 0,
                totalExpense - (s.paid_amount || 0),
                month,
                year
            ];
        });

        db.query(sqlInsert, [values], (err2) => {
            if (err2) {
                console.error("DB insert error:", err2);
            }
            // 3️⃣ Send the results to frontend
            res.json(results || []);
        });
    });
});



//-------Save Payments Route----//
// app.post("/saveStudentPayments", (req, res) => {
//     const { studentList } = req.body;
//     if (!Array.isArray(studentList)) return res.status(400).json({ error: "Invalid data" });

//     let completed = 0;
//     if (studentList.length === 0) return res.json({ success: true });

//     studentList.forEach(student => {
//         const sql = `
//             INSERT INTO studentlist
//               (username, name, mobile, absent_slots, paid_amount, remaining_amount, month, year)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//             ON DUPLICATE KEY UPDATE
//               paid_amount = VALUES(paid_amount),
//               remaining_amount = VALUES(remaining_amount),
//               absent_slots = VALUES(absent_slots)
//         `;

//         db.query(sql, [
//             student.username,
//             student.name,
//             student.mobile,
//             student.absent_slots,
//             student.paid_amount,
//             student.remaining_amount,
//             student.month,
//             student.year
//         ], (err) => {
//             if (err) console.error(err);
//             completed++;
//             if (completed === studentList.length) res.json({ success: true });
//         });
//     });
// });
app.post("/saveStudentPayments", (req, res) => {
    const { studentList } = req.body;

    if (!Array.isArray(studentList) || studentList.length === 0) {
        return res.status(400).json({ error: "Invalid or empty data" });
    }

    // Prepare values for bulk insert/update
    const values = studentList.map(s => [
        s.username,
        s.name,
        s.mobile,
        s.absent_slots || 0,
        s.paid_amount || 0,
        s.remaining_amount || 0,
        s.month,
        s.year
    ]);

    const sql = `
        INSERT INTO studentlist
            (username, name, mobile, absent_slots, paid_amount, remaining_amount, month, year)
        VALUES ?
        ON DUPLICATE KEY UPDATE
            paid_amount = VALUES(paid_amount),
            remaining_amount = VALUES(remaining_amount),
            absent_slots = VALUES(absent_slots)
    `;

    db.query(sql, [values], (err, result) => {
        if (err) {
            console.error("DB save error:", err);
            return res.status(500).json({ error: "Database save failed" });
        }
        res.json({ success: true, affectedRows: result.affectedRows });
    });
});



// ----------------- START SERVER -----------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

