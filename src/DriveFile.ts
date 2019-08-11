import {promises as fs, existsSync} from 'fs';
import * as path from 'path';
import { createHash } from 'crypto';
import {drive_v3} from 'googleapis';
import config from '@core/config';

export enum DriveFileType {
  FOLDER = 'application/vnd.google-apps.folder',
  FILE = 'application/vnd.google-apps.file',
}

export class DriveFile {
  private _id: string;
  private _name: string;
  private _type: string;
  private _cachedPath: string;
  private _mtime: string;
  private _drive: drive_v3.Drive;

  public constructor(drive: drive_v3.Drive, driveFile: drive_v3.Schema$File) {
    this._id = driveFile.id;
    this._name = driveFile.name;
    this._type = driveFile.mimeType;
    this._mtime = driveFile.modifiedTime;
    this._drive = drive;
  }

  get name() {
    return this._name;
  }

  get id() {
    return this._id;
  }

  get path() {
    return this._cachedPath;
  }

  public async cache() {
    const destHash = createHash('sha1')
      .update(this._id + this._mtime)
      .digest('hex');
    const fileExt = path.extname(this._name);
    const destPath = path.join(config.cacheDir, destHash + fileExt);
    if (!existsSync(destPath) || true) {
      const result = await this._drive.files.get({
        fileId: this._id,
        alt: 'media',
      }, {responseType: 'arraybuffer'});
      const binary = new Uint8Array(result.data as ArrayBuffer);
      await fs.writeFile(destPath, binary);
    }
    return destPath;
  }
}
