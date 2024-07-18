import connectToDatabase from '../connectToDatabase';
import { TicketModel } from '../models/TicketModel';
import { TicketController, Ticket, UserTicketSubmission } from '../types';

connectToDatabase(); // initialize database connection

const ticketController: TicketController = {
  // retrieve all existing tickets from database
  getAllTickets: async (_, res, next) => {
    try {
      const tickets = await TicketModel.find();
      res.locals.tickets = tickets;

      next();
    } catch (err) {
      console.error(err);
      next(err);
    }
  },

  // retrieve specific ticket from database
  findOneTicket: async (req, res, next) => {
    const { ticketId } = req.params;

    try {
      const ticket = await TicketModel.findById(ticketId);
      res.locals.ticket = ticket;

      next();
    } catch (err) {
      console.error(err);
      next(err);
    }
  },

  // add a new ticket to database
  submitTicket: async (req, _, next) => {
    const { name, email, description }: UserTicketSubmission = req.body;

    try {
      await TicketModel.create({ name, email, description });

      next();
    } catch (err) {
      console.error(err);
      next(err);
    }
  },

  // save draft of working response (sets ticket status to 'in progress')
  saveTeamResponseDraft: async (req, _, next) => {
    const { ticketId } = req.params;
    const { supportTeamResponse } = req.body;

    try {
      await TicketModel.findByIdAndUpdate(ticketId, {
        status: 'in progress',
        supportTeamResponse,
      });

      next();
    } catch (err) {
      console.error(err);
      next(err);
    }
  },

  // resolve ticket (sets ticket status to 'resolved' & "sends email")
  resolveTicketAndSendEmail: async (req, res, next) => {
    const { ticketId } = req.params;

    try {
      const { name, email, supportTeamResponse } =
        (await TicketModel.findByIdAndUpdate(
          ticketId,
          {
            status: 'resolved',
            supportTeamResponse: req.body.supportTeamResponse,
          },
          { new: true }
        )) as Ticket;

      /*
      NOTE: In a professional/production-level implementation of this application, this is where we'd implement functionality to send the corresponding user an email containing the support team's response to the ticket.

      (We could use https://github.com/sendgrid/sendgrid-nodejs, for example.)

      As per the assignment instructions, below is a simpler implementation for convenience within this assessment.
      */

      res.locals.resolvedMessage = `
        from: support@stealthstartup.com
        to: ${name} | ${email}

        message:
        "Thanks so much for reaching out! ${supportTeamResponse}"
      `;
      console.log('fake response email to user:', res.locals.resolvedMessage);

      next();
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
};

export default ticketController;
