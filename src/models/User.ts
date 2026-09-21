import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      // Stored lowercase so "Rohit@x.com" and "rohit@x.com" are one account.
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
      // Never ships to the client by accident: excluded unless asked for
      // explicitly with .select("+passwordHash").
      select: false,
    },
    // There is no OTP step yet, so nobody has proved they own their address.
    // Kept here so adding verification later is a flag flip, not a migration.
    emailVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export type UserDocument = InferSchemaType<typeof userSchema> & {
  _id: mongoose.Types.ObjectId;
};

// Next hot-reloads modules in dev, and re-registering a model throws.
export const User: Model<UserDocument> =
  (mongoose.models.User as Model<UserDocument>) ??
  mongoose.model<UserDocument>("User", userSchema);
