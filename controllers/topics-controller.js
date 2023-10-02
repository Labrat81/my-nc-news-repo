const db = require('../db/connection')
const {selectTopics} = require('../models/topics-model') 

function getTopics(req, res) {
selectTopics().then((topics) => {
    res.status(200).send({topics})
})
}

module.exports = {getTopics};