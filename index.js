const {ApolloServer, gql} = require('apollo-server')
const data = require('./data')

let {authors, books} = data;

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
        allBooks(author: String, genre: String): [Book!]!
        allAuthors: [Author!]!
    }
    type Mutation {
        addBook(
            title: String!
            author: String!
            published: Int!
            genres: [String!]!
        ): Book
        editAuthor(
            name: String!
            setBornTo: Int!
        ): Author
    }
`
const resolvers = {
    Mutation: {
        addBook: (root, args) => {
            const newBook = {...args}
            books = books.concat(newBook)
            if (!authors.map(each=>each.name).includes(args.author)){
                authors = authors.concat({
                    name: args.author
                })
            }
            return newBook
        },

        editAuthor: (root, args) => {
            if (!authors.map(each=>each.name).includes(args.name)) return null; 
            else {
                const authorToChange = authors.find(each => each.name === args.name)
                authorToChange.born = args.setBornTo; 
                authors = authors.map (each => {
                    if (each.name === args.name) return authorToChange; 
                    else return each; 
                })
                return authorToChange; 
            }
        }
    },
    Query: {
        bookCount: () => books.length, 
        authorCount: () => authors.length, 
        
        allBooks: (root, args)=> {
            if (!args.author && !args.genre) return books
            else if (!args.genre) return books.filter(each => each.author === args.author)
            else if (!args.author) return books.filter(each => {
                if (each.genres.includes(args.genre)) return each;
            })
            else {
                const booksByAuthor = books.filter(each => each.author == args.author)
                return booksByAuthor.filter(each => each.genres.includes(args.genre))
            }
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