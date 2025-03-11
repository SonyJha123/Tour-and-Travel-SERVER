import mongoose from "mongoose"
  
  const connectdb = async (req, res) => {
    try {
        await mongoose.connect("mongodb+srv://sonysleekit:Sony%4025042002@cluster0.8hfhe.mongodb.net/Tour-and-Travel?retryWrites=true&w=majority&appName=Cluster0")

        console.log("Database connected successfully");
        
    } catch (error) {
        return res.status(400).json({message:" database not connected**"})
    }
  }

  export default connectdb;