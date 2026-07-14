const { registerUser, loginUser, resetPassword, getCurrentUser, updateProfile } = require('../config/store');

async function register(req, res) {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'Please fill in all fields.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    const result = await registerUser({ fullName, email, password });
    return res.status(201).json({ success: true, message: 'Account created successfully.', ...result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const result = await loginUser(email, password);
    return res.json({ success: true, message: 'Login successful.', ...result });
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please enter your email.' });
    }

    const result = await resetPassword(email);
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

async function me(req, res) {
  try {
    const user = await getCurrentUser(req.user.id);
    return res.json({ success: true, user });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

async function updateProfileHandler(req, res) {
  try {
    const user = await updateProfile(req.user.id, req.body);
    return res.json({ success: true, user });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

module.exports = { register, login, forgotPassword, me, updateProfileHandler };
