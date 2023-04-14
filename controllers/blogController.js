require("../models/database");
const User = require('../models/User')
const Blog = require('../models/Blog')
const mongoose = require('mongoose')

exports.getAllBlogs = async (req, res, next) => {
    let blogs;
    try{
        blogs = await Blog.find();
    } catch (err) {
        return console.log(err)
    }

    if(!blogs) {
        return res.status(404).json({ message: "No Blogs Found"})
    }
    return res.status(200).json({blogs})
}


//Add Blog

exports.addBlog = async (req, res, next) => {
    const { title, description, image, user} = req.body;

    let existingUser;
    try{
        existingUser = await User.findById(user)
    }catch(err){
        return console.log(err)
    }
    if(!existingUser){
        return res.status(400).json({message:"Unable to find the user By this Id"})
    }
    const blog = new Blog({
        title,
        description,
        image,
        user
    })

    try{
        const session = await mongoose.startSession()
        session.startTransaction()
        await blog.save({session})
        existingUser.blogs.push(blog)
        await existingUser.save({session})
        await session.commitTransaction()


    }catch(err){
        return res.status(500).json({message: err})

    }
    return res.status(200).json({blog})
}

//Update the Blog
exports.updateBlog =  async(req, res, next) =>{
    const { title, description } = req.body;
    const blogId = req.params.id;
    let blog;
    try{
        blog = await Blog.findByIdAndUpdate(blogId, {
            title,
            description
        })

    }catch(err) {
        return console.log(err)
    }

    if(!blog) {
        return res.status(500).json({ message: "Unable To Update The Blog"})
    }

    return res.status(200).json({blog})
     
}

//Get a Particular Id
exports.getById = async (req, res, next) => {
    const id = req.params.id;
    let blog;
    try{
        blog = await Blog.findById(id)
    }catch(err){
        return console.log(err)
    }

    if(!blog) {
        return res.status(404).json({ message: "No Blog Found"})
    }
    return res.status(200).json({ blog })
}

//delete a blog

exports.deleteBlog = async (req, res, next) =>{
    const id = req.params.id;

    let blog;
    try{
        blog = await Blog.findByIdAndRemove(id).populate('user')
        await blog.user.blogs.pull(blog)
        await blog.user.save()
    }catch(err) {
        console.log(err)
    }

    if(!blog) {
        return res.status(500).json({message: "Unable To Delete"})
    }
    return res.status(200).json({message: "Successfully Deleted"})

}



exports.getByUserId = async (req, res, next) => {
    const userId = req.params.id;
    let userBlogs;
    try {
      userBlogs = await User.findById(userId).populate("blogs");
    } catch (err) {
      return next(err);
    }
    if (!userBlogs) {
      return res.status(404).json({ message: "No Blog Found" });
    }
    return res.status(200).json({ data: { blogs: userBlogs } });
  };
  