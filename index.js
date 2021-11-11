const {ApolloServer, gql} = require('apollo-server')
const data = require('./data')

const {authors, books} = data; 

const typeDefs = gql`
    type Book {
        title: String!
        published: String!
        author: String!
        id: ID!
        genres: [String!]!
    }
    type Author {
        name: String!
        born: String
        id: ID!
    }
    type Query {
        bookCount: Int!
        authorCount: Int!
        allBooks: [Book!]!
        allAuthors: Int!
    }
`
// allAuthors, returns details about all authors. Should include a field bookCount containing the number of books the author has written. 
const resolvers = {
    Query: {
        bookCount: () => books.length, 
        authorCount: () => authors.length, 
        allBooks: ()=> {
            return books
        },
        allAuthors: () => {
            return 3; 
        }
    }
}

const server = new ApolloServer({
    typeDefs, resolvers
})

const PORT = 4001; 
server.listen(PORT).then( ( {url} ) => {
    console.log(`Server listening at port ${PORT} on ${url}`);
}) 