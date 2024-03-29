// database related modules
module.exports = {
    databaseConnection: require('./connection'),
    AdminRepository: require('./repository/admin-repository'),
    ChefRepository: require('./repository/chef-repository'),
}