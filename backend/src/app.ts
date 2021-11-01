import express from 'express';
import initRoutes from './routes';
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());
initRoutes(app);

app.listen(port, () => {
  console.log(`Application is running on port ${port}.`);
});
