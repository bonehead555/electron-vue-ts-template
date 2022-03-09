/**
 * @file Low leveal APIs for copying the Electron Main assets to the build and shared folders
 * @author bonehead555
 */

const copyfiles = require('copyfiles');

/**
* Determines if parameter is of type string 
* @param x Parameter to check
* @returns Returns true if parameter is a string
*/
 function isString(x) {
  return Object.prototype.toString.call(x) === "[object String]"
}

/**
* Copies files from sourcePath to destPath excluding speified files
*
* @param srcPath -      A string holding the file path to copy from.  
*                       Glob paths and wildcards are allowed.
*                       Note: Paths must use forward slash delimeter and not backslash
* @param destPath -     A string holding the file path to copy to.
*                       May be a file or dirctory path.
*                       Glob paths and wildcards are NOT allowed
* @param excludePaths -  [Optional] A string [or array of strings] that holds file
*                       file types to be excluded.
* @returns              Status code for the copy operation
*/
async function copyfilesEx(srcPath, destPath, excludePaths) {

  // initial copy options for copyfiles library
  let copyOptions = { 
    // "error": true,
    // "verbose": true,
  };

  // check if we have a valid exclude path
  if (!excludePaths) {
    // its optional, so no additional options is ok
  } else if ( isString(excludePaths) ) {
    copyOptions = {...copyOptions, "exclude": [excludePaths] }
  } else if ( Array.isArray(excludePath) ) {
    copyOptions = {...copyOptions, "exclude": excludePaths }
  } else {
    return new Promise( (resolve, reject) => resolve( "copyfilesEx: Exclude Parameter is neither a string or array type"));
  }

  // compute the up value, i.e., the number of segements before a glob or wildcard
  segments = srcPath.split("/");
  let up = 0;
  for (i=0; i < segments.length; i++) {
    if ( segments[i].includes("*") ) {
      up = i;
      break;
    }
  }
  copyOptions = {...copyOptions, "up": up }

  // perform or at least attempt to perform the copy using copyfiles
  return new Promise( (resolve, reject) => {
    //console.log(`Source Path: ${srcPath}`);
    //console.log(`Destination Path: ${destPath}`);
    //console.log(copyOptions);
    try {
      copyfiles( [srcPath, destPath], copyOptions, (copyError) => {
        const copyResult = (copyError) ? "copyfiles: " + result.message : null;
        resolve();  
      });
    } catch (error) {
      resolve("copyfiles: " + error.message);
    }
  });
};

/**
* Copy "src\main\**\*.*" to "build/main" excluding "*.ts" files
* Note: Assumes this is being run with the current working dirctory set to the project folder.
*/
async function copySrcMain() {
  const error = await copyfilesEx("src/main/**/*.*", "build/main", "**/*.ts");
  if (error) {
    console.error(error)
  }
}

/**
* Copy "src\main\shared\**\*.*" to "src\renderer\shared"
* Note: Assumes this is being run with the current working dirctory set to the project folder.
*/
async function copySrcShared() {
  const error = await copyfilesEx("src/main/shared/**/*.*", "src/renderer/shared");
  if (error) {
    console.error(error)
  }
}

if (typeof require !== 'undefined' && require.main === module) {
  ( async () => {
    await copySrcMain();
  }) ();
}

/** Export of function that copies assets to the build/main folder. */
exports.copySrcMain = copySrcMain;
/** Export of function that copies assets to the renderer/shared folder. */
exports.copySrcShared = copySrcShared;