const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');

const {GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList} = graphql;

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
				// return _.filter(books, {authorId: parent.id});
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
				// return _.find(authors, {id: parent.authorId});
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
				// return _.find(books, {id: args.id});
			}
		},
		author: {
			type: AuthorType,
			args: {id: {type: GraphQLID}},
			resolve(parent, args){
				// return _.find(authors, {id: args.id});
			}
		},
		books: {
			type: new GraphQLList(BookType),
			resolve(parent, args){
				// return books;
			}
		},
		authors: {
			type: new GraphQLList(AuthorType),
			resolve(parent, args){
				// return authors;
			}
		}
	}
});

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addAuthor: {
			type: AuthorType,
			args: {
				name: {type: GraphQLString},
				age: {type: GraphQLInt}
			},

			resolve(parent, args){
				let author = new Author({
					name: args.name,
					age: args.age
				});

				return author.save();
			}
		},
		addBook: {
			type: BookType,
			args: {
				name: {type: GraphQLString},
				genre: {type: GraphQLString},
				authorId: {type: GraphQLID}
			},
			resolve(parent, args){
				let book = new BookType({
					name: args.name,
					genre: args.genre,
					authorId: args.authorId
				});

				return book.save();
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
});