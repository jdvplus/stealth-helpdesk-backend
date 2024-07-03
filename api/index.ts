import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
// ^ library for sanitizing user-submitted data
// (https://www.npmjs.com/package/express-mongo-sanitize)

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
app.use(cors());
app.use(mongoSanitize());

// GET route: retrieve all tickets from db
app.get('/tickets', getAllTickets, (_, res) =>
  res.status(200).json(res.locals.tickets)
);

// POST route: submit ticket to support team
app.post('/tickets', submitTicket, (_, res) =>
  res
    .status(200)
    .json(
      "Thanks for submitting a help desk request! We'll get back to you as soon as we can."
    )
);

// PATCH route: save draft of team member response for specific ticket
app.patch('/savedraft/:ticketId', saveTeamResponseDraft, (_, res) =>
  res.status(200).json('Draft saved!')
);

// PATCH route: resolve ticket + respond to user with email
app.patch('/resolve/:ticketId', resolveTicketAndSendEmail, (_, res) =>
  res.status(200).json(res.locals.resolvedMessage)
);

/* catch-all route handler (404) */
app.use((_, res) => res.status(404).send('oops! nothing here.'));

const globalErrorHandler: ErrorRequestHandler = (err, _, res, _next) => {
  console.error(err.stack);
  res.status(500).send('something broke!');
};
app.use(globalErrorHandler);

app.listen(PORT, () => console.log(`server listening on port ${PORT}...`));

export default app;
