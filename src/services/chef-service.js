// ChefService.js
const ChefRepository = require('../database/repository/chef-repository'); // Adjust the path to where your ChefRepository is defined

class ChefService {
  constructor() {
    this.repository = new ChefRepository();
  }

  async AddChef(chefData) {
    return this.repository.CreateChef(chefData);
  }

  async EditChef(id, chefData) {
    return this.repository.UpdateChefById(id, chefData);
  }

  async DeleteChef(id) {
    return this.repository.DeleteChefById(id);
  }

  async ViewChef(id) {
    return this.repository.FindChefById(id);
  }

  async ListChefs() {
    return this.repository.FindAllChefs();
  }
}

module.exports = ChefService;
