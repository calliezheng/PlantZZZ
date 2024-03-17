const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
}).promise();

// Query the database
async function getPlant() {
  try {
    const [rows] = await pool.query("SELECT * FROM plant");
    return rows;
  } catch (err) {
    console.error('Error querying the database:', err);
    throw err; // Rethrowing the error is optional and depends on how you want to handle errors.
  }
}

// Function to fetch plant data and log it
async function fetchAndLogPlantData() {
  try {
    const plant = await getPlant();
    console.log(plant);
  } catch (err) {
    console.error('Error fetching plant data:', err);
  }
}

// Call the function
fetchAndLogPlantData();
