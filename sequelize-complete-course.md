# Sequelize Complete Course

A full reference — setup, models, CRUD, associations, querying, migrations, transactions, hooks, and validations, all with examples. (Sequelize v6/v7 syntax, works with MySQL, PostgreSQL, SQLite, MSSQL.)

---

## 1. Setup & Connection

```bash
npm install sequelize
npm install mysql2        # driver for MySQL (swap for pg / sqlite3 / tedious as needed)
npm install -D sequelize-cli
```

### 1.1 Basic Connection

```javascript
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "mysql",           // 'mysql' | 'postgres' | 'sqlite' | 'mssql'
  logging: false,               // disable SQL logging in console (default: true)
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Or via connection URI
const sequelize2 = new Sequelize("mysql://user:pass@localhost:3306/dbname");

// SQLite (file-based, no server needed)
const sequelize3 = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite"
});

// Test the connection
async function connect() {
  try {
    await sequelize.authenticate();
    console.log("Connection established successfully.");
  } catch (error) {
    console.error("Unable to connect:", error);
  }
}
connect();
```

### 1.2 Sync (dev only — creates tables from models)

```javascript
await sequelize.sync();                      // create tables if they don't exist
await sequelize.sync({ force: true });         // DROP and recreate tables (destructive!)
await sequelize.sync({ alter: true });          // adjust tables to match models
// In production, use migrations instead of sync()
```

---

## 2. Defining Models

### 2.1 Using `sequelize.define()`

```javascript
const { DataTypes } = require("sequelize");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  age: {
    type: DataTypes.INTEGER,
    validate: { min: 0, max: 120 }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: "users",       // explicit table name (default: pluralized model name)
  timestamps: true,          // adds createdAt / updatedAt (default: true)
  underscored: true,          // use snake_case column names (created_at instead of createdAt)
  paranoid: true                // adds deletedAt for soft deletes (with destroy())
});
```

### 2.2 Using Class-based Models (modern style, extends `Model`)

```javascript
const { Model, DataTypes } = require("sequelize");

class Product extends Model {
  // custom instance method
  getDisplayPrice() {
    return `$${this.price.toFixed(2)}`;
  }

  // custom static method
  static async findExpensive() {
    return this.findAll({ where: { price: { [Sequelize.Op.gt]: 100 } } });
  }
}

Product.init({
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  sequelize,
  modelName: "Product"
});

module.exports = Product;
```

### 2.3 Common Data Types

```javascript
DataTypes.STRING            // VARCHAR(255)
DataTypes.STRING(100)         // VARCHAR(100)
DataTypes.TEXT                  // TEXT
DataTypes.INTEGER
DataTypes.BIGINT
DataTypes.FLOAT
DataTypes.DOUBLE
DataTypes.DECIMAL(10, 2)
DataTypes.BOOLEAN
DataTypes.DATE
DataTypes.DATEONLY               // date without time
DataTypes.JSON
DataTypes.JSONB                    // (Postgres only)
DataTypes.ENUM("active", "inactive", "banned")
DataTypes.UUID
DataTypes.UUIDV4
DataTypes.ARRAY(DataTypes.STRING)    // (Postgres only)
DataTypes.VIRTUAL                       // computed field, not stored in DB
```

### 2.4 Virtual fields, default values, and custom getters/setters

```javascript
const User = sequelize.define("User", {
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,

  fullName: {
    type: DataTypes.VIRTUAL,
    get() {
      return `${this.firstName} ${this.lastName}`;
    }
  },

  password: {
    type: DataTypes.STRING,
    set(value) {
      // runs automatically whenever password is set
      this.setDataValue("password", hashPassword(value));
    }
  },

  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});
```

---

## 3. CRUD Operations

### 3.1 Create

```javascript
// Create a single row
const user = await User.create({
  firstName: "Alice",
  lastName: "Smith",
  email: "alice@example.com"
});

// Build then save (useful when you want to modify before persisting)
const user2 = User.build({ firstName: "Bob" });
user2.lastName = "Jones";
await user2.save();

// Bulk create
await User.bulkCreate([
  { firstName: "Jane", email: "jane@example.com" },
  { firstName: "Sam", email: "sam@example.com" }
], { validate: true }); // run validations for each row
```

### 3.2 Read

```javascript
// Find all
const users = await User.findAll();

// Find with conditions
const activeUsers = await User.findAll({ where: { isActive: true } });

// Find one
const user = await User.findOne({ where: { email: "alice@example.com" } });

// Find by primary key
const user2 = await User.findByPk(1);

// Find or create
const [user3, created] = await User.findOrCreate({
  where: { email: "new@example.com" },
  defaults: { firstName: "New", lastName: "User" }
});

// Count
const count = await User.count({ where: { isActive: true } });

// Select specific fields
const users2 = await User.findAll({ attributes: ["id", "firstName", "email"] });

// Exclude fields
const users3 = await User.findAll({ attributes: { exclude: ["password"] } });
```

### 3.3 Update

```javascript
// Instance update
const user = await User.findByPk(1);
user.firstName = "Alicia";
await user.save();

// Or update multiple fields at once
await user.update({ firstName: "Alicia", age: 31 });

// Bulk update (returns [affectedCount])
const [affectedCount] = await User.update(
  { isActive: false },
  { where: { age: { [Op.lt]: 18 } } }
);
```

### 3.4 Delete

```javascript
// Instance destroy
const user = await User.findByPk(1);
await user.destroy();

// Bulk destroy
await User.destroy({ where: { isActive: false } });

// Destroy all rows (careful!)
await User.destroy({ where: {}, truncate: true });

// Soft delete (requires paranoid: true on model) — sets deletedAt instead of removing row
await user.destroy();               // soft delete
await user.restore();                 // undo soft delete
await User.findAll({ paranoid: false }); // include soft-deleted rows
```

---

## 4. Querying — Operators & Options

### 4.1 Operators (`Op`)

```javascript
const { Op } = require("sequelize");

await User.findAll({
  where: {
    age: { [Op.gt]: 18 },              // greater than
    // [Op.gte]                            greater than or equal
    // [Op.lt]                              less than
    // [Op.lte]                              less than or equal
    // [Op.ne]                                not equal
    // [Op.eq]                                 equal
    // [Op.between]: [10, 20]                    between two values
    // [Op.notBetween]: [10, 20]
    // [Op.in]: [1, 2, 3]                          value in list
    // [Op.notIn]: [1, 2, 3]
    // [Op.like]: '%john%'                           SQL LIKE
    // [Op.notLike]: '%john%'
    // [Op.iLike]: '%john%'                            case-insensitive LIKE (Postgres only)
    // [Op.is]: null                                     IS NULL
    // [Op.not]: null                                      IS NOT NULL / negation
  }
});

// Combining conditions with AND / OR
await User.findAll({
  where: {
    [Op.and]: [{ isActive: true }, { age: { [Op.gte]: 18 } }]
  }
});
await User.findAll({
  where: {
    [Op.or]: [{ firstName: "Alice" }, { firstName: "Bob" }]
  }
});

// Implicit AND (multiple keys = AND by default)
await User.findAll({ where: { isActive: true, age: { [Op.gte]: 18 } } });
```

### 4.2 Ordering, Limiting, Pagination

```javascript
await User.findAll({
  order: [["createdAt", "DESC"]],                  // single column
  // order: [["lastName", "ASC"], ["firstName", "ASC"]] // multiple columns
  limit: 10,
  offset: 20
});

// Pagination helper
async function paginate(page = 1, pageSize = 10) {
  const { count, rows } = await User.findAndCountAll({
    limit: pageSize,
    offset: (page - 1) * pageSize,
    order: [["id", "ASC"]]
  });
  return { total: count, page, pageSize, users: rows };
}
```

### 4.3 Aggregation

```javascript
await User.count();
await User.max("age");
await User.min("age");
await User.sum("age");

const stats = await User.findAll({
  attributes: [
    [sequelize.fn("COUNT", sequelize.col("id")), "totalUsers"],
    [sequelize.fn("AVG", sequelize.col("age")), "avgAge"]
  ]
});

// GROUP BY
const results = await Order.findAll({
  attributes: ["customerId", [sequelize.fn("SUM", sequelize.col("amount")), "totalSpent"]],
  group: ["customerId"]
});
```

### 4.4 Raw Queries (for complex/custom SQL)

```javascript
const [results, metadata] = await sequelize.query(
  "SELECT * FROM users WHERE age > :minAge",
  {
    replacements: { minAge: 18 },
    type: sequelize.QueryTypes.SELECT
  }
);
```

---

## 5. Associations (Relationships)

### 5.1 One-to-One (`hasOne` / `belongsTo`)

```javascript
User.hasOne(Profile, { foreignKey: "userId" });
Profile.belongsTo(User, { foreignKey: "userId" });

// Usage
const user = await User.findByPk(1, { include: Profile });
console.log(user.Profile);

const profile = await Profile.create({ bio: "Hello!", userId: 1 });
```

### 5.2 One-to-Many (`hasMany` / `belongsTo`)

```javascript
User.hasMany(Post, { foreignKey: "userId", as: "posts" });
Post.belongsTo(User, { foreignKey: "userId", as: "author" });

// Usage
const user = await User.findByPk(1, { include: "posts" });
console.log(user.posts);        // array of posts

const post = await Post.findByPk(1, { include: "author" });
console.log(post.author.firstName);

// Create related record directly
const user2 = await User.findByPk(1);
await user2.createPost({ title: "My First Post" });   // auto-generated helper method

// Get related records
const posts = await user2.getPosts({ where: { published: true } });
```

### 5.3 Many-to-Many (`belongsToMany`)

```javascript
Student.belongsToMany(Course, { through: "Enrollments", foreignKey: "studentId" });
Course.belongsToMany(Student, { through: "Enrollments", foreignKey: "courseId" });

// Using an explicit junction model (recommended when the join table has extra fields)
const Enrollment = sequelize.define("Enrollment", {
  enrolledAt: DataTypes.DATE,
  grade: DataTypes.STRING
});
Student.belongsToMany(Course, { through: Enrollment });
Course.belongsToMany(Student, { through: Enrollment });

// Usage
const student = await Student.findByPk(1, { include: Course });
console.log(student.Courses);

await student.addCourse(course);                 // add one
await student.addCourses([course1, course2]);      // add many
await student.removeCourse(course);                  // remove one
await student.setCourses([course1, course2]);          // replace all associations
const hasCourse = await student.hasCourse(course);        // check association

// Access junction table data
const student2 = await Student.findByPk(1, { include: Course });
student2.Courses.forEach(course => {
  console.log(course.Enrollment.grade);   // access through-table fields
});
```

### 5.4 Eager Loading (`include`) — Nested & Filtered

```javascript
// Nested includes
const user = await User.findByPk(1, {
  include: [
    {
      model: Post,
      as: "posts",
      include: [{ model: Comment, as: "comments" }]
    }
  ]
});

// Filtering included associations
const users = await User.findAll({
  include: [{
    model: Post,
    as: "posts",
    where: { published: true },
    required: true            // required: true = INNER JOIN, false = LEFT JOIN (default)
  }]
});

// Selecting specific attributes from included models
const users2 = await User.findAll({
  include: [{ model: Post, as: "posts", attributes: ["id", "title"] }]
});
```

### 5.5 Self-Referencing Association (e.g. employee-manager)

```javascript
Employee.belongsTo(Employee, { as: "manager", foreignKey: "managerId" });
Employee.hasMany(Employee, { as: "subordinates", foreignKey: "managerId" });

const employee = await Employee.findByPk(1, {
  include: [{ model: Employee, as: "manager" }, { model: Employee, as: "subordinates" }]
});
```

---

## 6. Validations

```javascript
const User = sequelize.define("User", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: { msg: "Must be a valid email address" },
      notEmpty: true
    }
  },
  username: {
    type: DataTypes.STRING,
    validate: {
      len: [3, 20],                          // length between 3-20 chars
      isAlphanumeric: true
    }
  },
  age: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0,
      max: 120,
      isInt: true
    }
  },
  website: {
    type: DataTypes.STRING,
    validate: {
      isUrl: true
    }
  },
  status: {
    type: DataTypes.STRING,
    validate: {
      isIn: [["active", "inactive", "pending"]]
    }
  },
  // Custom validator function
  password: {
    type: DataTypes.STRING,
    validate: {
      isStrongEnough(value) {
        if (value.length < 8) {
          throw new Error("Password must be at least 8 characters");
        }
      }
    }
  }
});

// Model-level validation (cross-field)
const Event = sequelize.define("Event", {
  startDate: DataTypes.DATE,
  endDate: DataTypes.DATE
}, {
  validate: {
    endDateAfterStartDate() {
      if (this.endDate < this.startDate) {
        throw new Error("End date must be after start date");
      }
    }
  }
});

// Catching validation errors
try {
  await User.create({ email: "not-an-email" });
} catch (err) {
  if (err.name === "SequelizeValidationError") {
    err.errors.forEach(e => console.log(e.message));
  }
}
```

---

## 7. Hooks (Lifecycle Events)

```javascript
const User = sequelize.define("User", {
  password: DataTypes.STRING
});

// beforeCreate / afterCreate
User.beforeCreate(async (user, options) => {
  user.password = await hashPassword(user.password);
});

User.afterCreate((user, options) => {
  console.log(`New user created: ${user.email}`);
});

// beforeUpdate / afterUpdate
User.beforeUpdate((user, options) => {
  if (user.changed("email")) {
    console.log("Email is being changed");
  }
});

// beforeDestroy
User.beforeDestroy(async (user, options) => {
  await ArchivedUser.create({ ...user.toJSON() });
});

// beforeValidate / afterValidate
User.beforeValidate((user) => {
  user.email = user.email.toLowerCase().trim();
});

// beforeBulkCreate / beforeBulkUpdate / beforeBulkDestroy — for bulk operations

// Hooks can also be defined in the model options object:
sequelize.define("Product", { /* fields */ }, {
  hooks: {
    beforeCreate: (product) => { product.slug = slugify(product.name); }
  }
});
```

---

## 8. Transactions

```javascript
// Managed transaction (auto commit/rollback)
const result = await sequelize.transaction(async (t) => {
  const from = await Account.findByPk(1, { transaction: t });
  const to = await Account.findByPk(2, { transaction: t });

  await from.update({ balance: from.balance - 100 }, { transaction: t });
  await to.update({ balance: to.balance + 100 }, { transaction: t });

  return { success: true };
});
// If any awaited call inside throws, Sequelize automatically ROLLBACKs; otherwise COMMITs

// Unmanaged transaction (manual control)
const t = await sequelize.transaction();
try {
  await Account.update({ balance: 900 }, { where: { id: 1 }, transaction: t });
  await Account.update({ balance: 1100 }, { where: { id: 2 }, transaction: t });
  await t.commit();
} catch (err) {
  await t.rollback();
  throw err;
}

// Row locking within a transaction (prevent race conditions)
await sequelize.transaction(async (t) => {
  const product = await Product.findByPk(1, {
    transaction: t,
    lock: t.LOCK.UPDATE   // SELECT ... FOR UPDATE
  });
  if (product.stock > 0) {
    await product.update({ stock: product.stock - 1 }, { transaction: t });
  }
});
```

---

## 9. Scopes

Scopes let you define reusable, named query conditions on a model.

```javascript
const User = sequelize.define("User", { /* ... */ }, {
  defaultScope: {
    where: { isActive: true }        // applied automatically on every query
  },
  scopes: {
    inactive: { where: { isActive: false } },
    admins: { where: { role: "admin" } },
    withPosts: { include: [{ model: Post, as: "posts" }] },
    olderThan(age) {                   // parameterized scope
      return { where: { age: { [Op.gt]: age } } };
    }
  }
});

// Usage
await User.findAll();                        // uses defaultScope (isActive: true)
await User.scope("inactive").findAll();
await User.scope("admins", "withPosts").findAll();   // combine scopes
await User.scope({ method: ["olderThan", 21] }).findAll();
await User.unscoped().findAll();                 // ignore all scopes, including default
```

---

## 10. Migrations & Seeders (Sequelize CLI)

### 10.1 Setup

```bash
npx sequelize-cli init
# Creates: config/config.json, models/, migrations/, seeders/
```

```json
// config/config.json
{
  "development": {
    "username": "root",
    "password": "password",
    "database": "myapp_dev",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
```

### 10.2 Generating & Running Migrations

```bash
npx sequelize-cli model:generate --name User --attributes firstName:string,email:string,age:integer
npx sequelize-cli db:migrate                # run all pending migrations
npx sequelize-cli db:migrate:undo            # undo the most recent migration
npx sequelize-cli db:migrate:undo:all         # undo all migrations
```

```javascript
// migrations/20240101000000-create-user.js
"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, unique: true },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  }
};

// Migration to add a column
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "phone", { type: Sequelize.STRING });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "phone");
  }
};
```

### 10.3 Seeders (sample/test data)

```bash
npx sequelize-cli seed:generate --name demo-users
npx sequelize-cli db:seed:all
npx sequelize-cli db:seed:undo:all
```

```javascript
// seeders/20240101000000-demo-users.js
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      { firstName: "Alice", email: "alice@example.com", createdAt: new Date(), updatedAt: new Date() },
      { firstName: "Bob", email: "bob@example.com", createdAt: new Date(), updatedAt: new Date() }
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  }
};
```

---

## 11. Instance & Model Utility Methods

```javascript
const user = await User.findByPk(1);

user.toJSON();                    // plain object representation
user.get({ plain: true });          // same as toJSON
user.changed();                        // array of changed field names since last save
user.changed("email");                   // boolean: was this field changed?
user.previous("email");                    // value before the current change
await user.reload();                          // refresh instance from DB

// Model class methods
User.rawAttributes;                  // metadata about model fields
User.getTableName();
User.associations;                     // all defined associations
```

---

## 12. Full Example — Express + Sequelize REST API

```javascript
// models/index.js
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("blog", "root", "password", { dialect: "mysql", logging: false });

const User = sequelize.define("User", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true }
});

const Post = sequelize.define("Post", {
  title: { type: DataTypes.STRING, allowNull: false },
  content: DataTypes.TEXT,
  published: { type: DataTypes.BOOLEAN, defaultValue: false }
});

User.hasMany(Post, { foreignKey: "userId", as: "posts" });
Post.belongsTo(User, { foreignKey: "userId", as: "author" });

module.exports = { sequelize, User, Post };

// app.js
const express = require("express");
const { sequelize, User, Post } = require("./models");
const app = express();
app.use(express.json());

app.get("/api/posts", async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      where: { published: true },
      include: [{ model: User, as: "author", attributes: ["id", "name"] }],
      order: [["createdAt", "DESC"]]
    });
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

app.post("/api/posts", async (req, res, next) => {
  try {
    const post = await Post.create(req.body);
    res.status(201).json(post);
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({ errors: err.errors.map(e => e.message) });
    }
    next(err);
  }
});

app.listen(3000, async () => {
  await sequelize.authenticate();
  console.log("Server + DB connected");
});
```

---

## 13. Quick Reference Cheat Sheet

| Task | Method |
|---|---|
| Create | `Model.create(data)` |
| Read all | `Model.findAll(options)` |
| Read one | `Model.findOne(options)` / `Model.findByPk(id)` |
| Update | `instance.update(data)` / `Model.update(data, { where })` |
| Delete | `instance.destroy()` / `Model.destroy({ where })` |
| Count | `Model.count(options)` |
| Pagination | `Model.findAndCountAll({ limit, offset })` |
| Eager load | `{ include: [Model] }` or `{ include: "alias" }` |
| Filter | `{ where: { field: value } }` |
| Operators | `Op.gt`, `Op.lt`, `Op.in`, `Op.like`, `Op.and`, `Op.or` |
| Sort | `{ order: [["field", "ASC"|"DESC"]] }` |
| Transactions | `sequelize.transaction(async (t) => {...})` |
| Raw SQL | `sequelize.query(sql, { replacements, type })` |

**Association types:**
| Relationship | Methods |
|---|---|
| One-to-One | `hasOne` / `belongsTo` |
| One-to-Many | `hasMany` / `belongsTo` |
| Many-to-Many | `belongsToMany` (with `through`) |
