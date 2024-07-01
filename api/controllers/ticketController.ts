import fs from 'fs';
import path from 'path';

import { Ticket, TicketController } from '../types';

const ticketController: TicketController = {
  // retrieve all existing tickets from database
  getAllTickets: (req, res, next) => {
    fs.readFile(
      path.join(__dirname, '../db.json'),
      'utf-8',
      (err, data: string) => {
        if (err) next(err);

        // handle if no tickets in database
        const parsedData: Ticket[] = JSON.parse(data);
        if (!parsedData.length)
          res.locals.noTicketMessage = 'No active tickets to respond to!';

        res.locals.tickets = parsedData;

        next();
      }
    );
  },
};

export default ticketController;
