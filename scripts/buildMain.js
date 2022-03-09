/**
 * @file APIs for building and copying the Electron Main assets
 * @author
 *
 * This file provides APIs for building / copying assets needed by the Electron Main process 
 * to the build/main folder.
 * Also for transferring shared assets from src/main/shared to the src/renderer/shared.
 */

const ChildProcess = require('child_process');
const copyUtils = require('./copyUtils');
const Chalk = require('chalk');

/**
* Starts a child process to run the typescript compiler.
* Child's stdout/stderr are forwarded to process.stdout/stderr
* If not a productionBuild, activates the tsc inlineSourceMap and build options
*    i.e., to provide for source debugging
* If a productionBuild, activates the tsc clean option
* If not in watch mode, waits and returns only after compilation completes.
*
* @param watch - True to start tsc in watch mode
*/
async function startTSC(productionBuild = false, watch = false) {
  const watchOption = !productionBuild && watch ? ' --watch' : '';
  const inlineOption = productionBuild ? '' : ' --inlineSourceMap';
  const cmd = 'tsc' + watchOption + inlineOption;
  const tscProcess = ChildProcess.exec(cmd);

  tscProcess.stdout.on('data', data => {
    process.stdout.write( data.toString() );
  });

  tscProcess.stderr.on('data', data => {
    process.stderr.write( data.toString() );
  });

  if (!watch) {
    const code = await new Promise( (resolve) => {
      tscProcess.on('close', (code) => {
        resolve(code);
      });
    });
    if (code !== 0) {
      console.log(Chalk.redBright(`TSC execution failed with code ${code}`) );
    }
  }
}

/**
 * Copies shared files to the renderer
 * Copies non-TypeScript files form src/main to build/main
 * Then starts TypeScript compilation to compile the ts content to src/main
 * @param productionBuild True is compile is for a production build, 
 * False (default) if compile s for a development build.
 */
async function buildMain(productionBuild = false) {
  await copyUtils.copySrcShared();
  await copyUtils.copySrcMain();
  await startTSC(productionBuild);
}

/**
 * This code segment provides the behavior of this module when the module is 
 * run directly from node.js.
 * When run this way the code performs a production build.
*/
if (typeof require !== 'undefined' && require.main === module) {
  console.log(Chalk.blueBright('=============================================================='));
  console.log( Chalk.blueBright("Building Main content..." ) );
  ( async () => {
    await buildMain(true);
  }) ();
}

/** Exported buildMain function */
exports.buildMain = buildMain;