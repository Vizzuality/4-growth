import * as fs from 'fs';

export const Process = {
    setPid: (path: string, pid?: number) => {
      if(pid === undefined) {
        if (fs.existsSync(path) === true) {
          fs.unlinkSync(path);
        }
        return;
      }
      fs.writeFileSync(path, pid.toString(), 'utf8');
    },
    getPid: (path: string) => {
      if (fs.existsSync(path) === false) {
        return undefined;
      }
      return parseInt(fs.readFileSync(path, 'utf8'));
    },
    kill: (pid: number, signal: NodeJS.Signals = 'SIGKILL') => {
      try {
        process.kill(pid, signal);
      } catch (error) {
        if (error.code !== 'ESRCH') {
          throw error;
        }
      }
    }
  } as const;