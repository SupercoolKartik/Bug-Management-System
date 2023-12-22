import mysql from "mysql2";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Suraj5667$$MYSQL",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true,
});

//Queries
const databaseName = "database01";
const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS ${databaseName}`;
const useDatabaseQuery = `USE ${databaseName}`;
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users01 (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
  )
`;
// const insertDataQuery = `
//   INSERT INTO users (id, username, email) VALUES (8, "kartik123", "kartik123@gmail.com")
// `;
// const selectDataQuery = `SELECT * FROM users`;

//............
console.log("start 0.1");
const executeQuery = async (connection, query) => {
  try {
    const [results] = await connection.query(query);
    return results;
  } catch (error) {
    throw error;
  }
};
console.log("end 0.1");

const main = async () => {
  try {
    console.log("start 0.2");
    // Execute the query to create the database
    const createDbConnection = await pool.promise().getConnection();
    await executeQuery(createDbConnection, createDatabaseQuery);
    console.log("Database created successfully");
    createDbConnection.release();
    console.log("end 0.2");

    console.log("start 0.3");
    // Use the created database
    const useDbConnection = await pool.promise().getConnection();
    await executeQuery(useDbConnection, useDatabaseQuery);
    useDbConnection.release();
    console.log("end 0.3");

    console.log("start 0.4");
    // Execute the query to create the table
    const createTableConnection = await pool.promise().getConnection();
    await executeQuery(createTableConnection, createTableQuery);
    createTableConnection.release();
    console.log("end 0.4");

    // console.log("start 0.5");
    // //Insert values to the table
    // const insertDataConnection = await pool.promise().getConnection();
    // await executeQuery(insertDataConnection, insertDataQuery);
    // insertDataConnection.release();
    // console.log("stop 0.5");

    // console.log("start 0.6");
    // //Display values of the table
    // const selectDataConnection = await pool.promise().getConnection();
    // const selectResults = await executeQuery(
    //   selectDataConnection,
    //   selectDataQuery
    // );
    // console.log("The data from users:", selectResults);
    // selectDataConnection.release();
    // console.log("stop 0.6");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Close the connection pool
    console.log("pool was supposed to end here");
    //pool.end();
  }
};

main();
export default pool;
