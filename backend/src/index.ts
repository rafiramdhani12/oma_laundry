import express , {type Express , type Request , type Response} from "express"
import usersRoute from "./routes/users.route.ts"
import customersRoute from "./routes/customer.route.ts"
import authRoute from "./routes/auth.route.ts"
import servicesRoute from "./routes/service.route.ts"
import cors from "cors"
import orderItemsRoute from "./routes/orderItems.route.ts"
import paymentsRoute from "./routes/payments.route.ts"
import ordersRoute from "./routes/orders.route.ts"
import { markExpiredOrdersAsReady } from "./services/orders.services.ts"

const app : Express = express()

app.use(cors({
    origin : ["http://localhost:5173" , "https://oma-laundry-jr35.vercel.app/"]
}))

app.use(express.json())

app.get("/" , (req : Request , res : Response) => {
    res.send("hello world")
})

const prefixes = "api"

// untuk route
app.use(`/${prefixes}/users` , usersRoute)
app.use(`/${prefixes}/customers` , customersRoute)
app.use(`/${prefixes}/auth` , authRoute)
app.use(`/${prefixes}/services` , servicesRoute)
app.use(`/${prefixes}/orders` , ordersRoute)
app.use(`/${prefixes}/orderItems` , orderItemsRoute)
app.use(`/${prefixes}/payments` , paymentsRoute)

const runOrderScheduler = async () => {
    try {
     const updated = await markExpiredOrdersAsReady()   
     if (updated.length > 0) {
        console.log(`${updated.length} orders automatis berubah ke "siap"`)
     }
    } catch (error) {
        console.error("Error running order scheduler:", error);
    }
}

void runOrderScheduler()

setInterval(() => {
    void runOrderScheduler()
},30_000)

app.listen(3000 , () => {
    console.log("server is running on port 3000")
})