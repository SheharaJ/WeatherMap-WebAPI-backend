const express = require('express');
const sql = require('mssql');

const cors = require('cors');

const app = express();

app.use(cors());

const config = {
  user: 'sjadmin',
  password: 'sheharaadmin@123',
  server: 'sjserver.database.windows.net',
  database: 'SJDatabase',
  options: {
    encrypt: true
  }
};

const port = process.env.PORT || 3000;

sql.connect(config)
.then(pool => {
  console.log('Connected to Azure SQL DB');
})
.catch(err => {
  console.error('Database connection failed: ',err);
});

app.get('/weather', async (req, res) => {
  try {
    await sql.connect(config);

    const result = await sql.query`SELECT * FROM weather`;

    await sql.close();

    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/weather/:district', async (req, res) => {
  const district = req.params.district;
  try {
    await sql.connect(config);

    const result = await sql.query`SELECT * FROM weather WHERE district = ${district}`;

    await sql.close();

    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

// generate and insert random data into the database

// const districts = ['Ampara', 'Anuradhapura', 'Bhadulla', 'Batticoloa', 'Colombo', 'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara', 'Kandy'];

// const generateRandomData = () => {
//     const temperature = (Math.random() * (35 - 20) + 20).toFixed(2);
//     const humidity = (Math.random() * (100 - 60) + 60).toFixed(2);
//     const airPressure = (Math.random() * (1020 - 1000) + 1000).toFixed(2);
//     const dist = districts[Math.floor(Math.random() * districts.length)]; // Randomly select a province

//     const query = `UPDATE weather SET humidity=${humidity}, temp=${temperature}, air=${airPressure} WHERE district = ${dist}`;
//     connection.query(query, [temperature, humidity, airPressure, province], (err, result) => {
//         if (err) {
//             console.error('Error inserting data:', err);
//         } else {
//             console.log('Weather data inserted successfully');
//         }
//     });
// };

// // Generate data every 5 minutes
// setInterval(generateRandomData, 5 * 60 * 1000);

// generateRandomData();

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });