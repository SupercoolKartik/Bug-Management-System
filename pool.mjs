import mysql from "mysql2";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Suraj5667$$MYSQL",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true,
  database: "database01",
});

const executeQuery = async (connection, query) => {
  try {
    const [results] = await connection.query(query);
    return results;
  } catch (error) {
    throw error;
  }
};

//------------------------------Queries---------------------------------------
const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS database01`;
const useDatabaseQuery = `USE database01`;

const createCurrentUsersId = `CREATE TABLE IF NOT EXISTS usersId (
  id VARCHAR(20) NULL COLLATE utf8mb4_bin,
  flag VARCHAR(4) PRIMARY KEY COLLATE utf8mb4_bin
)`;
const insertFlagValue = `INSERT INTO usersId (flag)
SELECT 'true'
FROM dual
WHERE NOT EXISTS (SELECT 1 FROM usersId LIMIT 1)`;

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
    pId VARCHAR(225) PRIMARY KEY COLLATE utf8mb4_bin,
    pName VARCHAR(255) NOT NULL COLLATE utf8mb4_bin,
    uIdCb VARCHAR(255) NOT NULL COLLATE utf8mb4_bin,
    FOREIGN KEY (uIdCb) REFERENCES users(uId)
  )
`;
const createTicketsTableQuery = `
  CREATE TABLE IF NOT EXISTS tickets(
    tId VARCHAR(225) PRIMARY KEY COLLATE utf8mb4_bin,
    pId VARCHAR(225) COLLATE utf8mb4_bin,
    uIdCb VARCHAR(255) COLLATE utf8mb4_bin,
    uIdCf VARCHAR(255) COLLATE utf8mb4_bin,
    description VARCHAR(255) NULL,
    FOREIGN KEY (pId) REFERENCES projects(pId),
    FOREIGN KEY (uIdCb) REFERENCES users(uId),
    FOREIGN KEY (uIdCf) REFERENCES users(uId) 
  )
`;
const createUsersProjectsTableQuery = `
  CREATE TABLE IF NOT EXISTS users_projects(
    id VARCHAR(225) PRIMARY KEY COLLATE utf8mb4_bin,
    uId VARCHAR(255) NOT NULL COLLATE utf8mb4_bin,
    pId VARCHAR(225) NOT NULL COLLATE utf8mb4_bin,
    pName VARCHAR(255) NOT NULL COLLATE utf8mb4_bin,
    FOREIGN KEY (uId) REFERENCES users(uId),
    FOREIGN KEY (pId) REFERENCES projects(pId)
  )
`;

//-------------Table Drop Queries------------------------------
// const dropUsersTableQuery = `DROP TABLE IF EXISTS users`;
// const dropProjectsTableQuery = `DROP TABLE IF EXISTS projects`;
// const dropTicketsTableQuery = `DROP TABLE IF EXISTS tickets`;
// const dropUsersProjectsTableQuery = `DROP TABLE IF EXISTS users_projects`;
// const dropUsersIdTableQuery = `DROP TABLE IF EXISTS usersId`;
// const disableForeignKeysQuery = `SET FOREIGN_KEY_CHECKS = 0`;
// const enableForeignKeysQuery = `SET FOREIGN_KEY_CHECKS = 1`;
//------------------------------------------------------------
//--------------------------------------------------------------------------------

const main = async () => {
  try {
    const connection = await pool.promise().getConnection();

    // // Disable foreign key checks
    // await executeQuery(connection, disableForeignKeysQuery);

    // Create the database
    await executeQuery(connection, createDatabaseQuery);
    //console.log("Database created successfully");

    // Use the created database
    await executeQuery(connection, useDatabaseQuery);
    //console.log("Database selected successfully");

    //-----------Table Drop Commands--------------------------------
    // Drop users table
    // await executeQuery(connection, dropUsersTableQuery);
    // console.log("Users table deleted successfully");

    // Drop projects table
    // await executeQuery(connection, dropProjectsTableQuery);
    // console.log("Projects table deleted successfully");

    // // Drop tickets table
    // await executeQuery(connection, dropTicketsTableQuery);
    // console.log("Tickets table deleted successfully");

    //Drop users_projects table
    // await executeQuery(connection, dropUsersProjectsTableQuery);
    // console.log("Users Projects table deleted successfully");

    // //Drop usersId table
    // await executeQuery(connection, dropUsersIdTableQuery);
    // console.log("UsersId table deleted successfully");

    //---------------------------------------------------------------

    //await executeQuery(connection, dropUsersIdTableQuery);

    // // Create User's Id table and Insert the Flag value
    await executeQuery(connection, createCurrentUsersId);
    //console.log("User's Id table created successfully");
    await executeQuery(connection, insertFlagValue);
    // console.log("Flag insertd");

    // // Create the users table
    await executeQuery(connection, createUsersTableQuery);
    //console.log("Users table created successfully");

    // // Create the projects table
    await executeQuery(connection, createProjectsTableQuery);
    //console.log("Projects table created successfully");

    // // Create the tickets table
    await executeQuery(connection, createTicketsTableQuery);
    //console.log("Tickets table created successfully");

    // // Create the users-projects table
    await executeQuery(connection, createUsersProjectsTableQuery);
    //console.log("Users-Projects table created successfully");

    // // Enable foreign key checks
    // await executeQuery(connection, enableForeignKeysQuery);

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
