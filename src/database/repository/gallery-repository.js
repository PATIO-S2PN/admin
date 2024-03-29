// GalleryRepository.js
const Gallery = require('../models/Gallery'); // Adjust the path as necessary

class GalleryRepository {
  async createGallery(galleryData) {
    const gallery = new Gallery(galleryData);
    return gallery.save();
  }

  async updateGalleryById(id, galleryData) {
    return Gallery.findByIdAndUpdate(id, galleryData, { new: true });
  }

  async deleteGalleryById(id) {
    return Gallery.findByIdAndDelete(id);
  }

  async findGalleryById(id) {
    return Gallery.findById(id);
  }

  async findAllGalleries() {
    return Gallery.find({});
  }
}

module.exports = GalleryRepository;
