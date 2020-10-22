const express = require('express')
const router = express.Router()


router.get('/new', (req, res) => {
  // render to new.html
})

router.post('/new', (req, res) => {
  // render to index.html
})

router.get('/:rid/edit', (req, res) => {
  // render to edit.html
})

router.put('/:rid/edit', (req, res) => {
  // render to edit.html
})

router.delete('/:rid/delete', (req, res) => {
  // render to index.html
})


module.exports = router