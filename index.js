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
        born: Int
        id: ID!
        bookCount: Int
    }
    type Query {
        bookCount: Int!
        authorCount: Int!
        allBooks(author: String): [Book!]!
        allAuthors: [Author!]!
    }
`
const resolvers = {
    Query: {
        bookCount: () => books.length, 
        authorCount: () => authors.length, 
        
        allBooks: (root, args)=> {
            if (!args.author) return books
            return books.filter(each => each.author === args.author)
        },

        allAuthors: () => {
            return authors
        }
    }, 
    
    Author: {
        bookCount: (root) =>{
            return books.reduce( (acc, curr) => 
            (root.name==curr.author) ? ++acc : acc, 0)
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