import * as textract from 'textract';
import config from '@core/config';

export class ProfileParser {
  private path: string;
  private _skills: string[];
  private _name: string;

  public get name() {
    return this._name;
  }

  public get skills() {
    return this._skills;
  }

  public static async fromFile(path: string) {
    const instance = new ProfileParser();
    instance.path = path;
    const text = await ProfileParser.getText(path);
    const lines = text.split('\n').map(line => line.trim());
    instance._name = ProfileParser.getName(lines);
    instance._skills = ProfileParser.getSkills(lines);
    // Failed to parse docx file '${path}'
    return instance;
  }

  private static getName(lines: string[]) {
    return lines[config.profile.nameLineNumber];
  }

  private static getSkills(lines: string[]) {
    const skills = [];
    const indexes = config.profile.skillsHeaders
      .map(header => lines.indexOf(header))
      .sort((a, b) => a - b);
    for (let i = 0; i < indexes.length; i++) {
      const lineIndexStart = indexes[i] + 1;
      const lineIndexEnd = indexes[i + 1] ? indexes[i + 1] : lines.length - 1;
      for (let index = lineIndexStart; index < lineIndexEnd; index++) {
        const skill = lines[index];
        if (skill.length === 0) {
          break;
        }
        skills.push(skill);
      }
    }
    return skills;
  }

  private static async getText(path: string): Promise<string> {
    const mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    return new Promise((resolve, reject) => {
      textract.fromFileWithMimeAndPath(mimeType, path, {preserveLineBreaks: true}, (error, text) => {
        if (error) {
          reject(error.message);
        } else {
          resolve(text);
        }
      });
    });
  }

  private constructor() {}
}
