import fs from 'fs';
import path from 'path';

import {
  TicketController,
  Ticket,
  UserTicketSubmission,
  SupportTeamResponseDraft,
} from '../types';

const db = path.join(__dirname, '../db.json');

const ticketController: TicketController = {
  // retrieve all existing tickets from database
  getAllTickets: (req, res, next) => {
    fs.readFile(db, 'utf-8', (err, data: string) => {
      if (err) next(err);

      const parsedData: Ticket[] = JSON.parse(data);
      res.locals.tickets = parsedData.length
        ? parsedData
        : 'No tickets submitted yet!';

      next();
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

  saveTeamResponseDraft: (req, res, next) => {
    const { ticketId, supportTeamResponse }: SupportTeamResponseDraft =
      req.body;

    const existingTickets: Ticket[] = res.locals.tickets;

    const ticketToUpdate: Ticket = existingTickets.filter(
      (ticket: Ticket) => ticket.ticketId === ticketId
    )[0];
    ticketToUpdate.supportTeamResponse = supportTeamResponse;
    ticketToUpdate.status = 'in progress';

    const updatedTickets: Ticket[] = existingTickets.filter(
      (ticket: Ticket) => ticket.ticketId !== ticketId
    );
    updatedTickets.push(ticketToUpdate);

    fs.writeFile(db, JSON.stringify(updatedTickets), 'utf-8', (err) => {
      if (err) next(err);
      next();
    });
  },
};

export default ticketController;
