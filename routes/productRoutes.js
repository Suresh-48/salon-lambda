import { Router } from 'express';
import {
  productCategoriesList,
  productCreate,
  productDelete,
  productGetAll,
  productGetOne,
  productUpdate,
  updateProductOffer,
} from '../controllers/productController.js';

const router = Router();

router.route('/').post(productCreate).get(productGetAll);
router.route('/:id').patch(productUpdate).get(productGetOne).delete(productDelete);
router.route('/types/:id').get(productCategoriesList);
router.route('/update/offer/:id').patch(updateProductOffer)

export default router;
