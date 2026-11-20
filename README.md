# sample-api

Application exemple de la plateforme DevOps : une petite API Node.js sans dépendance.

| Route | Rôle |
| --- | --- |
| `GET /` | Nom du service, version, environnement |
| `GET /health` | Sonde de santé (utilisée par Kubernetes) |
| `GET /metrics` | Métriques au format Prometheus |

## Lancer en local

```bash
npm test          # 4 tests
npm start         # http://localhost:3000
```

## Avec Docker

```bash
docker build -t sample-api:local .
docker run --rm -p 3000:3000 sample-api:local
curl http://localhost:3000/health
```
