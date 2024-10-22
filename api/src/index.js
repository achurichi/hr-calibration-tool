import express from 'express';
import cors from 'cors';
import router from './routes.js';

const port = process.env.PORT || 3010;

const app = express();

app.use(express.json());
app.use(cors());
app.use('/', router);

app.get('/status', function (req, res) {
  res.send('HR Calibration Tool API is running');
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
