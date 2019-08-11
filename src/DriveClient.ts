import {drive_v3, google} from 'googleapis';
import config from './config';
import {DriveFile} from './DriveFile';

export interface ListFileOptions {
  name?: string;
  nameHas?: string;
  parent?: string;
  type?: string;
}

export class DriveClient {
  private static ROOT_FOLDER = '"root"';
  private drive: drive_v3.Drive;

  public static async getInstance() {
    const auth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      projectId: config.projectId,
      keyFilename: config.accountKey,
    });
    const authClient = await auth.getClient();
    const client = new DriveClient();
    client.drive = google.drive({
      version: 'v3',
      auth: authClient,
    });
    return client;
  }

  public async listFiles(opts?: ListFileOptions): Promise<DriveFile[]> {
    const insertIf = (condition, ...elements) => condition ? elements : [];
    const query = [
      ...insertIf(opts && opts.parent, `'${opts.parent}' in parents`),
      ...insertIf(opts && opts.name, `name = '${opts.name}'`),
      ...insertIf(opts && opts.nameHas, `name contains '${opts.nameHas}'`),
      ...insertIf(opts && opts.type, `mimeType = '${opts.type}'`),
    ];
    const files = [];
    let nextPageToken = undefined;
    do {
      const result = await this.drive.files.list({
        q: query.join(' and '),
        pageSize: 100,
        pageToken: nextPageToken,
        fields: 'nextPageToken, files',
      });
      nextPageToken = result.data.nextPageToken;
      for (let file of result.data.files) {
        files.push(new DriveFile(this.drive, file));
      }
    } while (nextPageToken);
    return files;
  }

  private constructor() {}
}
