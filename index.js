import express from "express"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import connectdb from "./mongodb.js"
import hotelRoutes from "./route/hotelsRoute.js"
import cors from "cors"
import errorHandler from "./helper/error_handeling.js"
import roomRoutes from "./route/roomsRoute.js"
import userRoutes from "./route/userRoutes.js"

const app = express()
dotenv.config()

 const port = process.env.PORT || 8002
 app.use(express.json());
  

 app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())
app.use("/hotels",hotelRoutes)
app.use("/rooms",roomRoutes)
app.use("/Users",userRoutes)

app.use(errorHandler);
app.get("/", (req, res) => {
    res.send('Backend server is running!😊');
});

app.listen(port, '0.0.0.0', () => {
    console.log(`server is running on port ${port}`); 

})


connectdb()