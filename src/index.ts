import 'module-alias/register';
import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import config from '@core/config';
import logger from '@core/logger';
import {DriveClient} from '@core/DriveClient';
import {DriveFileType} from '@core/DriveFile';
import {ProfileParser} from '@core/ProfileParser';

let driveClient: DriveClient;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/profiles', async (req, res) => {
  const folders = await driveClient.listFiles({
    name: 'Profiles',
    type: DriveFileType.FOLDER,
  });
  const profileFolder = folders[0];
  let result = [];
  if (profileFolder) {
    const files = await driveClient.listFiles({
      nameHas: '.docx',
      parent: profileFolder.id,
    });
    result = await Promise.all(files.map(async file => {
      const path = await file.cache();
      const profile = await ProfileParser.fromFile(path);
      return {name: profile.name, skills: profile.skills};
    }));
  }
  res.json({
    data: result,
  });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err);
  return res.status(500).json({
    errors: [err.message],
  });
});

(async () => {
  driveClient = await DriveClient.getInstance();

  app.listen(config.port, () =>
    logger.info(`Server is running on http://localhost:${config.port}`),
  );
})();


