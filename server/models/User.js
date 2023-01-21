import { Schema, model } from "mongoose"

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "You need to use a valid email."],
    required: true,
    lowercase: true,
    trim: true,
  },
  //   profileImg: {
  //     type: String,
  //     default:
  //       "https://res.cloudinary.com/dxxmsbtrt/image/upload/v1650390383/MovieScreen/Users/avatar-profile_af3anp.webp",
  //   },
  country: String,
  genres: [String],
  about: { type: String, default: "I love movies" },
  //   followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  //   follows: [{ type: Schema.Types.ObjectId, ref: "User" }],
  //   favorites: [{ type: Schema.Types.ObjectId, ref: "Movie" }],
  //   reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  //   posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
})

export const User = model("User", userSchema)
