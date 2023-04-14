const express = require('express')
const router = require('./routes/user-routes.js')
const blogRouter = require('./routes/blog-routes.js')
const bodyParser = require('body-parser');
const app = express();
const port= process.env.PORT || 40001 


require('dotenv').config()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Use middleware
app.use(express.json());


app.use('/api/user', router);
app.use('/api/blog', blogRouter);


app.listen(port, ()=> console.log(`listening to port ${port}`))