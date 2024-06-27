import express from "express";
import * as dotenv from "dotenv";
import { landingRouter } from "./routes/landingPage.route";
dotenv.config();
const app = express();
const port = process.env.port || 8000;

app.use(express.json());

app.use("/", landingRouter);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
