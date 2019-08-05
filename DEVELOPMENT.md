# Development Recipes

## Work on the apiexplorer (using the demo)

If you only want to work at the core level of APIExplorer, you only need to execute the following command to run start the demo app (´packages/apiexplorer/demo/src`).

1. `$ cd packages/apiexplorer` -> `$npm start`

## Work on a Sample

To run in a Sample you may either: a) only change the sample, b) also want to change the APIExplorer core (and others).

### a) only change sample

1. `$ cd samples/<some-sample>` -> `$npm start`

### b) also want to change dependencies (APIExplorer and others)

1. `$ npm run build:watch` on each dependency
1. `$ cd samples/sample` -> `$npm start`


## Add a new project

1. `$ cd packages`
1. `$ nwb new <type> <name> --no-git` (ex: `nwb new react-app sample-b --no-git`)
1. Add `build:watch` script to `packages.json` (copy from other project)
1. Add required dependencies to the new project
1. `$ lerna add apiexplorer --scope sample-b`
1. You may need to run `$ lerna bootstrap`


## Add some apiexplorer dependency to a sample

1. `$ lerna add apiexplorer-component --scope sample`
1. `$ lerna bootstrap` (don't know why this is required! But you should run it)

