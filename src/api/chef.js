// Inside your express-app.js or a dedicated route file for chefs
const ChefService = require('../services/chef-service');
const UserAuth = require("./middlewares/auth")
const multer = require('multer');

module.exports = (app, channel) => {
    const service = new ChefService();

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

// Add a chef
app.post("/chef",UserAuth, upload.single('photo'), async (req, res, next) => {
    console.log("gii");
  try {
    const chefData = { ...req.body, photo: req.file ? req.file.path : undefined };
    const chef = await service.AddChef(chefData);
    res.status(201).json(chef);
  } catch (error) {
    next(error);
  }
});

// Edit a chef
app.put("/chef/:id", UserAuth, upload.single('photo'), async (req, res, next) => {
  try {
    const chefData = { ...req.body, photo: req.file ? req.file.path : undefined };
    const chef = await service.EditChef(req.params.id, chefData);
    res.json(chef);
  } catch (error) {
    next(error);
  }
});

// Delete a chef
app.delete("/chef/:id", UserAuth, async (req, res, next) => {
  try {
    await service.DeleteChef(req.params.id);
    res.json({ message: 'Chef deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// View a chef
app.get("/chef/:id", async (req, res, next) => {
  try {
    const chef = await service.ViewChef(req.params.id);
    res.json(chef);
  } catch (error) {
    next(error);
  }
});

// List all chefs
app.get("/chefs", async (req, res, next) => {
  try {
    const chefs = await service.ListChefs();
    res.json(chefs);
  } catch (error) {
    next(error);
  }
});

};