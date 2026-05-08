const Expert = require('../models/Expert');

exports.getExperts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, name } = req.query;
    const query = {};
    if (category) query.category = category;
    if (name) query.name = new RegExp(name, 'i');
    const experts = await Expert.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await Expert.countDocuments(query);
    res.json({
      experts,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getExpertById = async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id);
    if (!expert) return res.status(404).json({ error: 'Expert not found' });
    res.json(expert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};