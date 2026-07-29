import mongoose, { Schema, models, model, type Document } from "mongoose";

export interface IPaste extends Document {
  code: string;
  text: string;
  deleteAfterReading: boolean;
  createdAt: Date;
}

const PasteSchema = new Schema<IPaste>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      index: true,
      uppercase: true,
      trim: true,
    },
    text: {
      type: String,
      required: true,
    },
    deleteAfterReading: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Prevents "OverwriteModelError" during Next.js hot reloads in development.
export default (models.Paste as mongoose.Model<IPaste>) ||
  model<IPaste>("Paste", PasteSchema);
