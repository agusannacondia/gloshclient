var express = require('express');
var app = express();

app.use(express.static('./dist/gloshclient'));

app.get('/*', function(req, res) {
  res.sendFile('index.html', {root: 'dist/gloshclient/'}
	);
});

app.listen(process.env.PORT || 4200);

