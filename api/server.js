const express = require('express');
const projectRouter = require('./projects/projects-router')
const actionRouter = require('./actions/actions-router')
const { projectLogger } = require('./projects/projects-middleware')
const { actionLogger } = require('./actions/actions-middlware')
const helmet = require('helmet')
const server = express();

// Configure your server here
// Build your actions router in /api/actions/actions-router.js
// Build your projects router in /api/projects/projects-router.js
// Do NOT `server.listen()` inside this file!

server.use(express.json())
server.use(projectLogger)
server.use(actionLogger)
server.use('/api/projects', projectRouter)
server.use('/api/actions', actionRouter)
server.use(helmet())

server.get('/', (req, res) => {
    res.send(`<h2>Let's write some middleware!</h2>`);
  });
  
module.exports = server;