// ChefRepository.js
const Chef = require('../models/Chef');

class ChefRepository {
  async CreateChef(chefData) {
    const chef = new Chef(chefData);
    return chef.save();
  }

  async UpdateChefById(id, chefData) {
    return Chef.findByIdAndUpdate(id, chefData, { new: true });
  }

  async DeleteChefById(id) {
    return Chef.findByIdAndDelete(id);
  }

  async FindChefById(id) {
    return Chef.findById(id);
  }

  async FindAllChefs() {
    return Chef.find({});
  }
}

module.exports = ChefRepository;
