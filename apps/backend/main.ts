import express from 'express';
import cors from 'cors';
import process from 'process';
import uploadRouter from './routers/upload';
const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors());
app.use(uploadRouter);

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('heLlO fRom piXa 🤪!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
