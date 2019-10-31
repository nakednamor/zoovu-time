## Get started

create extensions files by

1. `yarn install`
2. `yarn build`

This will create a directory `dist` inside the project folder. In Chrome browser, open the extension page
 (Setting > More tools > Extensions). On the right top corner enable the `Developer mode` - this will 
 show 3 options on the top left corner - one named `Load unpacked`. Click this button and select the previously
 created `dist` directory. As a result the extension logo should be visible now.
 

## Updating the extension
If you change something in the code, run `yarn build` to update the content of the dist directory. Afterwards 
open the extensions page of Chrome and click the reload icon. Your changes should be visible now.

## Testing
You can execute all tests by running `yarn test`. Note that the build script (`yarn build`) will run the same 
command as well.