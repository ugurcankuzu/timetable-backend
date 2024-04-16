const UserModule = require("../models/userModule");
const { hash_password, password_checker } = require("../middleware/password");
const { check_if_user_existe } = require("../middleware/userChecker");
const config = require("../config/crypto");
const jwt = require("jsonwebtoken");

const get_all_users = async (req, res) => {
  try {
    const users = await UserModule.find({});
    if (users.length < 1) {
      return res.status(404).json({ success: false, msg: "non users fund" });
    }
    res.json({ success: true, users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};

const add_user = async (req, res) => {
  try {
    let { email, password, name, surname } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, mes: "Email and password are required" });
    }

    // Email'in varlığını kontrol et
    const userExists = await check_if_user_existe(email);

    if (userExists) {
      return res
        .status(400)
        .json({ success: false, msg: "User with this email already exists" });
    }

    // Şifreyi hash'le
    password = hash_password(password);

    // Yeni bir UserModule oluştur
    const newUser = new UserModule({ email, password, name, surname });

    // Veritabanına kaydet
    await newUser.save();

    res.json({ success: true, user: newUser });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const get_one_user = async (req, res) => {
  try {
    const id = req.params.id; 
    const user = await UserModule.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }
    res.json({
      success: true,
      user: {
        email: user.email,
        id: user._id,
        status: user.status,
        name: user.name,
        surname: user.surname,
        schedule: user.schedule || null
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: `Error fetching user with id: ${id}`,
    });
  }
};


const login_user = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kullanıcıyı veritabanında bul
    const user = await UserModule.findOne({ email });

    // Kullanıcı yoksa 404 dön
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    // Şifreyi kontrol et
    const passwordChecker = await password_checker(password, user.password);
    if (!passwordChecker) {
      return res
        .status(401)
        .json({ success: false, msg: "Incorrect password" });
    }

    // Kullanıcı doğrulandı, JWT oluşturulacak
    const token = jwt.sign(
      { id: user._id, role: user.role },
      config.TOKEN_KEY,
      { expiresIn: "1d", algorithm: "HS256" }
    );

    // Oluşturulan token, kullanıcıya geri gönderiliyor
    res.status(200).json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

const update_user = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(403).json({ success: false, msg: "you have to login" });
    }
    let body = req.body;

    if (body.password) {
      body.password = hash_password(body.password);
    }
    const UpdatedUserID = req.session.user.userID;

    const user = await UserModule.findById(UpdatedUserID);
    if (!user) {
      return res.status(404).json({ success: false });
    }
    const newUserData = await UserModule.findByIdAndUpdate(
      UpdatedUserID,
      body,
      {
        runValidators: true,
        new: true,
      }
    );
    res.json({ newUserData });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

const delete_user = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(403).json({ success: false, msg: "you have to login" });
    }
    const deletetedUserID = req.session.user.userID;
    const { id: userID } = req.body;

    if (deletetedUserID != userID) {
      return res
        .status(403)
        .json({ success: false, msg: "you don't have permission to do that" });
    }
    const user = await UserModule.findByIdAndDelete(userID);
    if (!user) {
      return res.status(404).json({ success: false, mes: "user not fund" });
    }
    res.json({ success: true, msg: "user deleted" });
  } catch (error) {
    res.status(500).json({ success: false, msg: "server error" });
  }
};

const logout = (req, res) => {
  try {
    req.session.destroy();
    res.json({ success: true, msg: "session destroyed" });
  } catch (error) {
    res.json({ success: false, msg: "faild to destroy swssion" });
  }
};
module.exports = {
  get_all_users,
  add_user,
  get_one_user,
  update_user,
  delete_user,
  login_user,
  logout,
};
