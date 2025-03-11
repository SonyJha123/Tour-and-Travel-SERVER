import express from "express"
import { CreateHotelBasicAndContactInfo, updateRemainingHotelInfo,getHotelById, deleteHotel, getAllhotels, } from "../controller/hotelController.js";



const router= express.Router();
router.post("/",CreateHotelBasicAndContactInfo)
router.put("/updateremainhotalinfo/:id",updateRemainingHotelInfo)
// router.post("/createhotel",createAllHotelData)
//router.put("/updatepricingDetial/:id",updateRoomPricing)
router.get("/gethotel/:id",getHotelById);
router.delete("/delete_hotel/:id",deleteHotel);
router.get("/allhotels",getAllhotels)
export default router;  