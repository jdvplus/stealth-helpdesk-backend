import fs from 'fs';
import path from 'path';

import { Ticket, TicketController } from '../types';

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
    const { name, email, description } = req.body;

    fs.readFile(db, 'utf-8', (err, data: string) => {
      if (err) next(err);

      const parsedData: Ticket[] = JSON.parse(data);
      const { ticketId }: Ticket = parsedData[parsedData.length - 1];
      const newTicketId: number = ticketId + 1;
      const newTicket: Ticket = {
        ticketId: newTicketId,
        name,
        email,
        description,
        status: 'new',
        supportTeamResponse: '',
      };
      parsedData.push(newTicket);

      fs.writeFile(
        path.join(__dirname, '../db.json'),
        JSON.stringify(parsedData),
        'utf-8',
        (err) => {
          if (err) next(err);
          next();
        }
      );
    });
  },
};

export default ticketController;
