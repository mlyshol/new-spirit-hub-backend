// routes/latestPosts.js
import { Router } from 'express';
import Item from '../models/item.js'; // ✅ Import the actual model

const router = Router();

router.get('/', async (req, res) => {
  try {
    // Define which accents to include
    const accents = ['watch', 'read', 'listen'];

    // Fetch the latest published item for each accent
    const latestPosts = await Promise.all(
      accents.map(async (accent) => {
        return Item.findOne({ accent, published: true })
          .sort({ date: -1, createdAt: -1 }) // newest first
          .lean();
      })
    );

    // Remove any nulls (in case an accent has no published items)
    const filtered = latestPosts.filter(Boolean);

    res.json({
      items: filtered,
      total: filtered.length
    });
  } catch (err) {
    console.error('Error fetching latest posts:', err);
    res.status(500).json({ error: 'Failed to fetch latest posts' });
  }
});

export default router;