import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const messageSchema = new Schema(
  {
    id: { type: Number, required: true },
    role: { type: String, enum: ["user", "assistant"], required: true },
    text: { type: String, required: true, maxlength: 20_000 },
  },
  { _id: false },
);

const conversationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    intent: { type: String, enum: ["Buy", "Sell"], required: true },
    stock: {
      trading_symbol: { type: String, required: true, trim: true },
      name: { type: String, required: true, trim: true },
    },
    holdingPeriod: { type: String, required: true, trim: true },
    messages: { type: [messageSchema], required: true, default: [] },
  },
  { timestamps: true },
);

conversationSchema.index({ userId: 1, updatedAt: -1 });

export type ConversationDocument = InferSchemaType<typeof conversationSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Conversation: Model<ConversationDocument> =
  (mongoose.models.Conversation as Model<ConversationDocument>) ??
  mongoose.model<ConversationDocument>("Conversation", conversationSchema);
