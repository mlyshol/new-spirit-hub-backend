import { Router } from 'express';
import Item from '../models/item.js';

const router = Router();

// GET /api/item-detail/:accent/:slug
router.get('/:accent/:slug', async (req, res) => {
  try {
    // Normalize to lowercase
    const accent = req.params.accent.toLowerCase();
    const slug = req.params.slug.toLowerCase();
    const href = `/${accent}/${slug}`;

    // ✅ Only fetch published items, matching lowercase href
    const item = await Item.findOne({
      href: { $regex: new RegExp(`^${href}$`, 'i') }, // case-insensitive match
      published: true
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const related = [];
    const excludeIds = [item._id];

    // 1️⃣ Same source
    if (item.source) {
      const sameSource = await Item.find({
        source: item.source,
        published: true,
        _id: { $nin: excludeIds }
      }).limit(3);
      related.push(...sameSource);
      excludeIds.push(...sameSource.map(i => i._id));
    }

    // 2️⃣ Same category
    if (related.length < 3 && item.category) {
      const sameCategory = await Item.find({
        category: item.category,
        published: true,
        _id: { $nin: excludeIds }
      }).limit(3 - related.length);
      related.push(...sameCategory);
      excludeIds.push(...sameCategory.map(i => i._id));
    }

    // 3️⃣ Same type
    if (related.length < 3 && item.type) {
      const sameType = await Item.find({
        type: item.type,
        published: true,
        _id: { $nin: excludeIds }
      }).limit(3 - related.length);
      related.push(...sameType);
      excludeIds.push(...sameType.map(i => i._id));
    }

    // 4️⃣ Same accent
    if (related.length < 3 && item.accent) {
      const sameAccent = await Item.find({
        accent: item.accent,
        published: true,
        _id: { $nin: excludeIds }
      }).limit(3 - related.length);
      related.push(...sameAccent);
    }

    res.json({ item, relatedItems: related });
  } catch (err) {
    console.error('Error fetching detail:', err);
    res.status(500).json({ error: 'Failed to fetch detail' });
  }
});

export default router;