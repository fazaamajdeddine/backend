import mongoose, { Schema, Document } from "mongoose";

enum Preferences {
    Adventure = "Adventure",
    Fantasy = "Fantasy",
    ScienceFiction = "Science Fiction",
    Mystery = "Mystery",
    Friendship = "Friendship"
}

export interface IKid extends Document {
    name: string,
    dateOfBirth: Date,
    parentId:string,
    institutionId:string,
    preferences:Preferences,
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
        }, // Optional for institutions
        preferences: {
            type: [String],
            enum: Object.values(Preferences), // Enforces that only values from the Preferences enum are allowed
            default: [] // Default to an empty array if no preferences are specified
        },
    },
    {
        timestamps: true,
    }
);

const Kid = mongoose.model<IKid>("Kid", KidSchema);
export default Kid;