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

const executeQuery = async (connection, query) => {
  try {
    const [results] = await connection.query(query);
    return results;
  } catch (error) {
    throw error;
  }
};

//----------------------------------Queries---------------------------------------
const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS database01`;
const useDatabaseQuery = `USE database01`;

const createUsersTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    uId VARCHAR(255) PRIMARY KEY COLLATE utf8mb4_bin,
    fName VARCHAR(255) NOT NULL,
    lName VARCHAR(255) NULL,
    uEmail VARCHAR(255) NOT NULL,
    uPhone VARCHAR(20) NOT NULL,
    uPassword VARCHAR(255) NOT NULL
  )`;
const createProjectsTableQuery = `
  CREATE TABLE IF NOT EXISTS projects(
    pId INT PRIMARY KEY COLLATE utf8mb4_bin,
    pName VARCHAR(255) NOT NULL,
    uIdCb VARCHAR(255) NOT NULL COLLATE utf8mb4_bin,
    FOREIGN KEY (uIdCb) REFERENCES users(uId)
  )
`;
const createTicketsTableQuery = `
  CREATE TABLE IF NOT EXISTS tickets(
    tId INT PRIMARY KEY COLLATE utf8mb4_bin,
    pId INT COLLATE utf8mb4_bin,
    uIdCb VARCHAR(255) COLLATE utf8mb4_bin,
    uIdCf VARCHAR(255) COLLATE utf8mb4_bin,
    tKey VARCHAR(255) NOT NULL,
    description VARCHAR(255) NULL,
    FOREIGN KEY (pId) REFERENCES projects(pId),
    FOREIGN KEY (uIdCb) REFERENCES users(uId),
    FOREIGN KEY (uIdCf) REFERENCES users(uId) 
  )
`;
const createUsersProjectsTableQuery = `
  CREATE TABLE IF NOT EXISTS users_projects(
    id INT PRIMARY KEY COLLATE utf8mb4_bin,
    uId VARCHAR(255) NOT NULL COLLATE utf8mb4_bin,
    pId INT NOT NULL COLLATE utf8mb4_bin,
    FOREIGN KEY (uId) REFERENCES users(uId),
    FOREIGN KEY (pId) REFERENCES projects(pId)
  )
`;
//--------------------------------------------------------------------------------

const main = async () => {
  try {
    const connection = await pool.promise().getConnection();

    // Disable foreign key checks
    await executeQuery(connection, disableForeignKeysQuery);

    // Create the database
    await executeQuery(connection, createDatabaseQuery);
    //console.log("Database created successfully");

    // Use the created database
    await executeQuery(connection, useDatabaseQuery);
    //console.log("Database selected successfully");

    // Create the users table
    await executeQuery(connection, createUsersTableQuery);
    //console.log("Users table created successfully");

    // Create the projects table
    await executeQuery(connection, createProjectsTableQuery);
    //console.log("Projects table created successfully");

    // Create the tickets table
    await executeQuery(connection, createTicketsTableQuery);
    //console.log("Tickets table created successfully");

    // Create the users-projects table
    await executeQuery(connection, createUsersProjectsTableQuery);
    //console.log("Users-Projects table created successfully");

    console.log("Database and Tables are created");
    connection.release();
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Close the connection pool
    //pool.end();
  }
};

main();
export default pool;
