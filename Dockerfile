FROM node:22-alpine

# On supprime npm, npx, corepack et yarn : l'application n'en a pas besoin pour tourner.
# Ce sont eux qui contiennent les failles HIGH détectées par Trivy.
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack \
    /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack \
    /opt/yarn-* /usr/local/bin/yarn /usr/local/bin/yarnpkg

WORKDIR /app

COPY package.json ./
COPY src ./src

# Exécution sans les droits root (bonne pratique, vérifiée par Trivy/Checkov)
# UID numérique : Kubernetes (runAsNonRoot) ne peut pas vérifier un nom d'utilisateur
USER 1000

ENV PORT=3000
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://127.0.0.1:3000/health || exit 1

CMD ["node", "src/server.js"]
