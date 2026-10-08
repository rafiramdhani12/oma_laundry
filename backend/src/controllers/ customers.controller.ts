import {createCustomer , deleteCustomer , readAllCustomers , readById , updateCustomer} from "../services/customers.services.ts";
import {type Request , type Response} from "express"

export const getAllCustomers = async (req : Request , res : Response) => {
    const customers = await readAllCustomers()
    res.json(customers)
}

export const getCustomerById = async (req : Request , res : Response) => {
    const {id} = req.params
    const customer = await readById(Number(id))
    res.json(customer)
}

export const addNewCustomer = async (req : Request , res : Response) => {
    const {name , phone} = req.body
    const customer = await createCustomer(name , phone)
    res.json(customer)
}

export const editCustomerById = async (req : Request , res : Response) => {
    const {id} = req.params
    const {name , phone} = req.body
    const customer = await updateCustomer(Number(id) , name , phone)
    res.json(customer)
}

export const deleteCustomerById = async (req : Request , res : Response) => {
    const {id} = req.params
    const customer = await deleteCustomer(Number(id))
    res.json(customer)
}