const { send } = require('micro')
const cors = require('micro-cors')()
const { router, get } = require('microrouter')

const request = require('xhr-request')
const assert = require('assert')

assert(process.env.TOKEN, 'TOKEN env var required')

const list = router(
  get('/', awake),
  get('/notifications', fetchNotifications),
  get('/repos', fetchRepos),
  get('/issues', fetchIssues)
)

function awake (req, res) {
  return send(res, 200, 'awake!')
}

function fetchNotifications (req, res) {
  fetchData('notifications')
    .then((data) => {
      console.log('hit')
      return send(res, 200, data)
    })
    .catch((err) => {
      return send(res, 500, err)
    })
}

function fetchRepos (req, res) {
  fetchData('users/hanford/repos')
    .then((data) => {
      console.log('hit')
      return send(res, 200, data)
    })
    .catch((err) => {
      return send(res, 500, err)
    })
}

function fetchIssues (req, res) {
  fetchData('user/issues')
    .then((data) => {
      console.log('hit')
      return send(res, 200, data)
    })
    .catch((err) => {
      return send(res, 500, err)
    })
}

function fetchData (endpoint) {
  const api = `https://api.github.com/${endpoint}?access_token=${process.env.TOKEN}`

  return new Promise((resolve, reject) => {
    return request(api, (err, data) => {
      if (err) reject(err)

      return resolve(data)
    })
  })
}

module.exports = cors(list)
