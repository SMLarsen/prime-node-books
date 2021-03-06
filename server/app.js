var express =  require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var books = require('./routes/books');

app.use(bodyParser.urlencoded({ extended: true }));

// Our routes
app.use('/books', books);
console.log('using books');
// Catchall route
app.get('/', function (req, res) {
  res.sendFile(path.resolve('./server/public/views/index.html'));
});
// console.log('catchall route');
app.use(express.static('./server/public'));
// console.log('static');
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function () {
  console.log('Listening on port ', app.get('port'));
});
