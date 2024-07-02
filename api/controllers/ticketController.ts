import fs from 'fs';
import path from 'path';

import {
  TicketController,
  Ticket,
  UserTicketSubmission,
  SupportTeamResponse,
} from '../types';

const db = path.join(__dirname, '../db.json');

const updateTicket = (
  reqBody: SupportTeamResponse,
  existingTickets: Ticket[],
  status: 'in progress' | 'resolved'
): Ticket[] => {
  const { ticketId, supportTeamResponse }: SupportTeamResponse = reqBody;

  const ticketToUpdate: Ticket = existingTickets.filter(
    (ticket: Ticket) => ticket.ticketId === ticketId
  )[0];
  ticketToUpdate.supportTeamResponse = supportTeamResponse;
  ticketToUpdate.status = status;

  const updatedTickets: Ticket[] = existingTickets.filter(
    (ticket: Ticket) => ticket.ticketId !== ticketId
  );
  updatedTickets.push(ticketToUpdate);

  return updatedTickets;
};

const ticketController: TicketController = {
  // retrieve all existing tickets from database
  getAllTickets: (req, res, next) => {
    fs.readFile(db, 'utf-8', (err, data: string) => {
      if (err) next(err);

      const parsedData: Ticket[] = JSON.parse(data);
      const sortedData: Ticket[] = parsedData.sort(
        (a, b) => a.ticketId - b.ticketId
      );
      res.locals.tickets = sortedData.length
        ? sortedData
        : 'No tickets submitted yet!';

      fs.writeFile(db, JSON.stringify(sortedData), 'utf-8', (err) => {
        if (err) next(err);
        next();
      });
    });
  },

  // add a new ticket to database
  submitTicket: (req, res, next) => {
    const { name, email, description }: UserTicketSubmission = req.body;

    const existingTickets: Ticket[] = res.locals.tickets;
    const { ticketId }: Ticket = existingTickets.sort(
      (a, b) => a.ticketId - b.ticketId
    )[existingTickets.length - 1];
    const newTicketId: number = ticketId + 1;
    const newTicket: Ticket = {
      ticketId: newTicketId,
      name,
      email,
      description,
      status: 'new',
      supportTeamResponse: '',
    };
    existingTickets.push(newTicket);

    fs.writeFile(db, JSON.stringify(existingTickets), 'utf-8', (err) => {
      if (err) next(err);
      next();
    });
  },

  // save draft of working response (auto sets status to 'in progress')
  saveTeamResponseDraft: (req, res, next) => {
    fs.writeFile(
      db,
      JSON.stringify(updateTicket(req.body, res.locals.tickets, 'in progress')),
      'utf-8',
      (err) => {
        if (err) next(err);
        next();
      }
    );
  },

  // resolve ticket (auto sets status to 'resolved' & "sends email" [see comment])
  resolveTicketAndSendEmail: (req, res, next) => {
    fs.writeFile(
      db,
      JSON.stringify(updateTicket(req.body, res.locals.tickets, 'resolved')),
      'utf-8',
      (err) => {
        if (err) next(err);
        next();
      }
    );

    /*
    NOTE: In a professional/production-level implementation of this application, this is where we'd implement functionality to send the corresponding user an email containing the support team's response to the ticket.
    
    (We could use https://github.com/sendgrid/sendgrid-nodejs, for example.)
    */

    const { ticketId, supportTeamResponse }: SupportTeamResponse = req.body;
    const existingTickets: Ticket[] = res.locals.tickets;

    const resolvedTicket: Ticket = existingTickets.filter(
      (ticket: Ticket) => ticket.ticketId === ticketId
    )[0];
    const { email }: Ticket = resolvedTicket;

    // as per the assignment instructions, here is a simple console.log implementation.
    console.log(`
      to: ${email}
      subject: '[Ticket #${ticketId}: RESOLVED] Thanks for getting in touch!'
      body: ${supportTeamResponse}
      `);
  },
};

export default ticketController;
