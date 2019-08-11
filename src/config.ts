import { config as loadDotEnv } from 'dotenv';
import * as env from 'env-var';

loadDotEnv();

export default {
  port: env.get('PORT').required().asInt(),
  cacheDir: env.get('CACHE_DIR').required().asString(),
  projectId: env.get('PROJECT_ID').required().asString(),
  accountKey: env.get('ACCOUNT_KEY').required().asString(),
  profile: {
    folder: env.get('PROFILE_FOLDER').required().asString(),
    nameLineNumber: env.get('PROFILE_NAME_LINENO').required().asInt(),
    skillsHeaders: env.get('PROFILE_SKILLS_HEADERS').required().asArray(';'),
  },
};
