import { Request, Response } from "express";
import { Kid } from "../database"; // Update the path based on your project structure
import { ApiError } from "../utils";
import { AuthRequest } from "../middleware";

const addKid = async (req: AuthRequest, res: Response) => {
    try {
        const { name, dateOfBirth, institutionId, preferences, parentId, gender } = req.body;

        const newKid = await Kid.create({
            name,
            dateOfBirth,
            parentId,
            institutionId,
            preferences,
            gender, // Add gender
        });

        return res.json({
            status: 200,
            message: "Kid added successfully!",
            data: newKid,
        });
    } catch (error: any) {
        return res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
};

const updateKid = async (req: AuthRequest, res: Response) => {
    try {
        const { kidId } = req.params;
        const { name, dateOfBirth, institutionId, preferences, gender } = req.body;

        // Ensure the user can only update their own kids
        const parentId = req.user;

        const updatedKid = await Kid.findOneAndUpdate(
            { _id: kidId, parentId },
            { name, dateOfBirth, institutionId, preferences, gender }, // Include gender
            { new: true, runValidators: true } // Returns the updated document
        );

        if (!updatedKid) {
            throw new ApiError(404, "Kid not found or you do not have permission to update this kid.");
        }

        return res.json({
            status: 200,
            message: "Kid updated successfully!",
            data: updatedKid,
        });
    } catch (error: any) {
        return res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
};
const getKids = async (req: AuthRequest, res: Response) => {
    try {
        const { institutionId } = req.query;

        // Filter by the authenticated user's ID and optional institutionId
        const parentId = req.user;
        const query: any = { parentId };
        if (institutionId) query.institutionId = institutionId;

        const kids = await Kid.find(query);

        return res.json({
            status: 200,
            message: "Kids retrieved successfully!",
            data: kids,
        });
    } catch (error: any) {
        return res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
};

const deleteKid = async (req: AuthRequest, res: Response) => {
    try {
        const { kidId } = req.params;

        // Ensure the user can only delete their own kids
        const parentId = req.user;

        const deletedKid = await Kid.findOneAndDelete({ _id: kidId, parentId });

        if (!deletedKid) {
            throw new ApiError(404, "Kid not found or you do not have permission to delete this kid.");
        }

        return res.json({
            status: 200,
            message: "Kid deleted successfully!",
            data: deletedKid,
        });
    } catch (error: any) {
        return res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
};

export default {
    addKid,
    updateKid,
    getKids,
    deleteKid,
};
