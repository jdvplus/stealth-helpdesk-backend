import { Request, Response, NextFunction } from 'express';

type TicketStatus = 'new' | 'in progress' | 'completed';

export type Ticket = {
  ticketId: number;
  name: string;
  email: string;
  description: string;
  status: TicketStatus;
  supportTeamResponse: string;
};

export type TicketController = {
  getAllTickets: (req: Request, res: Response, next: NextFunction) => void;
};
