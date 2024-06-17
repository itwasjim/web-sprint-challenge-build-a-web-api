const Project = require('./projects-model')

function projectLogger(req, res, next) {
  const timestamp = new Date().toLocaleString()
  const method = req.method
  const url = req.orignalUrl
  console.log('Reqtest Info:', {method: method, url: url, timestamp: timestamp})
  next()
}

async function validateProjectId (req, res, next) {
    const { id } = req.params
    await Project.get(id)
      .then(project => {
        if (project) {
          req.project = project
          next()
        } else {
          next({
            status: 404,
            message: `No project with given id: ${id}.`
          })
        }
      })
      .catch(err => {
        next(err)
      })
  
  }
  
  async function validateProject(req, res, next) {
    // console.log(req.body)
    const { name, description } = req.body
    if ((!name || !description) || (!name.trim() || !description.trim()) ) {
      res.status(400).json({
        message: "missing required name or description field"
      })
    } else {
      req.name = name.trim()
      req.description = description.trim()
      // console.log({"name": req.name, "description": req.description})
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
    projectLogger,
    validateProjectId,
    validateProject,
    checkCompletedProject
}