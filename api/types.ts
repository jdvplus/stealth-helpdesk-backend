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

type ControllerMethod = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export type TicketController = {
  [methodName: string]: ControllerMethod;
};

export type UserTicketSubmission = {
  name: string;
  email: string;
  description: string;
};

export type SupportTeamResponseDraft = {
  ticketId: number;
  supportTeamResponse: string;
};
