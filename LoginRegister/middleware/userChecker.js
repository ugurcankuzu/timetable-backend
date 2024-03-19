const UserModule = require('../models/userModule'); 

const check_if_user_existe = async (email) => {
  try {
    
    const user = await UserModule.findOne({ email });

    
    return !!user;
  } catch (error) {
    console.error("check_if_user_existe error:", error);
    return false;
  }
};

module.exports = { check_if_user_existe };
