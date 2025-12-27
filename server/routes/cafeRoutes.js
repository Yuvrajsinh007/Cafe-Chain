const express = require("express");
const router = express.Router();
const { 
    getCafes,
    getCafeById,
    getOffersByCafeId
} = require("../controllers/cafeController");


router.get("/", getCafes);
router.get("/:id", getCafeById);
router.get("/:id/offers", getOffersByCafeId);

module.exports = router;