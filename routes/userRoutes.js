import { Router } from 'express';
import { getAllUser, getOneUser, Login, OTPVerification, userCreate, userDelete, userUpdate } from '../controllers/userController.js';

const router = Router();

router.route('/').post(userCreate).get(getAllUser);
router.route('/:id').patch(userUpdate).delete(userDelete).get(getOneUser);
router.route('/login').post(Login);
router.route('/otp/verify/:id').patch(OTPVerification);


export default router;
