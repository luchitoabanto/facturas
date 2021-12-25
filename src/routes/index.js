const { Router } = require('express');
const router = Router();

const { postAgregar,mensaje} = require('../controllers/index.controller');


router.post('/agregar', postAgregar);
router.post('/send', mensaje);
router.get('/', (req, res)=>{
  res.send('Hola Mundo');
});

module.exports = router;














