const User = require("../models/Users")

exports.signupService = async (userInfo) => {
    const user = await User.create(userInfo);
    return user;
}


exports.findUserByEmail = async (email) => {
    return await User.findOne({ email });
};
// return await User.findOne({ email: email });

exports.findUserByToken = async (token) => {
    return await User.findOne({ confirmationToken: token });
};