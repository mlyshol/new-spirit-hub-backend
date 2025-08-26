import { Router } from 'express';
import Item from '../models/item.js'; // ✅ Import the actual model

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { accent, q, page = 1, limit = 20 } = req.query;

    // Build filter object
    const filter: Record<string, any> = {
      published: true // ✅ Only return published items
    };

    // Accent filter (case-insensitive)
    if (accent && typeof accent === 'string' && accent !== 'all') {
      filter.accent = new RegExp(`^${accent}$`, 'i');
    }

    // Search filter (case-insensitive, matches title/description/type)
    if (q && typeof q === 'string') {
      const regex = new RegExp(q, 'i');
      filter.$or = [
        { title: regex },
        { description: regex },
        { type: regex }
      ];
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Item.find(filter)
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Item.countDocuments(filter)
    ]);

    res.json({
      items,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

export default router;