import { Request, Response } from "express";
import { prisma } from "../utils/context";

export class PositionService {
  createPosition = async (req: Request, res: Response) => {
    const { name, description, createdBy } = req.body;
    try {
      const checkExistance = await prisma.position.findUnique({
        where: {
          name,
        },
        select: {
          id: true,
          name: true,
        },
      });

      if (checkExistance) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: "Position name already exists",
          data: null,
        });
      }

      const response = await prisma.position.create({
        data: {
          name,
          description,
          createdBy,
        },
      });

      const data = await prisma.position.findMany({
        orderBy: {
          id: "desc",
        },
        select: {
          id: true,
          name: true,
          description: true,
          users: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
      res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Position Created Succesfully",
        data: data,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Position failed to create",
        data: null,
        error: error.message,
      });
    }
  };

  updatePosition = async (req: Request, res: Response) => {
    const { id, name, description, updatedBy, assignedUsers } = req.body;
    try {
      const response = await prisma.position.update({
        where: {
          id,
        },
        data: {
          name,
          description,
          updatedBy,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          name: true,
          description: true,
          users: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Position updated Succesfully",
        data: response,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Position failed to update",
        data: null,
        error: error.message,
      });
    }
  };

  listAllPosition = async (req: Request, res: Response) => {
    try {
      const data = await prisma.position.findMany({
        orderBy: {
          id: "desc",
        },
        select: {
          id: true,
          name: true,
          description: true,
          users: {
            select: {
              id: true,
              name: true,
              email: true,
              photo: true,
            },
          },
        },
      });
      res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Operation Successful",
        data: data,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Position failed to fetch",
        data: null,
        error: error.message,
      });
    }
  };
  getPosition = async (req: Request, res: Response) => {
    try {
      const { id } = req.query;
      const data = await prisma.position.findUnique({
        where: {
          id: Number(id),
        },
        select: {
          id: true,
          name: true,
          description: true,
          users: {
            select: {
              id: true,
              name: true,
              email: true,
              photo: true,
            },
          },
        },
      });

      if (!data) {
        res.status(404).json({
          success: false,
          statusCode: 404,
          message: "Position Id not found",
          data: data,
        });
      }
      res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Operation Successful",
        data: data,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Position failed to fetch",
        data: null,
        error: error.message,
      });
    }
  };

  assignpositionToUser = async (req: Request, res: Response) => {
    const { assignedUsers, position_id } = req.body;
    try {
      const checkExistance = await prisma.users.findMany({
        where: {
          email: {
            in: assignedUsers,
          },
        },
        select: {
          id: true,
          email: true,
        },
      });
      if (!checkExistance) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: "User Not found",
          data: null,
        });
      }
      const assign = await prisma.users.updateMany({
        where: {
          email: {
            in: assignedUsers,
          },
        },
        data: {
          positionId: Number(position_id),
        },
      });
      res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Operation Successful",
        data: assign,
      });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Failed to assign position to Users",
        data: null,
        error: error.message,
      });
    }
  };

  deleteposition = async (req: Request, res: Response) => {
    const { id } = req.query;
    try {
      await prisma.users.updateMany({
        where: {
          positionId: Number(id),
        },
        data: {
          positionId: null,
        },
      });
      const deleteAccess = await prisma.position.delete({
        where: { id: Number(id) },
      });
      if (!deleteAccess) {
        res.status(404).json({
          success: false,
          statusCode: 404,
          message: "Invalid Access Level Id",
          data: null,
        });
      }
      this.listAllPosition(req, res);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Failed to delete Access Level",
        data: null,
        error: error.message,
      });
    }
  };
}
