import errorHandler from "../helper/error_handeling.js";
import hotelsModel from "../model/hotelsModel.js";
import roomsModel from "../model/roomsModel.js";
import mongoose from "mongoose";
import getLatLongFromAddressNominatim from "../helper/LatLongFromAddress.js";
import hotelModel from "../model/hotelsModel.js";

export const CreateHotelBasicAndContactInfo = async (req, res, next) => {
  try {
  
    const {
      basicInformation: {
        name,
        propertyType,
        description,
        category,
        location: {
          address,
          city,
          state,
          country,
          zipCode,
         
        }
      },
      contactInformation: {
        sales_team: { email: saleseMail, phone: salesPhone },
        operation_team: { email: operationEmail, phone: operationPhone },
        front_office_team: { email: frontOfficeemail, phone: frontOfficephone },
        management_team: { email: managementEmail, phone: managementPhone },
        website
      },
      // hotelAccessPeriod
    } = req.body;
    if (!req.body.basicInformation || !req.body.contactInformation ) {
      return res.status(400).json({status:400, message: "Invalid Payload" });
    }
     let hotelAddress = `${req.body.basicInformation.location.address},${req.body.basicInformation.location.city}`
     let LatLong = await getLatLongFromAddressNominatim(hotelAddress)
    

     let latitude = LatLong?.latitude? LatLong.latitude : ""
     let longitude = LatLong?.longitude? LatLong.longitude : ""
    const existinghotel= await hotelsModel.findOne({
      "basicInformation.name":name,
      "basicInformation.location.zipCode":zipCode,
      "basicInformation.location.latitude":latitude,
      "basicInformation.location.longitude":longitude,
      "contactInformation.sales_team.email":saleseMail
      
      
          })
          if(existinghotel){
            return res.status(400).json({status:400, message:"Hotel already exist"})
          }
      

    const hotel = await hotelsModel.create({
      basicInformation: {
        name,
        propertyType,
        description,
        category,
        location: {
          address,
          city,
          state,
          country,
          zipCode,
          latitude,
          longitude,
        },
      },
      contactInformation: {
        sales_team: { email: saleseMail, phone: salesPhone },
        operation_team: { email: operationEmail, phone: operationPhone },
        front_office_team: { email: frontOfficeemail, phone: frontOfficephone },
        management_team: { email: managementEmail, phone: managementPhone },
        website,
      },
      // hotelAccessPeriod,
    });

    return res.status(201).json({status:201, message: "hotel info created succefully", hotel });
  } catch (err) {
    next(err);
  }
};

export const updateRemainingHotelInfo = async (req, res, next) => {
  try {
    const hotelId  = req.params.id; 

    const {
      policies: {
        checkIn,
        checkOut,
        cancellationPolicy,
        groupPolicy,
      } = {},
      nearbyAttractions,
      Rules,
      generalFacilities,
    } = req.body;

    const updatedHotel = await hotelsModel.findByIdAndUpdate(
      hotelId,
      {
        $set: {
          policies: {
            checkIn,
            checkOut,
            cancellationPolicy,
            groupPolicy,
          },
          nearbyAttractions,
          Rules,
          generalFacilities,
        },
      },
      { new: true, runValidators: true } 
    );

    if (!updatedHotel) {
      return res.status(404).json({status:400, message: "Hotel not found" });
    }

    return res.status(200).json({
      status:200,
      message: "Hotel information updated successfully",
      hotel: updatedHotel,
    });
  } catch (err) {
    next(err); 
  }
}; 




  export const getHotelById=async(req,res,next)=>{
    try{  const hotelId=req.params.id
  if(!hotelId){
   return res.status(400).json({message:"hotelId is required"})
  }
 
 const hotelData= await hotelsModel.findById(hotelId);
 return res.status(200).json({message:"succesfully get hotel data",hotelData})
 

 }
 catch(err){
  next(err);
 }
 };


export const deleteHotel=async(req,res,next)=>{
  try{
   const hotelId=req.params.id;
   
   if(!hotelId){
    return res.status(400).json({message:"Hotel id id required "})
   }
   const hotel=await hotelsModel.findById(hotelId)
   if(!hotel){
    return res.status(400).json({message:"no hotel found"})
   }
    await hotelsModel.findByIdAndDelete(hotelId)
    await roomsModel.deleteMany({hotelId})
return res.status(200).json({message:"hotel deleted succesfully",deleteHotel})

  }
  catch(err){
  next(err);
  }
};

export const getAllhotels= async(req,res,next)=>{
  try{
    const all_hotels= await hotelsModel.find()
    return res.status(200).json({message:"sucessfully get all data",all_hotels})

  }
  catch(err){
    next(err);
  }
};




