/**
 * @file APIs for managing the build and execution of a development version of the app.
 * @author bonehead555
 */

/** Sets the NODE_ENV environment variable to indicate the Electron is running in development mode. */
process.env.NODE_ENV = 'development';

const Vite = require('vite');
const ChildProcess = require('child_process');
const buildMain = require('./buildMain').buildMain;
const Path = require('path');
const Chalk = require('chalk');
const Chokidar = require('chokidar');
const Electron = require('electron');

const cwd = process.cwd();
let electronProcess = null;
let rendererPort = 0;

/**
* Starts a developent mode Vite server.
*
* @returns  Vite Dev Server Instance
*/
async function startRenderer() {
  const config = Path.join(cwd, 'vite.config.ts');
  const server = await Vite.createServer({
      ...config,
      mode: 'development',
  });
  return server.listen();
}

/**
* Starts an Electron child process, i.e., if one is not already running.
* Electron's stdout and stderr are forwarded to console.log
* On normal Electron exit, this script process exits
*    along with all of its child processes
*/
function startElectron() {
  if (electronProcess) { // single instance lock
      return;
  }

  // Electron arguments will be <path to main.js>, <VitePort#>
  const args = [
      Path.join(cwd, 'build', "main", 'main.js'),
      rendererPort,
  ];

  electronProcess = ChildProcess.spawn(Electron, args);

  electronProcess.stdout.on('data', data => {
    process.stdout.write(Chalk.blueBright(`[Electron] `) + Chalk.white(data.toString()));
  });

  electronProcess.stderr.on('data', data => {
    process.stdout.write(Chalk.redBright(`[Electron] `) + Chalk.white(data.toString()));
  });

  electronProcess.on('exit', (code) => {
    if (code !== null) {
      console.log(Chalk.blueBright(`Electron process exited with code ${code}`));
      process.exit();
    }
  });
}

/**
* Restarts Electron child process
*/
function restartElectron() {
  if (electronProcess) {
      electronProcess.kill();
      electronProcess = null;
  }
  startElectron();
}

/**
* Runs the typescript compilation process
* Intilates the Vite Dev server
* Initiates the Electron child process
* Initiates watcher for typescript source changes in main and when needed ... 
*     Reruns the typescript compilation process
*     Restarts the Electron child process
*/
async function start() {
    divider = Chalk.blueBright('==============================================================');
    console.log( divider );
    console.log( Chalk.blueBright("Starting Main's Build Process..." ) );
    await buildMain();

    console.log( Chalk.blueBright(divider) );
    console.log( Chalk.blueBright('Starting Vite Dev Server...') );
    const devServer = await startRenderer();
    rendererPort = devServer.config.server.port;
    console.log( Chalk.blueBright('Vite Dev Server Started on Port: ') + 
       Chalk.greenBright( rendererPort.toString() ) );

    console.log( Chalk.blueBright(divider) );
    console.log( Chalk.blueBright('Starting Electron...') );
    startElectron();

    console.log( Chalk.blueBright(divider) );
    console.log( Chalk.blueBright('Starting Watcher of Electron Source Files ...'))
    Chokidar.watch(Path.join(__dirname, '..', 'src', 'main')).on('change', async () => {
      console.log( Chalk.blueBright(divider) );
      console.log( Chalk.blueBright( "Electron Source File Changed!") );
      console.log( Chalk.blueBright("Rerunning Main's Build Process...") );
      await buildMain();
      console.log( Chalk.blueBright('Restarting Electron ...'))
      restartElectron();
      console.log( Chalk.blueBright(divider) );
    });
    console.log( Chalk.blueBright(divider) );
}

// GO
start();
