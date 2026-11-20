const { createServer } = require('./app');

const port = Number(process.env.PORT) || 3000;
const server = createServer();

server.listen(port, '0.0.0.0', () => {
  console.log(`sample-api écoute sur le port ${port}`);
});

// Arrêt propre : Kubernetes envoie SIGTERM avant de supprimer le pod
process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
