const User = require("../models/userModel");
const adminUser = require("../models/adminUserModel");
const teacherUser = require("../models/teacherUserModel");
const bcrypt = require("bcrypt");
const { sendmail } = require("../middleware/middleware");
const randomstring = require("randomstring")
const axios = require('axios')
const student_login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ msg: "Incorrect Username or Password", status: false });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ msg: "Incorrect Username or Password", status: false });
    }
    delete user.password
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

const teacher_login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await teacherUser.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

const student_register = async (req, res, next) => {
  try {
    const { username, email, password, mobile } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
      mobile
    });
    console.log(user)
    delete user.password;
    return res.json({ status: true, result: user });
  } catch (ex) {
    next(ex);
  }
};

const teacher_register = async (req, res, next) => {
  try {
    const { username, email, password, mobile } = req.body;
    const usernameCheck = await teacherUser.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await teacherUser.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await teacherUser.create({
      email,
      username,
      password: hashedPassword,
      mobile
    });
    console.log(user)
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

const admin_register = async (req, res, next) => {
  try {
    const { username, email, password, mobile } = req.body;
    const usernameCheck = await adminUser.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await adminUser.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await adminUser.create({
      email,
      username,
      password: hashedPassword,
      mobile
    });
    console.log(user)
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};
const admin_login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await adminUser.findOne({ username });
    if (!user) {
      return res.json({ msg: "Incorrect Username or Password", status: false });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ msg: "Incorrect Username or Password", status: false });
    }
    delete user.password
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};


const forgotPassword = async (req, resp) => {
  try {
    const email = req.body.email;
    let db = req.body.state
    let database;
    if (db == "User") {
      database = User
    }
    else if (db == "adminUser") {
      database = adminUser
    }
    else if (db == "teacherUser") {
      database == teacherUser
    }
    const userdata = await database.findOne({ email: email })
    if (userdata) {
      const string = randomstring.generate();
      console.log(string)
      const data = await database.updateOne({ email: email }, { $set: { randomstring: string } })
      console.log(data)
      sendmail(userdata.username, userdata.email, string, db)
      resp.status(200).send({ msg: "mail has been sent", status: 1 })
    }
    else {
      resp.status(200).send({ msg: "email not found", status: 0 })
    }
  } catch (error) {
    resp.status(400).send({ msg: error, status: 0 })
  }
}




const resetPassword = async (req, resp) => {
  try {
    const randomstring = req.body.string;
    let db = req.body.db
    let database;
    console.log(req.body)
    if (db == "User") {
      database = User
    }
    else if (db == "adminUser") {
      database = adminUser
    }
    else if (db == "teacherUser") {
      database == teacherUser
    }
    const data = await database.findOne({ randomstring: randomstring })
    if (data) {
      const password = req.body.newPassword;
      console.log(password)
      const salt = await bcrypt.genSalt(10);
      const newpassword = await bcrypt.hash(password, salt);
      await database.findByIdAndUpdate({ _id: data._id }, { $set: { password: newpassword, randomstring: '' } }, { new: true })
      resp.status(200).send({ msg: "password changed successfully" })
    }
    else {
      resp.status(200).send({ msg: "token expire" })
    }
  } catch (error) {
    resp.status(400).send({ msg: error })
  }
}

const changePassword = async (req, resp) => {
  try {
    const email = req.body.email;
    const oldpassword = req.body.oldpassword;
    const data = await signup.findOne({ email: email })
    const compare = await bcrypt.compare(oldpassword, data.password)

    if (data && compare) {

      const password = req.body.newpassword;
      const confirmpassword = req.body.confirmpassword;

      if (password === confirmpassword) {
        const salt = await bcrypt.genSalt(10);
        const newpassword = await bcrypt.hash(password, salt);
        await signup.findByIdAndUpdate({ _id: data._id }, { $set: { password: newpassword, } }, { new: true })
        resp.status(200).send({ msg: "password changed successfully", status: 1 })
      }
      else {
        resp.status(200).send({ msg: "password not matched", status: 0 })
      }
    }
    else {
      resp.status(200).send({ msg: "token expire", status: 0 })
    }
  } catch (error) {
    resp.status(400).send({ msg: error })
  }
}

module.exports = {
  student_login,
  teacher_login,
  student_register,
  teacher_register,
  admin_register,
  admin_login,
  forgotPassword,
  resetPassword,

}

