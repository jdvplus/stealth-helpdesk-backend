import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

const ticketController = {
  // retrieve all existing tickets from database
  getAllTickets: (req: Request, res: Response, next: NextFunction) => {
    fs.readFile(
      path.join(__dirname, '../db.json'),
      'utf-8',
      (err, data: string) => {
        if (err) next(err);

        res.locals.tickets = JSON.parse(data);

        next();
      }
    );
  },
};

export default ticketController;
