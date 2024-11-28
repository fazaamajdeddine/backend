import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../database";
import { ApiError, encryptPassword, isPasswordMatch } from "../utils";
import config from "../config/config";
import { IUser } from "../database";

const jwtSecret = config.JWT_SECRET as string;
const COOKIE_EXPIRATION_DAYS = 90; // Cookie expiration in days
const expirationDate = new Date(
    Date.now() + COOKIE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000
);
const cookieOptions = {
    expires: expirationDate,
    secure: false,
    httpOnly: true,
    path: "/", // Allow the cookie to be sent to all routes
};

const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { firstName, lastName, role, email, password } = req.body;

        if (!firstName || !lastName || !role || !email || !password) {
            throw new ApiError(400, "All fields are required");
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            throw new ApiError(400, "User already exists!");
        }

        const user = await User.create({
            firstName,
            lastName,
            role,
            email,
            password: await encryptPassword(password),
        });

        const userData = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            email: user.email,
        };

        res.json({
            status: 200,
            message: "User registered successfully!",
            data: userData,
        });
    } catch (error: any) {
        res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
};

const createSendToken = async (user: IUser, res: Response) => {
    const { id, firstName, lastName, email, role } = user;

    const token = jwt.sign(
        { id, firstName, lastName, email, role },
        jwtSecret,
        { expiresIn: "1d" }
    );

    if (config.env === "production") cookieOptions.secure = true;
    res.cookie("jwt", token, cookieOptions);

    return token;
};

const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new ApiError(400, "Email and password are required");
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user || !(await isPasswordMatch(password, user.password as string))) {
            throw new ApiError(400, "Incorrect email or password");
        }

        const token = await createSendToken(user!, res);

        res.json({
            status: 200,
            message: "User logged in successfully!",
            token,
        });
    } catch (error: any) {
        res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
};

// Fetch current user
const currentUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            throw new ApiError(401, "Not authenticated");
        }

        const decoded: any = jwt.verify(token, jwtSecret);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        res.json({
            status: 200,
            data: user,
        });
    } catch (error: any) {
        res.status(401).json({
            status: 401,
            message: error.message || "Authentication failed",
        });
    }
};

// Logout user
const logout = (req: Request, res: Response): void => {
    res.clearCookie("jwt", {
        httpOnly: true,
        secure: false,
        path: "/",
    });

    res.json({
        status: 200,
        message: "Logged out successfully!",
    });
};

export default {
    register,
    login,
    currentUser,
    logout,
};
