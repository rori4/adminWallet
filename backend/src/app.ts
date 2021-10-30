import express from 'express';
import initRoutes from './routes';

const app = express();
const port = 8080;

initRoutes(app);

app.listen(port, () => {
  console.log(`Application is running on port ${port}.`);
});
