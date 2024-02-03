const express = require('express');
const router = express.Router();
const registerController = require('../Controllers/registerController');
const accountController = require('../Controllers/accountController');
const authMiddleware = require('../middlewares/middleware');

router.post('/user/signup', registerController.signup);
router.post('/user/signin', registerController.signin);

router.get('/user/me', authMiddleware, registerController.me);

router.put('/user/update/:id', authMiddleware, registerController.update);
router.get('/user/bulk', authMiddleware, registerController.bulk);

router.get('/user/account/balance', authMiddleware, accountController.balance);
router.post('/user/account/transfer', authMiddleware, accountController.transfer);

module.exports = router;
