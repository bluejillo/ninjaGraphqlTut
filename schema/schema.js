const graphql = require('graphql');
const _ = require('lodash');

const {GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList} = graphql;

const books = [
	{name: 'book 1', genre: 'fantasy', id:'b1', authorId: '1'},
	{name: 'book 2', genre: 'self help', id:'b2', authorId: '2'},
	{name: 'book 3', genre: 'sci-fi', id:'b3', authorId: '3'},
	{name: 'book 4', genre: 'sci-fi', id:'b4', authorId: '3'},
	{name: 'book 5', genre: 'sci-fi', id:'b5', authorId: '2'}

];

const authors = [
	{name: 'doodly do', age: 33, id:'1'},
	{name: 'ralph finklesbottom', age: 55, id: '2'},
	{name: 'rick dastidly', age: 100, id: '3'}
];

const AuthorType = new GraphQLObjectType({
	name: 'Author',
	//we wrap fields in a function because it will wait until its read the whole file before it executes 
	//otherwise it will never find BookType or AuthorType
	fields: () => ({
		name: {type: GraphQLString},
		age: {type: GraphQLInt},
		id: {type: GraphQLID},
		books: {
			type: new GraphQLList(BookType),
			resolve(parent, args){
				return _.filter(books, {authorId: parent.id});
			}
		}
	})
});

const BookType = new GraphQLObjectType({
	name: 'Book',
	fields: () => ({
		id: {type: GraphQLID},
		name: {type: GraphQLString},
		genre: {type: GraphQLString},
		author: {
			type: AuthorType,
			resolve(parent, args){
				return _.find(authors, {id: parent.authorId});
			}
		}
	})
});

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		book: {
			type: BookType,
			args: {id: {type: GraphQLID}},
			resolve(parent, args){
				return _.find(books, {id: args.id});
			}
		},
		author: {
			type: AuthorType,
			args: {id: {type: GraphQLID}},
			resolve(parent, args){
				return _.find(authors, {id: args.id});
			}
		},
		books: {
			type: new GraphQLList(BookType),
			resolve(parent, args){
				return books;
			}
		},
		authors: {
			type: new GraphQLList(AuthorType),
			resolve(parent, args){
				return authors;
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery
});