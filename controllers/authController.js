const User = require('../models/User');
const Blacklist = require('../models/Blacklist')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ลงทะเบียนผู้ใช้ใหม่
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // ตรวจสอบว่าผู้ใช้มีอยู่แล้วหรือไม่
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });

        const newUser = await user.save();
        const userResponse = {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email
        };
        return res.status(201).json(userResponse);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

// เข้าสู่ระบบผู้ใช้
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        // ส่งข้อมูล user บางส่วนกลับไปพร้อมกับ token
        res.json({ 
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ดึงข้อมูลผู้ใช้
const getUserInfo = async (req, res) => {
    const user_id = req.user.id;

    try {
        const user = await User.findById(user_id).select('-password'); // ไม่ส่งรหัสผ่านกลับไป
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const logout = async (req, res) => {
    try {
        // หากมีการใช้ Blacklist
        const token = req.headers['authorization']?.split(' ')[1];
        if (token) {
            await Blacklist.create({ token }); // บันทึก Token ใน Blacklist
        }

        res.status(200).json({ message: 'Successfully logged out' });
    } catch (err) {
        res.status(500).json({ message: 'Error logging out' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserInfo,
    logout
};
