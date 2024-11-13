import { spawn } from "child_process";
import { Process } from "e2e/process";
import * as http from 'http';

export const API_PID_FILE = 'api.pid';
export const CLIENT_PID_FILE = 'client.pid';
export const DEFAULT_START_TIMEOUT = 120_000;
export const API_URL = 'http://localhost:4000';
export const CLIENT_URL = 'http://localhost:3000';

const waitUntilServerIsUp = (url: string) => {
  return new Promise<void>((resolve, reject) => {
    const check = () => {
      http.get(url, (res) => {
        if (res.statusCode === 200) {
          resolve();
        } else {
          setTimeout(check, 300);
        }
      }).on('error', () => {
        setTimeout(check, 300);
      });
    };
    check();
  });
};

const waitUntilServerIsDown = (url: string) => {
  return new Promise<void>((resolve) => {
    const check = () => {
      http.get(url, () => {
        console.log(`Server is still up. Waiting for it to shutdown... ${url}`);
        setTimeout(check, 300);
      }).on('error', () => {
        resolve();
      });
    };
    check();
  });
};

const startClientServer = async () => {
    const currentPid = Process.getPid(CLIENT_PID_FILE);
    if(currentPid !== undefined) return;

    const { pid } = spawn('NODE_ENV=test pnpm --filter client run build && NODE_ENV=test pnpm --filter client run start', {
        env: { ...process.env, NODE_ENV: 'test' },
        stdio: 'ignore',
        detached: true,
        shell: true
    });
    Process.setPid(CLIENT_PID_FILE, pid);
    await waitUntilServerIsUp(CLIENT_URL);
}

const stopClientServer = async () => {
  const currentPid = Process.getPid(CLIENT_PID_FILE);
  if(currentPid === undefined) return;

  Process.kill(-currentPid);
  Process.setPid(CLIENT_PID_FILE, undefined);
}

async function startAPIServer() {
  const currentPid = Process.getPid(API_PID_FILE);
  if(currentPid !== undefined) return;

    const { pid } = spawn('pnpm --filter api run start:prod', {
        env: { ...process.env, NODE_ENV: 'test' },
        stdio: 'ignore',
        detached: true,
        shell: true
    });
    Process.setPid(API_PID_FILE, pid);
    await waitUntilServerIsUp(API_URL);
}

async function stopAPIServer() {
  const currentPid = Process.getPid(API_PID_FILE);
  if(currentPid === undefined) return;

  Process.kill(-currentPid);
  Process.setPid(API_PID_FILE, undefined);
  await waitUntilServerIsDown(API_URL);
}

export const Application = {
  CLIENT_URL,
  API_URL,
  startClientServer,
  stopClientServer,
  startAPIServer,
  stopAPIServer,
  globalSetup: async () => {
    Process.setPid(API_PID_FILE, undefined);
    Process.setPid(CLIENT_PID_FILE, undefined);

    await Promise.race([
      Promise.all([
        Application.startAPIServer(),
        Application.startClientServer()
      ]),
      new Promise((_, reject) => setTimeout(() => {
        reject(new Error('globalSetup timed out'))
      }, DEFAULT_START_TIMEOUT)),
    ])
  },
  globalTeardown: async () => {
    await Promise.race([
      Promise.all([
        Application.stopAPIServer(), 
        Application.stopClientServer()
      ]),
      new Promise((_, reject) => setTimeout(() => {
        reject(new Error('globalTeardown timed out'))
      }, DEFAULT_START_TIMEOUT)),
    ])
  }
} as const;