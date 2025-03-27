import { getPublicKey, uploadPublicKey } from "../lib/s3.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";

export const googleSignInUp = async (req, res) => {
  const { fullName, email, publicKey, profilePic } = req.body;
  try {
    if (!fullName || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (user) {
      // generate jwt token here
      generateToken(user._id, res);
      const pubKey = await getPublicKey(user._id);

      console.log("pubKey", pubKey)

      return res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
        publicKey: pubKey
      });
    }

    if (!publicKey) {
      return res.status(400).json({ message: "Public key is required" });
    }

    const newUser = new User({
      fullName,
      email,
      profilePic,
    });

    if (newUser) {
      // generate jwt token here
      generateToken(newUser._id, res);

      // save public key on s3
      await uploadPublicKey(newUser._id, publicKey);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
        publicKey
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const pubKey = await getPublicKey(req.user._id);
    res.status(200).json({...req.user, publicKey: pubKey});
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPublicKeyByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const publicKey = await getPublicKey(userId);

    res.status(200).json({ publicKey });
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
