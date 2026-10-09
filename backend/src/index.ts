import express , {type Express , type Request , type Response} from "express"
import usersRoute from "./routes/users.route.ts"
import customersRoute from "./routes/customer.route.ts"
import authRoute from "./routes/auth.route.ts"
import servicesRoute from "./routes/service.route.ts"
import cors from "cors"
import orderItemsRoute from "./routes/orderItems.route.ts"
import paymentsRoute from "./routes/payments.route.ts"
import ordersRoute from "./routes/orders.route.ts"

const app : Express = express()

app.use(cors({
    origin : "http://localhost:5173"}))

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

app.listen(3000 , () => {
    console.log("server is running on port 3000")
})