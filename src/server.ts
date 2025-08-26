import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import itemsRouter from './routes/items.js';
import itemDetailRouter from './routes/itemDetail.js';
import latestPostsRouter from './routes/lastestPosts.js'

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/items', itemsRouter);

app.get('/', (req, res) => {
  res.send('Spirit Hub APIs is running 🚀');
});

app.use('/api/item-detail', itemDetailRouter);

app.use('/api/latest-posts', latestPostsRouter);


mongoose.connect(process.env.MONGODB_URI as string, { dbName: 'spirit-hub' })
  .then(() => {
    app.listen(process.env.PORT || 4000, () => {
      console.log(`✅ Server running on http://localhost:${process.env.PORT || 4000}`);
    });
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
