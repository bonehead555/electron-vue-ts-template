/**
 * @file APIs for building the Electron Renderer components
 * @author bonehead555
 */

const ChildProcess = require('child_process');
const Chalk = require('chalk');

/**
* Starts a child process to run vue-tsc to check for any errors.
* Childs stdout/stderr are forwarded to process.stdout/stderr
*/
 async function checkRenderer() {
  const cmd = 'vue-tsc --noEmit --project tsconfig.vite.json';
  const childProcess = ChildProcess.exec(cmd);

  childProcess.stdout.on('data', data => {
    process.stdout.write( data.toString() );
  });

  childProcess.stderr.on('data', data => {
    process.stderr.write( data.toString() );
  });

  const code = await new Promise( (resolve) => {
    childProcess.on('close', (code) => {
      resolve(code);
    });
  });
  return code;
}

/**
* Builds the Vite Production Package
*/
async function buildVite() {
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

/**
 * Build the renderer.
 * Essentially it just builds the Vite production package but it validates the Vite
 * Typescript content.
 */
async function buildRenderer() {
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

/**
 * Following code block implements the behavior when module is run directly within node.js
 * Behavios is to build a standalone Vite production package.
 */
if (typeof require !== 'undefined' && require.main === module) {
  ( async () => {
    await buildRenderer();
  }) ();
}
exports.buildRenderer = buildRenderer;