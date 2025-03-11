import mongoose, { Schema } from "mongoose";

const priceSchema = new Schema({
  single: { type: Number },
  double: { type: Number },
  extraBed: { type: Number },
  child: { type: Number },
  noChild: { type: Number },
}, { _id: false });

const roomschema = new Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    pricing: {
      pricingPlan: { type: String, enum: ["ANNUAL", "QUARTERLY"], default: "ANNUAL" },
      EPAI_based_Price: priceSchema,
      CPAI_based_Price: priceSchema,
      MAPAI_based_Price: priceSchema,
      APAI_based_Price: priceSchema,
    },
    blackoutdatePricing: [
      {
        durationType: { type: String, enum: ["RANGE", "DATE"], default: "DATE" },
        duration: String,
        EPAI_based_Price: priceSchema,
        CPAI_based_Price: priceSchema,
        MAPAI_based_Price: priceSchema,
        APAI_based_Price: priceSchema,
      },
    ],
    images: [String],  
    amenities: {
        Bar: { type: [String] },
        Entertainment: { type: [String] },
        Bathroom: { type: [String] },
        Refreshment_DiningAmenities:{ type: [String] },
        Safety_security:{ type: [String] },
        Room_Features:{ type: [String] },

        Others:{ type: [String] },
    },
    roomType: { type: String, required: false },
    roomCount: { type: Number, required: false },
    roomSize: { type: String, required: false },
    maxAdults: { type: Number, required: false },
    maxChildren: { type: Number, required: false },
    totalPax: { type: Number, required: false },
    },
  {
    versionKey: false,
    timestamps: true,
  }
);

const roomsModel = mongoose.model("rooms", roomschema);
export default roomsModel;
