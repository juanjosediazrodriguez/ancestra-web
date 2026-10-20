import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'reemplazar',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  // El panel queda en https://ancestra.sanity.studio al correr `npm run deploy`
  studioHost: 'ancestra',
});
