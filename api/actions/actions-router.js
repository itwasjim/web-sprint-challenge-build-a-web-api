const express = require('express')
const {validateActionId, validateAction, checkCompletedProject} = require('./actions-middlware')

const Action = require('./actions-model')

const router = express.Router()

router.get('/', async (req, res, next) => {
  await Action.get()
    .then(action => {
      res.json(action)
    })
    .catch(next)
})

router.get('/:id', validateActionId, async (req, res, next) => {
  const { id } = req.params
  await Action.get(id)
    .then(action => {
      console.log(action)
      res.json(action)
    }) 
    .catch(next)
})

router.post('/', validateAction, async (req, res, next) => {
  await Action.insert({...req.body, notes: req.notes, description: req.description })
    .then(newAction => {
      res.json(newAction)
    })
    .catch(next)
})

router.put('/:id', validateActionId, validateAction, checkCompletedProject, async (req, res, next) => {
  const { id } = req.params
  await Action.update(id, {...req.body, project_id: req.project_id, notes: req.notes, description: req.description })
    .then(newAction => {
      res.json(newAction)
    })
    .catch(next)
})

router.delete('/:id', validateActionId, async (req, res, next) => {
  const { id } = req.params
  const remAction = await Action.get(id)
  console.log(remAction)
  await Action.remove(id)
    .then(() => {
      res.json(remAction)
    })
    .catch(next)
})

router.use((err, req, res, next) => { //eslint-disable-line
    res.status(err.status || 500).json({
      customMessage: 'Something bad happend inside the actions router',
      message: err.message,
    });
  });

module.exports = router