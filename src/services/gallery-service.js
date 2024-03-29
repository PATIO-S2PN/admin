// GalleryService.js
const GalleryRepository = require('../database/repository/gallery-repository'); // Adjust the path as necessary

class GalleryService {
  constructor() {
    this.repository = new GalleryRepository();
  }

  async addGallery(galleryData) {
    return this.repository.createGallery(galleryData);
  }

  async editGallery(id, galleryData) {
    return this.repository.updateGalleryById(id, galleryData);
  }

  async deleteGallery(id) {
    return this.repository.deleteGalleryById(id);
  }

  async viewGallery(id) {
    return this.repository.findGalleryById(id);
  }

  async listGalleries() {
    return this.repository.findAllGalleries();
  }
}

module.exports = GalleryService;
