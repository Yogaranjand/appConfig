import express from 'express';
import { ConfigHelper } from './configHelper';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Application is up and running');
});

app.listen(port, () => {
  console.info(`Service is listening at http://localhost:${port}`);
});

app.get('/config/', async(req, res) => {
  const data = new ConfigHelper();
  const results = await data.getAppConfigInformation();
  return res.status(200).json(results);
})