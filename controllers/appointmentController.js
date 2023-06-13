import appointment from '../models/appointmentModel.js';
import moment from 'moment-timezone';
import User from '../models/userModel.js';
import sendNotification from '../notification.js';

export async function createAppointment(req, res, next) {
  try {
    const data = req.body;

    const existData = await appointment.find({
      $and: [{ date: data.date }, { userId: data.userId }, { time: data.time }],
    });

    const adminData = await User.findOne({ role: 'admin' });
    const userData = await User.findById(data.userId);

    let date = new Date();
    let bookingDate = new Date(data.date);
    const timeStamp = moment(date).utc().format();
    if (existData.length === 0) {
      const createData = await appointment.create({
        userId: data.userId,
        productId: data.productId,
        date: data.date,
        time: data.time,
        timeStamp: timeStamp,
        bookingDate: bookingDate,
      });

      const message = `Hello! Disco Salon, ${userData.name} has been booked for a time slot at ${createData.time} on the ${createData.date} `;

      const fcmToken = adminData.fcmToken;

      sendNotification(fcmToken, message);

      res.status(201).json({
        message: 'Appointment Successfully',
        createData,
      });
    } else {
      res.status(208).json({
        message: 'Already appointment created',
        existData,
      });
    }
  } catch (err) {
    next(err);
  }
}

export async function getMyBooking(req, res, next) {
  try {
    const userData = req.query;

    const data = await appointment.find({ userId: userData.userId }).populate('userId').populate('productId');

    res.status(200).json({
      message: 'Get customer booking details',
      data,
    });
  } catch (err) {
    next(err);
  }
}
export async function getAdminBooking(req, res, next) {
  try {
    const data = await appointment.find().populate('userId').populate('productId');

    res.status(200).json({
      message: 'Get admin booking details',
      data,
    });
  } catch (err) {
    next(err);
  }
}
export async function checkAppointment(req, res, next) {
  try {
    console.log("tesst......")
    const data = req.query;
    console.log("data.....", data)
    const datas = await appointment.find({ date: data.date });

    if (datas.length > 0) {
      const lastIndex = datas.length - 1;
      const lastTimestamp = new Date(datas[lastIndex].timeStamp);
      const sumOfTime = datas.reduce((sum, item) => sum + parseInt(item.time), 0);
      const currentTime = new Date();
      const newTimestamp = new Date(currentTime.getTime() + sumOfTime * 60000);
      const options = { hour: '2-digit', minute: '2-digit' };
      const time = newTimestamp?.toLocaleTimeString('en-US', options);
      const timeLeft = sumOfTime * 60;
      const currentDate = new Date();
      const givenDate = new Date(data.date);
      console.log("fiven date....", givenDate)


      res.status(200).json({
        message: 'Get schedule time successfully',
        data: {
          time,
          timeLeft,
        },
      });
    } else {
      const currentTime = new Date(); // Get the current time
      const options = { hour: '2-digit', minute: '2-digit' };
      const time = currentTime.toLocaleTimeString('en-US', options);
      const timeLeft = 0;

      const currentDate = new Date();

      console.log("current date.....", currentDate)
      const givenDate = new Date(data.date);

      console.log("fiven date....", givenDate)

// if (givenDate > currentDate) {
//   console.log('Given date is greater than the current date.');
// } else if (givenDate < currentDate) {
//   console.log('Given date is less than the current date.');
// } else {
//   console.log('Given date is the same as the current date.');
// }


      res.status(200).json({
        message: 'Get schedule time successfully',
        data: {
          time,
          timeLeft,
        },
      });
    }
  } catch (err) {
    next(err);
  }
}

export async function DateFilter(req, res, next) {
  try {
    const data = req.query;
    const fromDate = new Date(data.fromDate);
    const toDate = new Date(data.toDate);
    toDate.setDate(toDate.getDate() + 1);

    const filterData = await appointment
      .find({
        $or: [
          {
            $and: [{ bookingDate: { $gte: fromDate } }, { bookingDate: { $lte: toDate } }],
          },
        ],
      })
      .populate('userId')
      .populate('productId');
      

    res.status(200).json({
      status: 'success',
      message: 'success',
      filterData,
    });
  } catch (err) {
    next(err);
    console.log('err', err);
  }
}

export async function UserAppointmentList(req, res, next) {
  try {
    const userId = req.params.id;
    const data = await appointment.find({ userId: userId }).sort({ $natural: -1 });
    res.status(200).json({
      status: 'success',
      message: 'User Appoinment list',
      data,
    });
  } catch (err) {
    console.log('err', err);
    next(err);
  }
}

export async function UserBasedDateFilter(req, res, next) {
  try {
    const data = req.query;
    const userId = req.params.id;
    const fromData = new Date(data.fromDate);
    const toDate = new Date(data.toDate);
    const filterData = await appointment
      .find({ userId: userId, bookingDate: { $gte: fromData, $lte: toDate } })
      .populate('productId')
      .sort({ $natural: -1 });

    let totalAmount = 0;
    filterData.forEach((item) => {
      totalAmount += item.productId.totalAmount;
    });
    res.status(200).json({
      status: 'Success',
      message: 'User Details Filtered Successfully',
      filterData,
      totalAmount,
    });
  } catch (err) {
    next(err);
  }
}
