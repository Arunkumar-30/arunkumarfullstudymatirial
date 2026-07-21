const express = require("express");
const { sequelize } = require("./src/models/index");
const contactRoutes = require("./src/routes/contact.routes");

const app = express();
app.use(express.json());

app.use("/api/contacts", contactRoutes);

// DB Sync (auto create tables)
sequelize.sync({ alter: true }).then(() => {
  console.log("Database synced");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});