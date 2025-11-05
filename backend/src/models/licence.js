import mongoose from "mongoose";

const licenseSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true, // identificador único
      unique: true,
    },
    originalName: {
      type: String,
      required: true
    },
    qrCode: {
      type: String, // base64 string do QR Code
      default: null
    },
    documentURL: {
      type: String, // link para PDF ou imagem final com QR
    },
    company: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true, // Ex: Publicidade, Alvará, etc.
    },
    location: {
      type: String,
    },
    documentOriginal: {
      type: String,
      required: true
    },
    validUntil: {
      type: Date,
      required: true, // validade do documento
    },
    state: {
      type: String,
      enum: ["active", "inactive", "revoked"],
      default: "active",
      set: v => (v ? v.trim().toLowerCase() : "active") //normaliza automático
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // admin que criou
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("License", licenseSchema);
