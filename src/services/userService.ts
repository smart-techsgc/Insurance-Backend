import { Request, Response } from "express";
import { prisma } from "../utils/context";
import JWT from "jsonwebtoken";
import speakeasy from "speakeasy";
import { sendEmail } from "../utils/emailService";
import {
  UserInterface,
  UserResponse,
} from "../utils/Interfaces/userInterfaces";
import { userSchema } from "../utils/Validators/userValidator";
import { stringify } from "querystring";
import { otpTemplate } from "../utils/emailTemplates/OTPTemplate";
import { generateQR } from "../utils/qr-codeGenerator";
import { userTemplate } from "../utils/emailTemplates/createUserTemplate";
import uploadFile from "../utils/upload";

const JWT_SECRET: any = process.env.JWT_SECRET;

export class UserService {
  createUser = async (req: Request, res: Response) => {
    try {
      const {
        email,
        createdBy,
        userType,
        firstName,
        lastName,
        otherName,
        dateOfBirth,
        gender,
        maritalStatus,
        nationality,
        phone,
        photo,
        address,
        accessLevelId,
      }: UserInterface = req.body;
      const checkExistance = await prisma.users.findUnique({
        where: {
          email,
        },
      });

      if (checkExistance) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: "User Already Exists",
          data: null,
        });
      }

      const secret = speakeasy.generateSecret({
        length: 20,
        name: `SGC-Insurance (${email})`,
        issuer: "SGC-Insurance",
      });
      const user = await prisma.users.create({
        data: {
          email,
          name: `${firstName} ${otherName} ${lastName}`,
          createdBy: Number(createdBy),
          userType,
          accessLevelId: Number(accessLevelId),
          employeeInfo: {
            create: {
              firstName,
              lastName,
              otherName,
              address,
              dateOfBirth,
              gender,
              maritalStatus,
              nationality,
              phone,
              photo,
            },
          },
          mfa: {
            create: {
              mfaSecret: secret.base32,
              mfaQrCode: await generateQR(secret.otpauth_url),
              mfaEnabled: false,
            },
          },
        },
        select: {
          employeeInfo: true,
        },
      });
      const emailData = {
        name: `${firstName}`,
      };

      // Send OTP to user
      sendEmail(userTemplate(emailData), email, "OTP");
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "User Created successfully",
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
        data: null,
        error: error.message,
      });
    }
  };

  updateUser = async (req: Request, res: Response) => {
    try {
      const {
        email,
        createdBy,
        userType,
        firstName,
        lastName,
        otherName,
        dateOfBirth,
        gender,
        maritalStatus,
        nationality,
        phone,
        photo,
        address,
        updatedBy,
        accessLevelId,
      }: UserInterface = req.body;
      const user = await prisma.users.update({
        where: {
          email,
        },
        data: {
          email,
          name: `${firstName} ${otherName} ${lastName}`,
          userType,
          accessLevelId: Number(accessLevelId),
          updatedBy: Number(updatedBy),
          updatedAt: new Date(),
          employeeInfo: {
            update: {
              firstName,
              lastName,
              otherName,
              address,
              dateOfBirth,
              gender,
              maritalStatus,
              nationality,
              phone,
              photo,
            },
          },
        },
        include: {
          employeeInfo: true,
        },
      });
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "User updated successfully",
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
        data: null,
        error: error.message,
      });
    }
  };
  deleteUser = async (req: Request, res: Response) => {
    try {
      const { email, updatedBy }: UserInterface = req.body;
      const user = await prisma.users.update({
        where: {
          email,
          updatedAt: new Date(),
          updatedBy,
        },
        data: {
          active: false,
        },
        include: {
          employeeInfo: true,
        },
      });
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "User archived successfully",
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
        data: null,
        error: error.message,
      });
    }
  };

  toggleUserStatus = async (req: Request, res: Response) => {
    try {
      const { email }: any = req.query;
      const existingUser = await prisma.users.findUnique({
        where: {
          email: String(email),
        },
      });

      if (!existingUser) {
        return res.status(404).json({
          sucess: false,
          statusCode: 404,
          message: "No User Found",
          data: null,
        });
      }

      const user = await prisma.users.update({
        where: {
          email,
        },
        data: {
          active: !existingUser.active,
          updatedAt: new Date(),
        },
        include: {
          employeeInfo: true,
        },
      });

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "User archived successfully",
        data: user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
        data: null,
        error: error.message,
      });
    }
  };

  loginUser = async (req: Request, res: Response) => {
    const { email }: UserInterface = req.body;
    try {
      const existance: { id: number; name: string; email: string } =
        await prisma.users.findUnique({
          where: {
            email,
          },
          select: {
            id: true,
            name: true,
            email: true,
          },
        });
      if (!existance) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: "Invalid Email",
          data: null,
        });
      }

      const otpExistance = await prisma.otp.findUnique({
        where: {
          email,
        },
      });

      if (otpExistance) {
        let otp = speakeasy.totp({
          secret: otpExistance.otp,
          encoding: "base32",
        });

        const emailData = {
          name: existance.name,
          otp,
        };

        // Send OTP to user
        sendEmail(otpTemplate(emailData), email, "OTP");
        return res.status(200).json({
          success: true,
          statusCode: 200,
          message: "OTP sent successfully",
          data: null,
        });
      }

      // Create OPT Secret
      const createSecret = await prisma.otp.create({
        data: {
          email,
          otp: speakeasy.generateSecret({ length: 20 }).base32,
        },
        select: {
          id: true,
          otp: true,
        },
      });

      // Generate OTP
      const otp = speakeasy.totp({
        secret: createSecret.otp,
        encoding: "base32",
      });
      const emailData = {
        name: existance.name,
        otp,
      };

      // Send OTP to user
      sendEmail(otpTemplate(emailData), email, "OTP");
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "OTP sent successfully",
        data: null,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
        data: null,
        error: error.message,
      });
    }
  };

  verifyOTP = async (req: Request, res: Response) => {
    const OTP_EXPIRATION_TIME = 300;
    const { email, otp }: { email: string; otp: string | number } = req.body;
    try {
      const existance: any = await prisma.otp.findUnique({
        where: {
          email,
        },
        select: {
          otp: true,
          user: {
            select: {
              id: true,
              active: true,
              email: true,
              name: true,
              userType: true,
              employeeInfo: {
                select: {
                  photo: true,
                },
              },
              accessLevel: {
                select: {
                  id: true,
                  name: true,
                  permissions: true,
                },
              },
              mfa: {
                select: {
                  mfaQrCode: true,
                  mfaEnabled: true,
                },
              },
            },
          },
        },
      });

      if (!existance) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: "Invalid Email",
          data: null,
        });
      }
      const currentTime = Date.now();
      if (currentTime - existance.createdAt > OTP_EXPIRATION_TIME * 1000) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: "OTP expired",
          data: null,
        });
      }

      const verified = speakeasy.totp.verify({
        secret: existance.otp,
        encoding: "base32",
        token: Number(otp),
        window: 1, // Accepts OTPs generated up to one time step before or after the current time
      });

      if (verified) {
        await prisma.otp.delete({
          where: {
            email,
          },
        });

        return res.status(200).json({
          success: true,
          statusCode: 200,
          message: "Login Successfull",
          data: {
            mfaQrCode: existance.user?.mfa?.mfaQrCode,
            mfaEnabled: existance.user?.mfa?.mfaEnabled,
          },
        });
      } else {
        res.status(404).json({
          success: false,
          statusCode: 404,
          message: "Invalid OTP",
          data: null,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
        data: null,
        error: error.message,
      });
    }
  };

  verifyMFA = async (req: Request, res: Response) => {
    const { email, token } = req.body;
    const existance: any = await prisma.users.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        active: true,
        email: true,
        name: true,
        userType: true,
        employeeInfo: true,
        accessLevel: {
          select: {
            id: true,
            name: true,
            permissions: true,
          },
        },
        mfa: {
          select: {
            mfaEnabled: true,
            mfaSecret: true,
          },
        },
      },
    });
    if (email === existance.email) {
      const verified = speakeasy.totp.verify({
        secret: existance.mfa.mfaSecret,
        encoding: "base32",
        token: Number(token),
        window: 1, // Accepts OTPs generated up to one time step before or after the current time
      });

      if (verified) {
        let onboarding = false;
        if (existance.employeeInfo.dateOfBirth == "null" || null) {
          onboarding = true;
        }
        const token = await this.generateToken({
          id: existance.id,
          name: existance.name,
          email: existance.email,
          photo: existance.employeeInfo?.photo,
          userType: existance.userType,
          accessLevel: existance.accessLevel,
          onboarding,
        });

        await prisma.mfa.update({
          where: {
            email,
          },
          data: {
            mfaEnabled: true,
          },
        });
        res.json({
          success: true,
          statusCode: 200,
          message: "MFA verified successfully",
          token,
        });
      } else {
        res.status(404).json({
          success: false,
          statusCode: 404,
          message: "Invalid Verification Code",
          data: null,
        });
      }
    } else {
      res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Invalid Email",
        data: null,
      });
    }
  };

  getUser = async (req: Request, res: Response) => {
    const { email }: any = req.query;
    try {
      const existance: any = await prisma.users.findUnique({
        where: {
          email: email,
        },
        include: {
          employeeInfo: true,
        },
      });
      if (!existance) {
        return res.status(404).json({
          sucess: false,
          statusCode: 404,
          message: "No User Found",
          data: null,
        });
      }
      return res.status(200).json({
        sucess: true,
        statusCode: 200,
        message: "Operation Successful",
        data: existance,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
        data: null,
        error: error.message,
      });
    }
  };

  listUsers = async (req: Request, res: Response) => {
    try {
      const { userType }: any = req.query;

      const existance: any = await prisma.users.findMany({
        where: {
          userType: userType,
          id: {
            not: 1,
          },
        },
        orderBy: {
          id: "desc",
        },
        include: {
          employeeInfo: true,
        },
      });
      if (!existance) {
        return res.status(404).json({
          sucess: false,
          statusCode: 404,
          message: "No User Found",
          data: null,
        });
      }
      return res.status(200).json({
        sucess: true,
        statusCode: 200,
        message: "Operation Successful",
        data: existance,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
        data: null,
        error: error.message,
      });
    }
  };

  uploadProfile = async (req: any, res: Response) => {
    try {
      const file: any = req?.file.path;
      const { email } = req.query;
      const existance: { id: number } = await prisma.users.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
        },
      });

      if (!existance) {
        return res.status(404).json({
          sucess: false,
          statusCode: 404,
          message: "No User Found",
          data: null,
        });
      }
      const user = await prisma.users.update({
        where: {
          email,
        },
        data: {
          employeeInfo: {
            update: {
              photo: await uploadFile(file, "profile/images"),
            },
          },
        },
        select: {
          id: true,
          email: true,
          name: true,
          userType: true,
          accessLevel: true,
          employeeInfo: true,
        },
      });

      let onboarding = false;
      if (user.employeeInfo.dateOfBirth == "null" || null) {
        onboarding = true;
      }

      const token = await this.generateToken({
        id: user.id,
        name: user.name,
        email: user.email,
        photo: user.employeeInfo?.photo,
        userType: user.userType,
        accessLevel: user.accessLevel,
        onboarding,
      });
      res.status(200).json({
        sucess: true,
        statusCode: 200,
        message: "Operation Successfull",
        data: { token },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
        data: null,
        error: error.message,
      });
    }
  };

  private generateToken = async (data) =>
    await JWT.sign(data, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
}
