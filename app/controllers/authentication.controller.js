import bcryptjs from "bcryptjs";
import  JsonWebToken  from "jsonwebtoken";
import dotenv from "dotenv"


dotenv.config();
export const usuarios = [{
    user: "a",
    email: "a@a.com",
    password:"$2a$08$6w9sLfN4br11TS6N1O.8GOPTcWpruv5n0NjCxfC5TZdtmzdSAcUL2"
}]


async function login(req, res){
console.log(req.body)
const user = req.body.user
const password = req.body.password
const email = req.body.email
if(!user || !password ){
return res.status(400).send({status:"error",message:"campos incompletos"})
}
const usuarioArevisar=  usuarios.find(usuario =>usuario.user == user)
if (!usuarioArevisar){
    return res.status(400).send({status:"error",message:"Error durante el login"})
}
const loginCorrecto= await bcryptjs.compare(password,usuarioArevisar.password)
if(!loginCorrecto){
    return res.status(400).send({status:"error",message:"campos incompletos"})
}
const token = JsonWebToken.sign({
    user:usuarioArevisar.user},
    process.env.JWT_SECRET,
    {expiresIn:process.env.JWT_EXPIRATION})
const cookieOption ={
    expires:new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 *1000),
    path: "/"
}
res.cookie("jwt",token,cookieOption);
res.send({status:"ok",message:"Usuario loggeado",redirect:"/admin"})
}



async function resgister (req, res){

const user = req.body.user
const password = req.body.password
const email = req.body.email
if(!user || !password || !email){
return res.status(400).send({status:"error",message:"campos incompletos"})
}
const usuarioArevisar=  usuarios.find(usuario =>usuario.user == user)
if (usuarioArevisar){
    return res.status(400).send({status:"error",message:"este usuario ya existe"})
}
const salt = await bcryptjs.genSalt(8);
const hasPassword = await bcryptjs.hash(password,salt);
const nuevoUsuario ={
    user,email,password: hasPassword
}


usuarios.push(nuevoUsuario)
console.log(usuarios);
return res.status(201).send({status:"ok",message:`Usuario ${nuevoUsuario.user} agregado`,redirect:"/"})
}

export const methods={
    login,
    resgister
}