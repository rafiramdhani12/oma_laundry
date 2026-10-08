import express , {type Express , type Request , type Response} from "express"
import usersRoute from "./routes/users.route.ts"
import customersRoute from "./routes/customer.route.ts"

const app : Express = express()

app.use(express.json())

app.get("/" , (req : Request , res : Response) => {
    res.send("hello world")
})

const prefixes = "api"

// untuk route
app.use(`/${prefixes}/users` , usersRoute)
app.use(`/${prefixes}/customers` , customersRoute)

app.listen(3000 , () => {
    console.log("server is running on port 3000")
})