const check_if_user_existe = async (email) => {
  try {
    const user = await UserModule.findOne({ email });
    if (user) {
      return true; 
    } else {
      return false; 
    }
  } catch (error) {
    return false; 
  }
};

module.exports = { check_if_user_existe };
