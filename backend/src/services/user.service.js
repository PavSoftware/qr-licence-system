import User from "../models/User.js";
import bcrypt from "bcrypt";
// procura por email
const findOneUserByEmail = (email) => User.findOne({ email });

// procura por ID
const findOneUserById = (id) => User.findById(id);

// cria user
const createUser = (data) => User.create(data);

// lista admins
const findAdmins = () => User.find({ role: 'admin' }).select('-password');



const UpDateSuperAdmin = async ({ id, name, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return User.findOneAndUpdate(
    { _id: id },
    { name, email, password: hashedPassword },
    { new: true }
  );
};



// deleta user
const deleteUser = (id) => User.deleteOne({ _id: id });

export default { 
  createUser, 
  findOneUserByEmail, 
  findOneUserById, 
  findAdmins, 
  deleteUser,
  UpDateSuperAdmin 
};
