var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.sendFile(__dirname + '/webapp/index.html');
});

router.use('/webapp', express.static('webapp'));

module.exports = router;