const Path = require('path')
const SearchStream = require('../src/SearchStream')

exports.config = {
  routes: {
    post: {
      '/search': (req, res, next) => {
        const searchStream = new SearchStream(req.body)

        res.responsePromise = searchStream.getContent()
        next()
      }
    },
    get: {
      '/socket.io.js': (req, res) => {
        // set up route to serve socket.io client
        // you will need to change the path to match the route to your socket.io instance
        const path = Path.resolve(__dirname, '../node_modules/socket.io-client/dist/socket.io.js');
        res.sendFile(path);
      },
    }
  },
  socketEvents: {
    connection() {
      console.log('User connected');
    },
    disconnect() {
      console.log('User disconnected');
    }
  }
};