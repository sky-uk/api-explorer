# Development Recipes

## Work on the apiexplorer

1. `$ cd packages/apiexplorer` -> `$npm start`

## Work on a Sample

1. `$ npm run build:watch`
1. `$ cd samples/sample` -> `$npm start`

## Add a new project

1. `$ cd packages`
1. `$ nwb new <type> <name>` (ex: `nwb new react-app sample-b`)
1. Remove .git folder
1. Add `build:watch` script to `packages.json` (copy from other project)
1. Add required dependencies to the new project
1. `$lerna add main-component --scope sample-b`
1. You may need to `$lerna bootstrap`

