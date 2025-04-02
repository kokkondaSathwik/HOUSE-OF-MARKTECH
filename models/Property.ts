import mongoose from "mongoose"

const PropertySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

export default mongoose.models.Property || mongoose.model("Property", PropertySchema)

