import express from "express";
import { createRoom,   updateRoomDataById } from "../controller/roomsController.js";
import upload from "../middlewares/multer.js";


const router = express.Router();

router.post("/create-room/:hotelid",upload.any(), createRoom)
//router.get("/getRoomsByHotelId/:id",getRoomsByHotelId)
//router.get("/getRoomById/:id",getRoomById)
//router.delete("/deleteRoom/:id",deleteRoom)
router.put("/updateroom/:id", updateRoomDataById)

export default router;