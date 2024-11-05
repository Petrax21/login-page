const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
require('dotenv').config();

// E-posta doğrulama kodu gönder
async function sendVerificationEmail(email, verificationLink) {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'E-posta Doğrulaması',
        text: `Lütfen hesabınızı doğrulamak için şu linke tıklayın: ${verificationLink}`
    });
}

// Kayıt olma işlemi
exports.register = async (req, res) => {
    const { username, firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationLink = `http://localhost:${process.env.PORT}/auth/verify-email?email=${email}`;

    try {
        const user = await User.createUser({ username, firstName, lastName, email, password: hashedPassword });
        await sendVerificationEmail(email, verificationLink);
        res.json({ success: true, message: "Doğrulama e-postası gönderildi." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// E-posta doğrulama işlemi
exports.verifyEmail = async (req, res) => {
    const { email } = req.query;
    await User.verifyUser(email);
    res.redirect('/login');
};

// Giriş işlemi
exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);

    if (!user || !user.is_verified || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ success: false, message: 'Geçersiz giriş bilgileri veya hesap doğrulanmadı.' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true }).json({ success: true });
};
