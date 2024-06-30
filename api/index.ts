import express, {
  Request,
  Response,
  ErrorRequestHandler,
  NextFunction,
} from 'express';

const app = express();
const PORT: number = 3000;

app.use(express.json());

app.get(
  '/',
  (req: Request, res: Response): Response => res.send('hello world')
);

app.use(
  (req: Request, res: Response): Response =>
    res.status(404).send('oops! nothing here.')
);

const globalErrorHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  res.status(500).send('something broke!');
};
app.use(globalErrorHandler);

app.listen(PORT, () => console.log(`server listening on port ${PORT}...`));

export default app;
