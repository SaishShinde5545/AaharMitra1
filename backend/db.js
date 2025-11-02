const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'sql12.freesqldatabase.com:3360', // or your DB host
  user: 'sql12805514', // your MySQL username 
  password: 'kdCtrEXSua', // your MySQL password
 database: 'sql12805514' // your database name
  });
  connection.connect((err) => {
     if (err) { console.error('❌ Database connection failed:', err.stack);
       return;
       }
      console.log('✅ Connected to MySQL database');
     }); 

  module.exports = connection;
