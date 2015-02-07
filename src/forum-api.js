'use strict';

var assign = require('react/lib/Object.assign')
var express = require('express')

var {TopicForm} = require('./forms')

var router = express.Router()

var SECTION_IDS = [1]
var SECTIONS = {
  1: {id: 1, slug: 'test-section', name: 'Test Section', description: 'Section for testing'}
}
var SECTION_FORUMS = {
  1: [1]
}

var FORUMS = {
  1: {id: 1, slug: 'test-forum', name: 'Test Forum', description: 'Forum for testing', section: 1}
}
var FORUM_TOPICS = {
  1: [1]
}

var TOPICS = {
  1: {id: 1, title: 'Test Topic', forum: 1}
}
var TOPIC_POSTS = {
  1: [1, 2, 3]
}

var POSTS = {
  1: {user: 1, body: 'Test Post 1'}
, 2: {user: 2, body: 'Test Post 2'}
, 3: {user: 1, body: 'Test Post 3'}
}

function addTopic(topic) {
  topic.id = Object.keys(TOPICS).length + 1
  TOPICS[topic.id] = topic
  FORUM_TOPICS[topic.forum].unshift(topic.id)
  TOPIC_POSTS[topic.id] = []
  return topic
}

function addPost(post) {
  console.log(post)
  post.id = Object.keys(POSTS).length + 1
  POSTS[post.id] = post
  TOPIC_POSTS[post.topic].push(post.id)
  return post
}

function getSection(id) {
  return assign({}, SECTIONS[id], {
    forums: SECTION_FORUMS[id].map(forumId => assign({}, FORUMS[forumId], {
      topics: FORUM_TOPICS[forumId].length
    , replies: FORUM_TOPICS[forumId].reduce((sum, topicId) => (sum + TOPIC_POSTS[topicId].length), 0) - FORUM_TOPICS[forumId].length
    , subforums: []
    }))
  })
}

router.get('/sections', (req, res, next) => {
  res.json(SECTION_IDS.map(getSection))
})

router.get('/section/:id', (req, res, next) => {
  if (!SECTIONS[req.params.id]) {
    return res.sendStatus(404)
  }
  res.json(getSection(req.params.id))
})

router.get('/forum/:id/addTopic', (req, res, next) => {
  if (!FORUMS[req.params.id]) {
    return res.sendStatus(404)
  }
  var forum = FORUMS[req.params.id]
  var section = SECTIONS[forum.section]
  res.json(
    assign({}, forum, {
      section: {
        id: section.id
      , name: section.name
      }
    })
  )
})

router.post('/forum/:id/addTopic', (req, res, next) => {
  if (!FORUMS[req.params.id]) {
    return res.sendStatus(404)
  }

  var form = new TopicForm({data: req.body})
  if (!form.validate()) {
    return res.status(400).json(form.errors())
  }

  var topic = addTopic({
    title: form.cleanedData.title
  , forum: Number(req.params.id)
  })
  console.log(topic)
  var post = addPost({
    body: form.cleanedData.body
  , topic: topic.id
  })
  res.json({topic, post})
})

router.get('/forum/:id', (req, res, next) => {
  if (!FORUMS[req.params.id]) {
    return res.sendStatus(404)
  }
  var forum = FORUMS[req.params.id]
  var section = SECTIONS[forum.section]
  res.json(
    assign({}, forum, {
      topics: FORUM_TOPICS[forum.id].map(topicId => assign({}, TOPICS[topicId], {
        posts: TOPIC_POSTS[topicId].length
      }))
    , subforums: []
    , section: {
        id: section.id
      , name: section.name
      }
    })
  )
})

router.get('/topic/:id', (req, res, next) => {
  if (!TOPICS[req.params.id]) {
    return res.sendStatus(404)
  }
  var topic = TOPICS[req.params.id]
  var forum = FORUMS[topic.forum]
  var section = SECTIONS[forum.section]
  res.json(
    assign({}, topic, {
      posts: TOPIC_POSTS[topic.id].map(postId => assign({}, POSTS[postId]))
    , forum: {
        id: forum.id
      , name: forum.name
      }
    , section: {
        id: section.id
      , name: section.name
      }
    })
  )
})

module.exports = router