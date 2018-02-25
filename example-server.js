import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import NodeCache from 'node-cache';
import { schema } from './src';

const debug = require('debug')('untappd-graphql');

const port = process.env.PORT || 9090;

if (!process.env.UNTAPPD_CLIENT_ID || !process.env.UNTAPPD_CLIENT_SECRET) {
  debug('UNTAPPD_CLIENT_ID and UNTAPPD_CLIENT_SECRET must be set in env.');
  process.exit(1);
}

// Initialize the app
const app = express();

// Cache in memory
const context = {
  cache: new NodeCache({
    stdTTL: 60 * 60 * 24 * 7, // cache for one week
  }),
};

// The GraphQL endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema, context }));

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

// Start the server
app.listen(port, () => {
  debug(`Go to http://localhost:${port}/graphiql to run queries!`);
});
