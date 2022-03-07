# Electron Vue TypeScript Template

A starter template that's bundled together with **Electron 16.x**, **VueJS 3.x**, **TypeScript 4.x**, **ViteJS** and **Electron Builder** 👌

## About

This project was inspired by [electron-vue-template](https://github.com/iamshaunjp/git-playlist) which per its author's words "got inspired by [electron-vue](https://github.com/SimulatedGREG/electron-vue)"

For developement mode, this template uses [ViteJS](https://vitejs.dev) for the server providing HMR (Hot Reload) for the Electron renderer process components. Further, it implements its own watcher for the Electron  main process content and restarts Electron proper when any of the main process conponents change.

Building a distributable Electron application is done by [Electron Builder](https://www.electron.build/), making your application cross-platform and easily distributable!

This template comes with few unnecessary dependencies and is mostly unopinionated, therefore, you can start developing your Electron / Vue applications using TypeScript however you want.

## Getting started using this template
### Assumptions and Preconditons
- A recent verion of node.js mut be installed.
- Development tools, e.g., Visual Studio Code must be installed.
- It is assumed that you plan to leverage this project to build a your ***own*** application, and you don't want to clone the project complete with its existing GIT history. 

### Installation Steps

1. Navigate to the GitHub folder for this template, i.e., https://github.com/bonehead555/electron-vue-ts-template.

1. Click on the green button labeled "Code" and then the dropdown selection labeled "Download ZIP". A ZIP file containing the template will begin downloading to your computer, usually within your Downloads folder.

1. Open your Downloads folder on your computer and find the ZIP file. Right-click it and choose the option that says Extract All…, Unzip, or Uncompress, and then select the folder where you want your project to end up.

1. Navigate to the folder that holds the unziped project and rename the project folder from "electron-vue-ts-project" to your chosen project project name, e.g., "my-awesome-new-project".
1. Open a command line terminal, or a git bash terminal, or the like; and execute the following commands:

    ```bash
    cd my-awesome-new-project
    npm install
    npm run dev
    ```

That's all, an Electron app should launch showing the simple content provided by the template!

## About Vue 3 + Typescript + Vite
At the time this template was created, the following was recommeded by the Vite team for Vue development.

### Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

### Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's `.vue` type support plugin by running `Volar: Switch TS Plugin on/off` from VSCode command palette.

## NPM Commands
The following NPM commands are important for users of this template to be aware of.

```bash
npm run dev # starts the application with hot reload
npm run build # builds a distributable application

# OR

npm run build:win # uses windows as build target
npm run build:mac # uses mac as build target
npm run build:linux # uses linux as build target

# OR

npm run check-srv # checks for TypeScript errors in the VUE content.

# Other NPM scripts exist which were useful during the development of the template; generally these will not be useful to those leveraging the template for their own project.
```
## Misc Notes
Optional electron builder configuration options can be found in the [Electron Builder CLI docs](https://www.electron.build/cli.html).

## Project Structure
| Folder | Description |
| --- | ---|
| *.vscode* | Houses Visual Studio Code configuration information (if using Visual Studio Code) |
| **build** | Houses content that is created during the build processes. Created as needed by the “build” tooling. |
| **build/main** | Houses compiled outputs and other assets required for the execution of the Electron main process. |
| **build/renderer** | Houses compiled outputs and other assets required for serving content for the Electron renderer process. |
| **dist** | Houses the content that is created when a distributable Electron application is requested. Created as needed by electron builder tooling. |
| *node_modules* |Node package folders.  Managed as needed by NPM. |
| **scripts** | Houses script (*.js) files used to help automate the development and build processes.
| **src** | Houses all of the source files required for the electron application. |
| **src/main** | Houses all of the source files required to build the electron main process.  Extend this folder structure as you require. |
| **src/main/shared** | Houses all of the source files that need to be available from both the Electron main and Electron renderer processes.  Note: Content in this folder will automatically be made available to the src/renderer/shared folder structure. |
| **src/renderer** | Houses all of the source files required to build the Electron renderer processes.  Additional folders exist beneath this location but (except for shared) these are the default folders created by Vite.  Modify the content in these folders as you require. |
|**src/render/shared** | Houses a copy of src/main/shared so that it can be accessed by the render. Do not modify the content in this folder. |

End of README.md



