import { Request, Response } from "express";
import { prisma } from "../utils/context";
import JWT from "jsonwebtoken";
import { comparePassword, hashPassword } from "../utils/hashPasswords";

const JWT_SECRET: any = process.env.JWT_SECRET;

export class UserService {
  createUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const user = await prisma.users.create({
      data: {
        email,
        name,
        password: await hashPassword(password),
      },
    });
    return res.status(201).json({ msg: "User created successfully", user });
  };

  loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const existance: any = await prisma.users.findUnique({
        where: {
          email,
        },
      });

      if (!existance) {
        return res
          .status(404)
          .json({ message: "Invalid Email or Password", data: null });
      }

      if (await comparePassword(password, existance?.password)) {
        const token = JWT.sign(
          {
            id: existance.id,
            name: existance.name,
            email: existance.email,
          },
          JWT_SECRET,
          {
            expiresIn: "12h",
          }
        );

        return res
          .status(200)
          .json({ status: "Login Successfully", token: token });
      } else {
        return res
          .status(401)
          .json({ message: "Invalid Email or Password", data: null });
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  getUser = async (req: Request, res: Response) => {
    const { email }: any = req.query;
    try {
      const existance: any = await prisma.users.findUnique({
        where: {
          email: email,
        },
        select: {
          name: true,
          email: true,
          id: true,
        },
      });
      if (!existance) {
        return res.status(404).json({ message: "User Not Found", data: null });
      }
      return res
        .status(200)
        .json({ message: "Operation Successful", data: existance });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
}
