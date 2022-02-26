const ChildProcess = require('child_process');
const copyUtils = require('./copyUtils');
const Chalk = require('chalk');

async function startTSC(productionBuild = false, watch = false) {
  /**
  * Starts a child process to run the typescript compiler.
  * Childs stdout and stderr are forwarded to console.log
  * If not a productionBuild, activates the tsc inlineSourceMap and build options
  *    i.e., to provide for source debugging
  * If a productionBuild, activates the tsc clean option
  * If not in watch mode, waits and returns only after compilation completes.
  *
  * @param watch - True to start tsc in watch mode
  */

  const watchOption = !productionBuild && watch ? ' --watch' : '';
  const inlineOption = productionBuild ? '' : ' --inlineSourceMap';
  const cmd = 'tsc' + watchOption + inlineOption;
  const tscProcess = ChildProcess.exec(cmd);

  tscProcess.stdout.on('data', data => {
    console.log( data.toString() );
  });

  tscProcess.stderr.on('data', data => {
    console.log( data.toString() );
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

async function buildMain(productionBuild = false) {
  /**
   * Copies shared files to the renderer
   * Copies non typescript files form src/main to build/main
   * Then starts typescript compilation to compile the ts content to src/main
   */
  await copyUtils.copySrcShared();
  await copyUtils.copySrcMain();
  await startTSC(productionBuild);
}

// default behavior when run directly within node.js is to perform a production build.
if (typeof require !== 'undefined' && require.main === module) {
  console.log(Chalk.blueBright('=============================================================='));
  console.log( Chalk.blueBright("Building Main content..." ) );
  ( async () => {
    await buildMain(true);
  }) ();
}

exports.buildMain = buildMain;