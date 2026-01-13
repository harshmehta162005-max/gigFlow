const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);

      // ❌ Cookie hata di
      // ✅ Token direct bhej rahe hain
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: token, // <--- YE ZAROORI HAI
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // ... user check logic same ...
    const user = await User.create({ name, email, password });

    if (user) {
      const token = generateToken(user._id);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: token, // <--- YE ZAROORI HAI
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// logoutUser bas empty response bhejega
const logoutUser = (req, res) => {
  res.status(200).json({ message: 'Logged out' });
};

module.exports = { registerUser, loginUser, logoutUser };