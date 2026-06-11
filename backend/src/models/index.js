const User = require('./User')
const Task = require('./Task')
const Category = require('./Category')

// Relaciones
User.hasMany(Task, { foreignKey: 'userId', onDelete: 'CASCADE' })
Task.belongsTo(User, { foreignKey: 'userId' })

User.hasMany(Category, { foreignKey: 'userId', onDelete: 'CASCADE' })
Category.belongsTo(User, { foreignKey: 'userId' })

Category.hasMany(Task, { foreignKey: 'categoryId' })
Task.belongsTo(Category, { foreignKey: 'categoryId' })

module.exports = { User, Task, Category }