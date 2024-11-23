import mongoose, { Schema, Document } from "mongoose";
import validator from "validator";



enum RoleType {
    Parent = 'Parent',
    Establishment = 'Establishment'
  }
export interface IUser extends Document {
    firstName: string;
    lastName: string;
    role: RoleType;
    email: string;
    password: string;
}

const UserSchema: Schema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        role: {
          type: String,
          required: true,
          enum: Object.values(RoleType),
        },
        email: {
          type: String,
          required: true,
          unique: true,
        },
        password: {
          type: String,
          required: true,
        },
      },
    {
        timestamps: true,
    }
);

const User = mongoose.model<IUser>("User", UserSchema);
export default User;