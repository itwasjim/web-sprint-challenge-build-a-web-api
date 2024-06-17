const express = require('express')
const { validateProjectId, validateProject, checkCompletedProject} = require('./projects-middleware')

const Project = require('./projects-model')

const router = express.Router()

router.get('/', async (req, res, next) => {
  await Project.get()
      .then(project => {
          res.status(200).json(project)
      })
      .catch(next)
})

router.get('/:id', validateProjectId, async(req, res, next) => {
  const { id } = req.params
  await Project.get(id)
    .then(project => {
      res.status(200).json(project)
    })
    .catch(next)
})

router.post('/', validateProject, async (req, res, next) => {
  await Project.insert({...req.body, name: req.name, description: req.description})
    .then(newProj => {
      res.status(201).json(newProj)
    })
    .catch(next)
})

router.put('/:id', validateProjectId, validateProject, checkCompletedProject, async(req, res, next) => {
  const { id } = req.params
  await Project.update(id, {...req.body, name: req.name, description: req.description})
    .then((updateProj) => {
      res.status(200).json(updateProj)
    })
    .catch(next)
})

router.delete('/:id', validateProjectId, async(req, res, next) => {
  const { id } = req.params
  const removedProj = await Project.get(id)
  await Project.remove(id)
    .then(() => {
      res.status(200).json(removedProj)
    })
    .catch(next)
})

router.get('/:id/actions', validateProjectId, async(req, res, next) => {
  const { id } = req.params
  await Project.getProjectActions(id)
    .then(action => {
      res.status(200).json(action)
    })
    .catch(next)
})

router.use((err, req, res, next) => { //eslint-disable-line
    res.status(err.status || 500).json({
      customMessage: 'Something bad happend inside the projects router',
      message: err.message,
    });
  });

module.exports = router