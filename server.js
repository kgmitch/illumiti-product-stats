var express = require('express');
var app = express();
const compression = require('compression');
var PORT = process.env.PORT || 59000;

let url = process.env.LB_URL || "http://localhost:" + PORT;

app.use(compression());
app.use('/webapp', express.static('webapp'));

app.listen(PORT, function () {
    console.log('Product Stats app listening on port ' + PORT);
});
