import User from "../models/User.js";

const findOneUser = (email) => User.findOne({email})

const createUser = (data) => User.create(data) 

export default { createUser, findOneUser }