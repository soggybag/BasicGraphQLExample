const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const ToDo = require('./mongoose/todo')
const schema = require('./graphql/Schema/Schema')
const app = express();

const { graphql } = require('graphql')
const graphqlHTTP = require('express-graphql')

app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect('mongodb://localhost:27017/local')

const db = mongoose.connection;
db.on('error', ()=> {console.log( '---FAILED to connect to mongoose')})
db.once('open', () => {
	console.log( '+++Connected to mongoose')
})


app.get('/',(req,res)=>{
	res.sendFile(__dirname + '/index.html')
})

app.post('/quotes',(req,res)=>{
	// Insert into TodoList Collection
	const todoItem = new ToDo({
		itemId:1,
		item:req.body.item,
		completed: false
	})

	todoItem.save((err,result)=> {
		if (err) {console.log("---TodoItem save failed " + err)}
		console.log("+++TodoItem saved successfully "+todoItem.item)

		res.redirect('/')
	})
})

app.get("/graphiql", graphqlHTTP({
	schema,
	pretty: true,
	graphiql: true
}));

app.post("/graphiql", graphqlHTTP({
	schema,
	pretty: true,
	graphiql: true
}));

app.use('/graphql', graphqlHTTP ({
	schema, 
	graphiql: true
}))

app.listen(3000,()=> {console.log("+++Express Server is Running!!!")})

