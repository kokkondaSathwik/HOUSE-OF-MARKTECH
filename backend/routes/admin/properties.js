const express = require('express');
const router = express.Router();
const Property = require('../../models/Property');
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');

// Get all properties (admin only)
router.get('/', [auth, admin], async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new property (admin only)
router.post('/', [auth, admin], async (req, res) => {
  const property = new Property({
    name: req.body.name,
    image: req.body.image,
    price: req.body.price,
    location: req.body.location
  });

  try {
    const newProperty = await property.save();
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update property (admin only)
router.put('/:id', [auth, admin], async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    property.name = req.body.name || property.name;
    property.image = req.body.image || property.image;
    property.price = req.body.price || property.price;
    property.location = req.body.location || property.location;

    const updatedProperty = await property.save();
    res.json(updatedProperty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete property (admin only)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    await property.deleteOne();
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 