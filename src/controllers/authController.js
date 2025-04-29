import UserModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class AuthController {
// Listar todos os usuários
async getAllUsers(req, res) {
    try {
      const users = await UserModel.findAll();
      res.json(users);
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      res.status(500).json({ error: "Erro ao listar usuários" });
    }
  }
  //Registrar novo usuário
  async register(req,res) {
    try {
        const {name, email, password} = req.body;

        //Validação básica
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Os campos nome, email e senha são obrigatórios" });
    } 
    // Verificar se o usuario já existe
        const userExists = await UserModel.findByEmail(email);
        if (userExists) {
            return res.status(400).json({ error: "Este email já esta em uso!" });
        }

        // Hashar da senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Criar objeto do usuário
        const data = {
            name,
            email,
            password: hashedPassword
        };

        // Criar o usuário
        const user = await UserModel.create(data);

        return res.status(201).json({
            message: "Usuário criado com sucesso",
            user
            });
        }catch (error) {
            console.error("Erro ao criar um novo usuário:", error);
            res.status(500).json({ error: "Erro ao criar um novo usuário" });
    }
  }

  async login(req, res) {
    try {
        const { email, password } = req.body;

              //Validação básica
              if ( !email || !password) {
                return res.status(400).json({ error: "Os campos nome, email e senha são obrigatórios" });
        } 

         // Verificar se o usuario existe
         const userExists = await UserModel.findByEmail(email);
         if (!userExists) {
             return res.status(400).json({ error: "Credenciais inválidas" });
         }

        // Verificar senha
        const isPassawordValid = await bcrypt.compare(password, userExists.password);
        if (!isPassawordValid) {
            return res.status(400).json({ error: "Credenciais inválidas" });
        }

// Gerar token JWT
const token =jwt.sign(
  {
    id:userExists.id,
    name: userExists.name, 
    email: userExists.email

  },
process.env.JWT_SECRET,
{
  expiresIn: "24h"
}
);

return res.status(200).json({
  message: "Login realizado com sucesso",
  token,
  userExists,
});
      }catch (error) {
        console.error("Erro ao fazer login:", error);
        res.status(500).json({ error: "Erro ao fazer login" });
      }
    }
  }

export default new AuthController();