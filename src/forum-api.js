'use strict';

var assign = require('react/lib/Object.assign')
var express = require('express')

var router = express.Router()

var SECTION_IDS = [1]
var SECTIONS = {
  1: {id: 1, slug: 'test-section', name: 'Test Section', description: 'Section for testing'}
}
var SECTION_FORUMS = {
  1: [1]
}

var FORUMS = {
  1: {id: 1, slug: 'test-forum', name: 'Test Forum', description: 'Forum for testing'}
}
var FORUM_TOPICS = {
  1: [1]
}

var TOPICS = {
  1: {id: 1, title: 'Test Topic'}
}
var TOPIC_POSTS = {
  1: [1, 2, 3]
}

var POSTS = {
  1: {user: 1, body: 'Test Post 1'}
, 2: {user: 2, body: 'Test Post 2'}
, 3: {user: 1, body: 'Test Post 3'}
}

router.get('/sections', (req, res, next) => {
  res.json(
    SECTION_IDS.map(sectionId => assign({}, SECTIONS[sectionId], {
      forums: SECTION_FORUMS[sectionId].map(forumId => assign({}, FORUMS[forumId], {
        topics: FORUM_TOPICS[forumId].length
      , replies: FORUM_TOPICS[forumId].reduce((sum, topicId) => (sum + TOPIC_POSTS[topicId].length), 0) - FORUM_TOPICS[forumId].length
      , subforums: []
      }))
    }))
  )
})

router.get('/forum/:id', (req, res, next) => {
  if (!FORUMS[req.params.id]) {
    return res.sendStatus(404)
  }
  res.json(
    assign({}, FORUMS[req.params.id], {
      topics: FORUM_TOPICS[req.params.id].map(topicId => assign({}, TOPICS[topicId], {
        posts: TOPIC_POSTS[topicId].length
      }))
    , subforums: []
    })
  )
})

router.get('/topic/:id', (req, res, next) => {
  if (!TOPICS[req.params.id]) {
    return res.sendStatus(404)
  }
  res.json(
    assign({}, TOPICS[req.params.id], {
      posts: TOPIC_POSTS[req.params.id].map(postId => assign({}, POSTS[postId]))
    })
  )
})

module.exports = router