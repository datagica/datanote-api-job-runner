
# Datanote API job runner

The job runner is an independent server without public API, which connects using
websockets to the job balancer API to get jobs (requests) to execute in the background.

## Deployment

Important: only increment the the `version` in the `config.json` once you are
ready to deploy in production, as there is no rollback possible yet!

- To start the service locally: `npm run dev`
- To deploy on `Now.sh`: `npm run deploy`

