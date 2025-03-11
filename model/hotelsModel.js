import mongoose, { Schema } from "mongoose";

const hotelSchema = new Schema({
  //----------------------------------basicInformation----------------/

  basicInformation: {
    name: { type: String, required: true },
    propertyType: { type: String, require: true },
    description: { type: String, required: true },
    category: { type: Number, enum: [7, 5, 4, 3, 2, 1], default: 5, required: true },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      zipCode: { type: String, required: true },
      latitude: { type: String, default: "40.7128" },
      longitude: { type: String, default: "-74.0060" }
    }
  },
  //------------------------------ContactInformation--------------------/
  contactInformation: {
    sales_team: {
      email: { type: String, required: true },
      phone: { type: [Number], required: true }
    },
    operation_team: {
      email: { type: String, required: true },
      phone: { type: [Number], required: true }
    },
    front_office_team: {
      email: { type: String, required: true },
      phone: { type: [Number], required: true }
    },
    management_team: {
      email: { type: String, required: true },
      phone: { type: [Number], required: true }
    },
    website: { type: String, required: false }
  },

  //-----------------------------Policies------------------------/
  policies: {
    checkIn: { type: String },
    checkOut: { type: String },
    cancellationPolicy: { type: String },
    groupPolicy: { type: String }
  },
  //---------------------------------GeneralFacilities-------------------

  generalFacilities: [
    {
      Accommodation_and_Relaxation_facilites: [],
      Dining_and_Food_Services: [],
      Business_and_Professional_Services: [],
      Family_and_Kid_Friendly_Services: [],
      Accessible_and_Special_Needs: [],
      others: []
    },

  ],


  //-------------------------------Add-ons and Supplements--------/

  supplements: [
    {
      name: {
        type:String
      },
      price: {
        type:Number
      },
      persons: {
        type:Number
      },
      maxPrice: {
        type:Number
      }
    },

  ],

  //----------------------Nearby Attractions and Facilities------------/
  nearbyAttractions: {
    name: { type: String },
    distance: { type: Number },
    
  },

  //--------------------------House Rules & Information---------------/
  Rules: [
    { type: String }
  ],


  totalNumberOfRooms: {
      type: Number
  },

  mealType: {
    type: [String], enum: ["EPAI", "CPAI", "MAPAI", "APAI"], default: []
},




},
  {
    versionKey: false,
    timestamps: true
  }
);

const hotelModel = mongoose.model("Hotel", hotelSchema)
export default hotelModel