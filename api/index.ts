import express, { ErrorRequestHandler } from 'express';

import ticketController from './controllers/ticketController';
const {
  getAllTickets,
  submitTicket,
  saveTeamResponseDraft,
  resolveTicketAndSendEmail,
} = ticketController;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// GET route: retrieve all tickets from db
app.get('/tickets', getAllTickets, (req, res) =>
  res.status(200).json(res.locals.tickets)
);

// POST route: submit ticket to support team
app.post('/tickets', submitTicket, (req, res) =>
  res
    .status(200)
    .send(
      "Thanks for submitting a help desk request! We'll get back to you as soon as we can."
    )
);

// PATCH route: save draft of team member response
app.patch('/savedraft/:ticketId', saveTeamResponseDraft, (req, res) =>
  res.status(200).send('Draft saved!')
);

// PATCH route: resolve ticket + respond to user with email
app.patch('/resolve/:ticketId', resolveTicketAndSendEmail, (req, res) =>
  res.status(200).send(res.locals.resolvedMessage)
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
