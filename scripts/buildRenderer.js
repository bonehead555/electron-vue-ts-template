const ChildProcess = require('child_process');
const Path = require('path');
const Chalk = require('chalk');

async function checkRenderer() {
  /**
  * Starts a child process to run vue-tsc to check for any errors.
  * Childs stdout and stderr are forwarded to console.log
  */

  const cmd = 'vue-tsc --noEmit --project tsconfig.vite.json';
  const childProcess = ChildProcess.exec(cmd);

  childProcess.stdout.on('data', data => {
    console.log( data.toString() );
  });

  childProcess.stderr.on('data', data => {
    console.log( data.toString() );
  });

  const code = await new Promise( (resolve) => {
    childProcess.on('close', (code) => {
      resolve(code);
    });
  });
  return code;
}

async function buildVite() {
  /**
  * Builds the Vite Production Package
  */
  const Path = require('path');
  const Vite = require('vite');
  const cwd = process.cwd();

  const viteConfig = Path.join(cwd, 'vite.config.ts');

  await Vite.build({
      ...viteConfig,
      base: './',
      mode: 'production'
  });
}

async function buildRenderer() {
  /**
   * Build the renderer.
   * Essentially it just builds the Vite production package but it validates the Vite
   * Typescript content.
   */
  divider = Chalk.blueBright('==============================================================');
  console.log(divider);
  console.log( Chalk.blueBright("Validating the Renderer's Typescript content..." ) );
  code = await checkRenderer();
  if (code !== 0) {
    console.log(Chalk.redBright(`vue-tsc execution failed with code ${code}`) );
  } else {
    console.log(divider);
    console.log( Chalk.blueBright("Building the Production Vite package..." ) );
    await buildVite();
    console.log(divider);
  }
}

// default behavior when run directly within node.js is to build a standalone Vite production package.
if (typeof require !== 'undefined' && require.main === module) {
  ( async () => {
    await buildRenderer();
  }) ();
}
exports.buildRenderer = buildRenderer;