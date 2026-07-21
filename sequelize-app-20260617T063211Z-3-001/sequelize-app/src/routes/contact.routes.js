const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contact.controller");


router.post("/create", contactController.createContact);
router.get("/list", contactController.getContacts);
router.post("/bulk-create", contactController.bulkCreateContacts);
router.get("/users-by-time", contactController.getUsersByTime)

module.exports = router;