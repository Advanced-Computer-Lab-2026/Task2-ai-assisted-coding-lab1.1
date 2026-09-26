import express from 'express';
import feedbackRoutes from './routes/feedback.js';

const app = express();

app.use(express.json());

app.use('/api/feedback', feedbackRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: 'Not found' });
});

export default app;
