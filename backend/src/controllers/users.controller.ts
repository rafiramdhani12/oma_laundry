import {type Request , type Response} from "express"
import { getAllUsers , getUserById , createUser , updateUser ,deleteUser} from "../services/users.services.ts";

export const getAllusers = async (req : Request , res : Response) => {
    const users = await getAllUsers()
    res.json(users)
}

export const getById = async (req : Request , res : Response) => {
    const {id} = req.params
    const user = await getUserById(Number(id))
    res.json(user)
}

export const addNewUser = async (req :Request , res : Response) => {
    const {name , password , role} = req.body
    const user = await createUser(name , password , role)
    res.json(user)
}

export const editUser = async (req :Request , res : Response) => {
    const {id} = req.params
    const {name , password , role} = req.body
    const user = await updateUser(Number(id) , name , password , role)
    res.json(user)
}

export const deleteuser = async (req :Request , res : Response) => {
    const {id} = req.params
    const user = await deleteUser(Number(id))
    res.json(user)
}