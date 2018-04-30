const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const app = express();

app.use('/graphql', graphqlHTTP({
	schema: schema,
	graphiql: true
}));

app.listen(4200, () => {
	console.log('Listening on 4200');
});

