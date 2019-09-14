const App = require('./App.js');

const port = process.env.PORT || 8080;

// Start server
(new App()).start(port);
