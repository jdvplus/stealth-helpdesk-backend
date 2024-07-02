import fs from 'fs';
import path from 'path';

import connectToDatabase from '../connectToDatabase';
import { TicketModel } from '../models/TicketModel';
import {
  TicketController,
  Ticket,
  UserTicketSubmission,
  SupportTeamResponse,
} from '../types';

connectToDatabase();

const db = path.join(__dirname, '../db.json');

/**
 * Helper function to update the status of an existing ticket in the database.
 *
 * @param reqBody - incoming request body
 * @param existingTickets - the current state of tickets in the database
 * @param status - a string with which to update the ticket's status
 * @returns an updated array of tickets
 */
const updateTicketStatus = (
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
  getAllTickets: async (req, res, next) => {
    try {
      const tickets = await TicketModel.find();
      res.locals.tickets = tickets;
    } catch (err) {
      console.error(err);
      next(err);
    }
  },

  // add a new ticket to database
  submitTicket: (req, res, next) => {
    const { name, email, description }: UserTicketSubmission = req.body;
    const existingTickets: Ticket[] = res.locals.tickets;

    // obtain ticket id of most recent ticket in database
    // (to give new ticket last ticket ID + 1)
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

  // save draft of working response (auto sets ticket status to 'in progress')
  saveTeamResponseDraft: (req, res, next) => {
    fs.writeFile(
      db,
      JSON.stringify(
        updateTicketStatus(req.body, res.locals.tickets, 'in progress')
      ),
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
      JSON.stringify(
        updateTicketStatus(req.body, res.locals.tickets, 'resolved')
      ),
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
