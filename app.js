const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
//comment out if you're not using mlab. Create your own mlab db and add this file with your credentials --
const mLab = require('./mlab');
const mlabSchema = require('./schema/mlabSchema');
//--
const app = express();

//use your own mlab connection otherwise comment out --
mongoose.connect(mLab);
mongoose.connection.once('open', () => {
	console.log('connected to database');
});
// --

//uncomment and use this route if you're not using mlab --
// app.use('/graphql', graphqlHTTP({
// 	schema: schema,
// 	graphiql: true
// }));
// --

//use this if you're using mlab, otherwise comment out --
app.use('/graphql', graphqlHTTP({
	schema: mlabSchema,
	graphiql: true
}));

//create a few books in your mongoDB and then hit this url: http://localhost:4200/graphql2?query={books{name%20genre}}
app.use('/graphql2', graphqlHTTP({
	schema: mlabSchema
}));
// --


app.listen(4200, () => {
	console.log('Listening on 4200');
});

