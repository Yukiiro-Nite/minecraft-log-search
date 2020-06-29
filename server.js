const expressStarter = require('express-starter')
const port = process.env.PORT || 3002

expressStarter.start(port,
  (express, app, io) => {
    // preload
    // set up routes and middleware before loading configs
    app.use((req, res, next) => {
      console.log(`Request @ ${req.originalUrl}`)
      next()
    });
    app.use(express.static('public'))
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
  },
  (express, app, io) => {
    // postload
    // could catch unhandled requests here
    app.use((req, res, next) => {
      if(res.responsePromise instanceof Promise) {
        res.responsePromise
          .then((response) => res.send(response))
          .catch((error) => res.status(500).send(error))
      } else {
        next()
      }
    })
  });