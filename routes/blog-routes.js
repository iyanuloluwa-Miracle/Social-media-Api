const express = require('express')
const blogController = require('../controllers/blogController')
const mongoose = require('mongoose')
const blogRouter = express.Router()

blogRouter.get('/', blogController.getAllBlogs)
blogRouter.post('/add', blogController.addBlog)
blogRouter.put('/update/:id', blogController.updateBlog)
blogRouter.get('/:id', blogController.getById)
blogRouter.delete('/:id', blogController.deleteBlog)
blogRouter.get('/user/:id', blogController.getByUserId)



module.exports = blogRouter