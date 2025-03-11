import hotelModel from "../model/hotelsModel.js";
import roomsModel from "../model/roomsModel.js";
import cloudinary from "../middlewares/cloudinary.js";
import fs from 'fs';

// Helper function for JSON parsing with error handling
const parseJSONField = (field, fieldName) => {
  if (typeof field === 'string') {
    try {
      return JSON.parse(field);
    } catch (e) {
      throw new Error(`Invalid JSON in ${fieldName}: ${e.message}`);
    }
  }
  return field; 
};

const processFileUploads = async (files) => {
  if (!files || files.length === 0) return {};

  const roomTypeMap = new Map();
  files.forEach(file => {
    const match = file.fieldname.match(/roomImages\[(.*?)\]/);
    if (match) {
      const roomType = match[1];
      const files = roomTypeMap.get(roomType) || [];
      files.push(file.path);
      roomTypeMap.set(roomType, files);
    }
  });

  const formattedImages = {};
  await Promise.all(
    [...roomTypeMap.entries()].map(async ([roomType, paths]) => {
      try {
        formattedImages[roomType] = await Promise.all(
          paths.map(async path => {
            const result = await cloudinary.uploader.upload(path);
            return result.secure_url;
          })
        );
      } catch (uploadError) {
        console.error(`Upload failed for ${roomType}:`, uploadError);
      }
    })
  );

  return formattedImages;
};


export const createRoom = async (req, res, next) => {
  
  try {
    const hotelId = req.params.hotelid;
    if (!hotelId) {
      return res.status(400).json({ status: 400, message: "Hotel ID is required" });
    }

    const parsedData = {
      roomType: parseJSONField(req.body.roomType, 'roomType'),
      roomCountandCapacity: parseJSONField(req.body.roomCountandCapacity, 'roomCountandCapacity'),
      pricing: parseJSONField(req.body.pricing, 'pricing'),
      roomAmenities: parseJSONField(req.body.roomAmenities, 'roomAmenities'),
      blackoutdatePricing: parseJSONField(req.body.blackoutdatePricing, 'blackoutdatePricing'),
      mealType: req.body.mealType,
      supplements: parseJSONField(req.body.supplements, 'supplements'),
      totalNumberOfRooms: Number(req.body.totalNumberOfRooms),
    };

    // Validate required room fields
    for (const roomType of parsedData.roomType) {
      if (!parsedData.roomCountandCapacity[roomType]?.roomCount) {
        return res.status(400).json({ status: 400, message: `Missing roomCount for ${roomType}` });
      }
    }

    const hotel = await hotelModel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ status: 404, message: "Hotel not found" });
    }

    // Update hotel information
    await hotelModel.findByIdAndUpdate(hotelId, {
      totalNumberOfRooms: parsedData.totalNumberOfRooms,
      mealType: parsedData.mealType,
      supplements: parsedData.supplements,
    });

    // Process file uploads efficiently
    const formattedImages = await processFileUploads(req.files);

    // Prepare room documents for bulk insertion
    const roomsToInsert = parsedData.roomType.map(type => {
      const roomData = parsedData.roomCountandCapacity[type] || {};
      const roomPricing = parsedData.pricing[type] || {};
      const roomAmenitiesList = parsedData.roomAmenities[type] || [];
      const roomImages = formattedImages[type] || [];

      return {
        hotelId,
        roomType: type,
        roomCount: roomData.roomCount,
        roomSize: roomData.roomSize,
        maxAdults: roomData.maxAdults,
        maxChildren: roomData.maxChildren,
        totalPax: roomData.totalPax,
        images: roomImages,
        amenities: roomAmenitiesList,
        pricing: {
          pricingPlan: parsedData.pricing.pricingPlan,
          duration: parsedData.pricing.duration,

          EPAI_based_Price: roomPricing.EPAI_based_Price,
          CPAI_based_Price: roomPricing.CPAI_based_Price,
          MAPAI_based_Price: roomPricing.MAPAI_based_Price,
          APAI_based_Price: roomPricing.APAI_based_Price,
        },
        blackoutdatePricing: parsedData.blackoutdatePricing
          .filter(bp => bp[type])
          .map(bp => ({
            durationType: bp.durationType,
            duration: bp.duration,
            EPAI_based_Price: bp[type]?.EPAI_based_Price || {},
            CPAI_based_Price: bp[type]?.CPAI_based_Price || {},
            MAPAI_based_Price: bp[type]?.MAPAI_based_Price || {},
            APAI_based_Price: bp[type]?.APAI_based_Price || {},
          })),
      };
    });

    // Bulk insert rooms
    await roomsModel.insertMany(roomsToInsert);

    // Fetch the newly created rooms
    const getRoomsByHotelId = await roomsModel.find({ hotelId });

    return res.status(201).json({
      status: 201,
      message: "Rooms created successfully",
      getRoomsByHotelId,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: 500,
      message: error.message || "Internal server error",
    });
  }
};

export const updateRoomDataById = async (req, res, next) => {
  try {
    const roomId = req.params.id;
    const { amenities, pricing, images, roomCount, capacity } = req.body;

    const updateFields = {};
    if (amenities) updateFields.amenities = amenities;
    if (pricing) updateFields.pricing = pricing;
    if (images) updateFields.images = images;
    if (roomCount) updateFields.roomCount = roomCount;
    if (capacity) updateFields.capacity = capacity;

    const updatedRoom = await roomsModel.findByIdAndUpdate(
      roomId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedRoom) {
      return res.status(404).json({
        status: 400,
        message: "Room not found or could not be updated."
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Room updated successfully.",
      roomDetails: updatedRoom,
    });
  } catch (error) {
    next(error);
  }
};