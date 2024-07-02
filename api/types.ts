import { Request, Response, NextFunction } from 'express';

type TicketStatus = 'new' | 'in progress' | 'resolved';

export type Ticket = {
  name: string;
  email: string;
  description: string;
  status: TicketStatus;
  supportTeamResponse: string;
};

export type UserTicketSubmission = {
  name: string;
  email: string;
  description: string;
};

export type SupportTeamResponse = {
  ticketId: string;
  supportTeamResponse: string;
};

type ControllerMethod = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export type TicketController = {
  [methodName: string]: ControllerMethod;
};
