const Action = require('./actions-model')

function actionLogger(req, res, next) {
  const timestamp = new Date().toLocaleString()
  const method = req.method
  const url = req.orignalUrl
  console.log('Reqtest Info:', {method: method, url: url, timestamp: timestamp})
  next()
}

async function validateActionId (req, res, next) {
  const { id } = req.params
  await Action.get(id)
    .then(action => {
      if (action) {
        req.action = action
        next()
      } else {
        next({
          status: 404,
          message: `No action with given id: ${id}.`
        })
      }
    })
    .catch(err => {
      next(err)
    })
}

async function validateAction (req, res, next) {
  // console.log(req.body)
  const { project_id, notes, description } = req.body
  if ((!notes || !description) || (!notes.trim() || !description.trim())) {
    res.status(400).json({
      message: "missing required notes or description field"
    })
  } else {
    req.project_id = project_id
    req.notes = notes.trim()
    req.description = description.trim()
    console.log({"project_id": req.project_id, "notes": req.notes, "description": req.description})
    next()
  }
}

const checkCompletedProject = (req, res, next) => {
  const { completed } = req.body;
if(completed !== true && completed !== false) {
      res.status(400).json({
      message: 'please provide a completion status'
      });
  } else {
      next();
  }
}

module.exports = {
    actionLogger,
    validateActionId,
    validateAction, 
    checkCompletedProject
}