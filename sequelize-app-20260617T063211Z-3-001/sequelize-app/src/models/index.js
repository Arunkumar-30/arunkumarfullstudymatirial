const sequelize = require("../config/database");

const User = require("./user.model")(sequelize);
const Contact = require("./contact.model")(sequelize);
const Category = require("./category.model")(sequelize);
const Address = require("./address.model")(sequelize);

// 🔗 Associations
User.hasMany(Contact, { foreignKey: "userId" });
Contact.belongsTo(User, { foreignKey: "userId" });

Category.hasMany(Contact, { foreignKey: "categoryId" });
Contact.belongsTo(Category, { foreignKey: "categoryId" });

Contact.hasOne(Address, { foreignKey: "contactId" });
Address.belongsTo(Contact, { foreignKey: "contactId" });

module.exports = {
  sequelize,
  User,
  Contact,
  Category,
  Address,
};