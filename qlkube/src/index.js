const fs = require('fs').promises;
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const compression = require('compression');
const { createSchema } = require('./schema');
const getOpenApiSpec = require('./oas');
const { printSchema } = require('graphql');
const logger = require('pino')({ useLevelLabels: true });

main().catch(e =>
  logger.error({ error: e.stack }, 'failed to start qlkube server')
);

async function main() {
  const inCluster = process.env.IN_CLUSTER !== 'false';
  logger.info({ inCluster }, 'cluster mode configured');
  const kubeApiUrl = inCluster
    ? 'https://kubernetes.default.svc'
    : 'http://localhost:8001';
  const token = inCluster
    ? await fs.readFile(
        '/var/run/secrets/kubernetes.io/serviceaccount/token',
        'utf8'
      )
    : '';

  const oas = await getOpenApiSpec(kubeApiUrl, token);
  const schema = await createSchema(oas, kubeApiUrl, token);

  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      if (req.headers.authorization && req.headers.authorization.length > 0) {
        const strs = req.headers.authorization.split(' ');
        var user = {};
        user.token = strs[1];
        return user;
      }
    },
  });

  const app = express();
  app.use(compression());
  app.get('/schema', (req, res) => {
    res.setHeader('content-type', 'text/plain');
    res.send(printSchema(schema));
  });
  app.get('/healthz', (req, res) => {
    res.sendStatus(200);
  });
  server.applyMiddleware({
    app,
    path: '/',
  });
  app.listen({ port: 8080 }, () =>
    logger.info(
      { url: `http://localhost:8080${server.graphqlPath}` },
      '🚀 Server ready'
    )
  );
}
