import User from '../models/userModel.js';
import { createOne, deleteOne, getAll, getOne, updateOne } from './baseController.js';

// export const userCreate = createOne(User);
export const userUpdate = updateOne(User);
export const getAllUser = getAll(User);
export const getOneUser = getOne(User);
export const userDelete = deleteOne(User);

export async function Login(req, res, next) {
  try {
    const data = req.body;

    const randomId = Math.random().toString(30).substring(2, 10) + Math.random().toString(30).substring(2, 10);
    const user = await User.findOne({ mobileNumber: data.mobileNumber });
    if (user) {
      const userLogin = await User.findById(user?._id);

      const updateToken = await User.findByIdAndUpdate(
        { _id: user?._id },
        {
          sessionId: randomId,
          fcmToken: data.fcmToken,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      res.status(200).json({
        status: 'Success',
        message: 'Login Successfully',
        userLogin,
      });
    } else {
      res.status(400).json({
        status: 'Bad request',
        message: 'Invalid Credential',
      });
    }
  } catch (err) {
    next(err);
  }
}
export async function userCreate(req, res, next) {
  try {
    const data = req.body;

    const existUser = await User.find({ mobileNumber: data.mobileNumber });
    const randomId = Math.random().toString(30).substring(2, 10) + Math.random().toString(30).substring(2, 10);
    if (existUser.length === 0) {
      const createUser = await User.create({
        name: data.name,
        email: data.email,
        mobileNumber: data.mobileNumber,
        role: data.role,
        sessionId: randomId,
        fcmToken: data.fcmToken,
      });

      res.status(201).json({
        status: 'Created',
        message: 'User Created',
        createUser,
      });
    } else {
      res.status(208).json({
        message: 'User Already Exist',
        existUser,
      });
    }
  } catch (err) {
    next(err);
  }
}

export async function OTPVerification(req, res, next) {
  try {
    const userId = req.params.id;
    const Otpverify = await User.findById(userId);

    res.status(200).json({
      status: 'success',
      message: 'OTP Verfied Success',
      Otpverify,
    });
  } catch (err) {
    next(err);
  }
}
