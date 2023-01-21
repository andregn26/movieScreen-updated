import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    //Request from de body
    const { username, password, email, country, genres, about } = req.body
    //Info for confirmation
    if (!email || !password || !username) {
      res.status(400).json({ message: "missing fields" })
      return
    }
    //Checks if username already exists in DB
    const foundUser = await User.findOne({ username: username })
    if (foundUser) {
      res.status(400).json({ message: "user already exists" })
      return
    }
    //Add salt to password
    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(password, salt)
    //Create User and save it in the DB
    const newUser = new User({
      username,
      email,
      password: passwordHash,
      country,
      genres,
      about,
    })
    const savedUser = await newUser.save()
    //Response with the saved User
    res.status(201).json(savedUser)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email: email })
    if (!user) return res.status(400).json({ msg: "User does not exist. " })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "6h",
    })
    delete user.password
    res.status(200).json({ token, user })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
