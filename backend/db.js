const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost', // or your DB host
  user: 'root', // your MySQL username 
  password: 'sakshi', // your MySQL password
 database: 'aahaarmitra' // your database name
  });
  connection.connect((err) => {
     if (err) { console.error('❌ Database connection failed:', err.stack);
       return;
       }
      console.log('✅ Connected to MySQL database');
     }); 
  module.exports = connection;