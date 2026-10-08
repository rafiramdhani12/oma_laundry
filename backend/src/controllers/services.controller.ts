import {type Request , type Response} from "express"
import {createService , deleteService , readAllServices , readServiceById , updateService} from "../services/services.services.ts";

export const getAllServices = async (req : Request , res : Response) => {
    const services = await readAllServices()
    res.json(services)
}

export const getServiceById = async (req : Request , res : Response) => {
    const {id} = req.params
    const service = await readServiceById(Number(id))
    res.json(service)
}

export const addNewService = async (req : Request , res : Response) => {
    const {name , unit , price} = req.body
    const service = await createService(name , unit , price)
    res.json(service)
}

export const editService = async (req : Request , res : Response) => {
    const {id} = req.params
    const {name , unit , price} = req.body
    const service = await updateService(Number(id) , name , unit , price)
    res.json(service)
}

export const deleteServiceById = async (req : Request , res : Response) => {
    const {id} = req.params
    const service = await deleteService(Number(id))
    res.json(service)
}