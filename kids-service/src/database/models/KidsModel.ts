import mongoose, { Schema, Document } from "mongoose";

enum Preferences {
    Adventure = "Adventure",
    Fantasy = "Fantasy",
    ScienceFiction = "Science Fiction",
    Mystery = "Mystery",
    Friendship = "Friendship",
}

enum Gender {
    Male = "Male",
    Female = "Female",
}

export interface IKid extends Document {
    name: string;
    dateOfBirth: Date;
    parentId: string;
    institutionId: string;
    preferences: Preferences[];
    gender: Gender;
}

const KidSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        dateOfBirth: { type: Date, required: true },
        parentId: {
            type: String,
            required: false,
        },
        institutionId: {
            type: String,
            required: false,
        },
        preferences: {
            type: [String],
            enum: Object.values(Preferences), // Enforces only values from Preferences
            default: [], // Default to an empty array if no preferences are specified
        },
        gender: {
            type: String,
            enum: Object.values(Gender), // Restrict to Gender enum values
            required: true, // Gender is required
        },
    },
    {
        timestamps: true,
    }
);

const Kid = mongoose.model<IKid>("Kid", KidSchema);
export default Kid;
