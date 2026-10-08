import { Router } from "express";

import {
  getAllusers,
  addNewUser,
  getById,
  deleteuser,
  editUser
} from "../controllers/users.controller.ts";

const usersRoute = Router();

usersRoute.get("/", getAllusers);

usersRoute.get("/:id", getById);

usersRoute.post("/", addNewUser);

usersRoute.put("/:id", editUser);

usersRoute.delete("/:id", deleteuser);

export default usersRoute;