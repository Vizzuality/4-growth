import { createHash } from 'crypto';
import { createReadStream, promises as fs } from 'fs';
import * as path from 'path';

export const FSUtils = {
  md5File: (filePath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const hash = createHash('md5');
      const stream = createReadStream(filePath);

      stream.on('data', (data) => hash.update(data));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', (err) => reject(err));
    });
  },

  md5Directory: async (dirPath: string, extension = '.ts'): Promise<string> => {
    const files = await fs.readdir(dirPath);
    const relevantFiles = files.filter((f) => f.endsWith(extension)).sort();

    const hashes: string[] = [];
    for (const file of relevantFiles) {
      const hash = await FSUtils.md5File(path.join(dirPath, file));
      hashes.push(hash);
    }

    return createHash('md5').update(hashes.join('')).digest('hex');
  },
};
