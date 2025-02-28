import { generateTokenandSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';

export const signUp = async (req, res) => {
    try {
        const {  fullname, email, password } = req.body;
        
      if(!fullname || !email || !password) {
        return res.status(400).json({ error: 'Please fill in all fields' });
      }

// Validate email format
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
}


// Check if email already exists
const userEmailExist = await User.findOne({ email });
if (userEmailExist) {
    return res.status(400).json({ error: 'Email already exists' });
}

// Validate password length
if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
}

// Hash the password
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

// Create a new user in the database
const user = await User.create({
    fullname,
    email,
    password: hashedPassword,
});

if (user) {
    generateTokenandSetCookie(user._id, res);

    await user.save();
    res.status(201).json({
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        profileImg: user.profileImg,
        coverImg: user.coverImg,
    });
    // res.status(400).json({ message: 'Account created successfully!' });
} else {
    res.status(400).json({ error: 'Invalid user data' });
}
    } catch (error) {
        console.log('Error', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const signIn = async (req, res) => {
   try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });;
    const isPasswordValid = await bcrypt.compare(password, user?.password || "");

    if (!user || !isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    generateTokenandSetCookie(user._id, res);

    res.status(201).json({
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        profileImg: user.profileImg,
        coverImg: user.coverImg,
        followers: user.followers,
        following: user.following,
    });

   } catch (error) {
    console.log('Error', error);
    res.status(500).json({ error: 'Internal Server Error' });
   }
}

export const logout = async (req, res) => {
    try {
         res.cookie("jwt", "", {maxage:0})
         res.status(200).json({message: 'Logged out successfully'})
    } catch (error) {
        console.log('Error', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user)
    } catch (error) {
        console.log('Error', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}