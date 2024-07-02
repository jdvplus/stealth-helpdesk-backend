import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ticketSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'new' },
  supportTeamResponse: { type: String, default: '' },
});

export const TicketModel = mongoose.model('ticket', ticketSchema);
