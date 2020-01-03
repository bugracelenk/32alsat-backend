const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/checkAuth");

const IlanControllers = require("../controllers/ilanlar");

router.get('/:limit/:skip', IlanControllers.get_ilanlar);
router.get('/:ilan_id', IlanControllers.get_ilan_by_id);
router.patch('/:ilan_id', checkAuth, IlanControllers.update_ilan);
router.patch('/like/:ilan_id', checkAuth, IlanControllers.like_ilan);
router.patch('/fav/:ilan_id', checkAuth, IlanControllers.ilan_favla);
router.post('/', checkAuth, IlanControllers.ilan_olustur);

module.exports = router;