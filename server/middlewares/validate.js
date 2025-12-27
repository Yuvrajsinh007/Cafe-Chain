exports.validatePhoneNumber = (req, res, next) => {
    const { phone } = req.body;
    const regex = /^[6-9]\d{9}$/;
    if (!regex.test(phone)) {
        return res.status(400).json({ error: "Invalid phone number" });
    }
    next();
};

exports.validateEmail = (req, res, next) => {
    const { email } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }
    next();
};