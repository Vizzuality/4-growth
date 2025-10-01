import { createHash } from 'crypto';
import { createReadStream } from 'fs';

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
};
