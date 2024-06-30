import express, { ErrorRequestHandler } from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => res.send('hello world'));

app.use((req, res) => res.status(404).send('oops! nothing here.'));

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('something broke!');
};
app.use(globalErrorHandler);

app.listen(PORT, () => console.log(`server listening on port ${PORT}...`));

export default app;
