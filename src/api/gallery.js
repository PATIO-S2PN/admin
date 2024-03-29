// gallery-api.js
const GalleryService = require('../services/gallery-service'); // Adjust the path as necessary
const multer = require('multer');
const UserAuth = require("./middlewares/auth")


module.exports = (app, channel) => {
    const service = new GalleryService();
// Multer setup for photo uploads
const imageStorage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'images')
    },
    filename: function(req, file, cb){
        const date = new Date().toISOString().replace(/:/g, '-');
        cb(null, date + '_' + file.originalname);
    }
  })

const upload = multer({ storage: imageStorage });

// Add a gallery item
app.post('/gallery', upload.single('photo'), async (req, res) => {
  try {
    const { name, description } = req.body;
    const photo = req.file.path;
    const galleryItem = await service.addGallery({ name, description, photo });
    res.status(201).json(galleryItem);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Edit a gallery item
app.put('/gallery/:id', upload.single('photo'), async (req, res) => {
  try {
    const { name, description } = req.body;
    const photo = req.file ? req.file.path : undefined;
    const galleryItem = await service.editGallery(req.params.id, { name, description, photo });
    res.json(galleryItem);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete a gallery item
app.delete('/gallery/:id', async (req, res) => {
  try {
    await service.deleteGallery(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// View a single gallery item
app.get('/gallery/:id', async (req, res) => {
  try {
    const galleryItem = await service.viewGallery(req.params.id);
    res.json(galleryItem);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// List all gallery items
app.get('/gallery/', async (req, res) => {
  try {
    const galleryItems = await service.listGalleries();
    res.json(galleryItems);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

};