
import express from "express";
import {
  getAllCity, getFullData, selectedCity,

} from "../controllers/storeController";

const router = express.Router();


router.route("/city").get(getAllCity);
router.route("/city/:city_name").get(selectedCity);
router.route("/city").post(getFullData);


module.exports = router;
