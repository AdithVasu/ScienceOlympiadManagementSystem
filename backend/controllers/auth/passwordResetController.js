const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const requestPasswordReset = async (req, res) => {
    try {
        const { emailAddress } = req.body;
        if (!emailAddress) {
            return res.status(400).json({ error: "Email address is required." });
        }

        const user = await User.findOne({ emailAddress });
        if (!user) {
            return res.status(404).json({ error: "No account found with that email." });
        }

        const resetToken = crypto.randomBytes(64).toString("hex");
        
        user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordExpires = Date.now() + 3600000; 

        await user.save();

        // Build the URL link pointing to your local React + Vite frontend placeholder
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: `"Science Olympiad Platform" <${process.env.EMAIL_USER}>`,
            to: user.emailAddress,
            subject: "Science Olympiad - Password Reset Request",
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Password Reset Request</h2>
                    <p>Hello,</p>
                    <p>You requested a password reset for your Science Olympiad account.</p>
                    <p>Please click the button below to choose a new password. This link is valid for 1 hour:</p>
                    <div style="margin: 24px 0;">
                        <a href="${resetUrl}" target="_blank" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
                    </div>
                    <p>If the button doesn't work, copy and paste this URL into your browser:</p>
                    <p><a href="${resetUrl}" target="_blank">${resetUrl}</a></p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
                    <p style="color: #6b7280; font-size: 14px;">If you did not request this, you can safely ignore this email and your password will remain unchanged.</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: "Password reset link sent to email." });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({ error: "Token and new password are required." });
        }

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: "Invalid or expired reset token." });
        }


        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        
        await user.save();

        return res.status(200).json({ message: "Password updated successfully. You can now log in." });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

module.exports = { requestPasswordReset, resetPassword };