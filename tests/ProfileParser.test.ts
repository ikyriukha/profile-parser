import { ProfileParser } from '@core/ProfileParser';
import * as path from 'path';

describe('profile parser', () => {
  it('parse docx file', async () => {
    const skills = require(path.join(__dirname, 'ProfileParser', 'skills.json'));
    const profile = await ProfileParser.fromFile(path.join(__dirname, 'ProfileParser', 'test.docx'));
    expect(profile.name).toEqual('John Doe');
    expect(profile.skills).toEqual(skills);
  });
});
