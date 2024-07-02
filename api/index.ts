import express, { ErrorRequestHandler } from 'express';

import ticketController from './controllers/ticketController';
const {
  getAllTickets,
  submitTicket,
  saveTeamResponseDraft,
  resolveTicketAndSendEmail,
} = ticketController;

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => res.send('hello world'));

app.get('/tickets', getAllTickets, (req, res) =>
  res.status(200).json(res.locals.tickets)
);

app.post('/tickets', getAllTickets, submitTicket, (req, res) =>
  res
    .status(200)
    .send(
      "Thanks for submitting a help desk request! We'll get back to you as soon as we can."
    )
);

app.post('/savedraft', getAllTickets, saveTeamResponseDraft, (req, res) =>
  res.status(200).send('Draft saved!')
);

app.post('/resolve', getAllTickets, resolveTicketAndSendEmail, (req, res) =>
  res.status(200).send('Woohoo! Ticket resolved.')
);

/* catch-all route handler (404) */
app.use((req, res) => res.status(404).send('oops! nothing here.'));

const globalErrorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).send('something broke!');
};
app.use(globalErrorHandler);

app.listen(PORT, () => console.log(`server listening on port ${PORT}...`));

export default app;
