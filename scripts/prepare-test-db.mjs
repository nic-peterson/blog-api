import { spawn } from 'node:child_process';

const databaseUrl =
  process.env.TEST_DATABASE_URL ?? 'postgresql://postgres:postgres@127.0.0.1:5432/blog_api_test?schema=public';

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function runCommand(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(npmCommand, args, {
      stdio: 'inherit',
      env: {
        ...process.env,
        DATABASE_URL: databaseUrl
      }
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`Command failed: ${npmCommand} ${args.join(' ')}`));
    });
  });
}

async function main() {
  await runCommand(['run', 'prisma:migrate:deploy', '--workspace', '@blog/api']);
  await runCommand(['run', 'prisma:seed', '--workspace', '@blog/api']);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
