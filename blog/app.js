var express = require('express'),
mongoose = require('mongoose'),
methodOverride = require('method-override'),
bodyparser = require('body-parser'),
expressSanitizer = require('express-sanitizer')
app = express();

//APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended:true}))
app.use(expressSanitizer());
app.use(methodOverride("_method"));


//Mongoose/Model configuration
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,//{type: String, default: placeholder image url}
	body: String,
	created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog",blogSchema)

//RESTFUL ROUTES
app.get('/',function(req,res){
	res.redirect('/blog')
})
//INDEX ROUTE
app.get('/blog',function(req,res){
	Blog.find({},function(err,blogs){
		if(err){console.log(err)}
		else { res.render('index',{blogs:blogs})}
	})
})
//NEW ROUTE
app.get('/blog/new',function(req,res){
	res.render('new')
;})

// CREATE ROUTE
app.post('/blog',function(req,res){
	//create blog
	req.body.blog.body = req.sanitize(req.body.blog.body)
	Blog.create(req.body.blog,function(err,newBlog){
		if(err){
			// console.log(req.body.blog)
			res.render('new');
		} else {
			res.redirect('/blog')
		}
	})
})

// SHOW ROUTE
app.get('/blog/:id',function(req,res){
	Blog.findById(req.params.id, function(err,foundBlog){
		if(err){
			res.redirect('/blog')
		} else {
			res.render('show',{blog: foundBlog})
		}	

	})

})

// EDIT ROUTE
app.get('/blog/:id/edit',function(req,res){
	Blog.findById(req.params.id,function(err, foundBlog){
		if(err){
			res.redirect('/blog')
		} else {
			res.render('edit',{blog: foundBlog})
		}
	})
	// res.render('edit');
})

// UPDATE ROUTE
app.put('/blog/:id',function(req,res){
	req.body.blog.body = req.sanitize(req.body.blog.body)
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
		if(err){
			res.redirect('/blog')
		} else {
			res.redirect('/blog/'+req.params.id)
		}
	})
	// res.send("update route")
})

// DELETE ROUTE
app.delete("/blog/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err,deleteBlog){
		if(err){
			res.redirect('/blog');
		} else {
			res.redirect('/blog');
		}
	})
})
// app.listen(process.env.PORT,process.env.IP,function(){
// 	console.log("Server has started on port:",process.env.PORT)
// })
app.listen(8080,process.env.IP,function(){
	console.log("Server has started on port:",process.env.PORT)
})