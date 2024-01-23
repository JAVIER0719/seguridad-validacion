import  JsonWebToken  from "jsonwebtoken";
import dotenv from "dotenv"
import  {usuarios}  from "../controllers/authentication.controller.js";
dotenv.config();


function soloAdmin(req, res, next){
const logueado = revisarCookie(req);
if(logueado) return next();
return res.redirect("/")
}

function soloPublico(req, res, next){
    const logueado = revisarCookie(req);
if(!logueado) return next();
return res.redirect("/admin")
}

function revisarCookie(req){
  try{
        console.log("cookie",req.headers.cookie)
        const cookieJWT=req.headers.cookie.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4);
        const descodificada = JsonWebToken.verify(cookieJWT,process.env.JWT_SECRET)
        console.log(descodificada)
        const usuarioArevisar=  usuarios.find(usuario =>usuario.user == descodificada.user)
        console.log(usuarioArevisar)
            if(!usuarioArevisar){
                return false
            }
            return true
        }
        catch{
            return false
        }
}


export const methods={
    soloAdmin,
    soloPublico 
}