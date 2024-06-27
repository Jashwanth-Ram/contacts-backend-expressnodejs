const express = require("express");
const router = express.Router();
const {getContacts,getContactbyId,deleteContact,updateContact,createContact } = require('../controllers/contactController');
const validateToken = require("../middleware/validateTokenHandler");


router.use(validateToken);
router.route("/").get(getContacts).post(createContact);


router.route("/:id").get(getContactbyId).put(updateContact).delete(deleteContact)



module.exports = router;
