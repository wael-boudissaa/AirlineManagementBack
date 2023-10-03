const express = require("express");
const { getAdmins, postTicket, getTicketEmploye, getTicketAdmin, getMessages, postMessage } = require("../controllers/messageControllers");
const router = express.Router();

router.route("/").get(getAdmins);
router.route("/ticket").post(postTicket);
router.route("/ticket/employe").get(getTicketEmploye);
router.route("/ticket/admin").get(getTicketAdmin);
router.route("/ticket/messages").get(getMessages);
router.route("/ticket/messages").post(postMessage);

module.exports = router;
