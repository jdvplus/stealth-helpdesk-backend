import express, { ErrorRequestHandler } from 'express';

import ticketController from './controllers/ticketController';
const { getAllTickets } = ticketController;

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => res.send('hello world'));

app.get('/tickets', getAllTickets, (req, res) =>
  res.status(200).json(res.locals.noTicketMessage || res.locals.tickets)
);

/* catch-all route handler (404) */
app.use((req, res) => res.status(404).send('oops! nothing here.'));

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('something broke!');
};
app.use(globalErrorHandler);

app.listen(PORT, () => console.log(`server listening on port ${PORT}...`));

export default app;
