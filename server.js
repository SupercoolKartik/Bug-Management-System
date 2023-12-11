import express from "express";
//import ejs from "ejs";

import { fileURLToPath } from "url";
import { join, dirname } from "path";

const app = express();

import routes from "./routes/routes.js";
const router = express.Router();

const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use("/", routes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
