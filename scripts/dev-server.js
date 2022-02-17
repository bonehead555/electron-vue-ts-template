process.env.NODE_ENV = 'development';

const Vite = require('vite');
const ChildProcess = require('child_process');
const copySrcMain = require('./copyUtils').copySrcMain;
const Path = require('path');
const Chalk = require('chalk');
const Chokidar = require('chokidar');
const Electron = require('electron');

const cwd = process.cwd();
let electronProcess = null;
let rendererPort = 0;

function sychStartTSC() {
  let result = ChildProcess.execSync(`tsc`, { stdio: 'inherit'});
  if (result) {
    console.log( result.toString() );
  }
}

async function startTSC(watch = false) {
  /**
  * Starts a child process to run the typescript compiler.
  * Childs stdout and stderr are forwarded to console.log
  * If not in watch mode, waits and returns only after compilation completes.
  *
  * @param watch - True to start tsc in watch mode
  */

  const cmd = watch ? 'tsc -w' : 'tsc';
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

async function buildMain() {
  /**
   * Copies non typescript files form src/main to build/main
   * Then starts typescipt compilation to comile the ts content to src/main
   */
  await copySrcMain();
  await startTSC();
}

async function startRenderer() {
  /**
  * Starts a developent mode Vite server.
  *
  * @returns  Vite Dev Server Instance
  */
  const config = Path.join(cwd, 'vite.config.ts');
  const server = await Vite.createServer({
      ...config,
      mode: 'development',
  });
  return server.listen();
}

function startElectron() {
  /**
  * Starts an Electron child process, i.e., if one is not already running.
  * Electron's stdout and stderr are forwarded to console.log
  * On normal Electron exit, this script process exits
  *    along with all of its child processes
  */
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
      console.log(Chalk.blueBright(`[Electron] `) + Chalk.white(data.toString()));
  });

  electronProcess.stderr.on('data', data => {
      console.log(Chalk.redBright(`[Electron] `) + Chalk.white(data.toString()));
  });

  electronProcess.on('exit', (code) => {
    if (code !== null) {
      console.log(Chalk.blueBright(`Electron process exited with code ${code}`));
      process.exit();
    }
  });
}

function restartElectron() {
  /**
  * Restarts Electron child process
  */
  if (electronProcess) {
      electronProcess.kill();
      electronProcess = null;
  }
  startElectron();
}

async function start() {
  /**
  * Runs the typescript compilation process
  * Intilates the Vite Dev server
  * Initiates the Electron child process
  * Initiates watch for typescript source changes in main and common and 
  *     Reruns the typescript compilation process
  *     Restarts the Electron child process
  */
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
