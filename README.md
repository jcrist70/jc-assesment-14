# Blue Bite Assessment

## Introduction

In this assessment you will create a front end web application that fetches Page entities from an API and renders them creating create a unique web page for each. In total there are three pages of increasing complexity and each are rendered using shared components. Pages when rendered should match the provided mockups. ([Figma](https://www.figma.com/proto/9NtrKC7KAudIqARPU4OzfL/Front-End-Assessment?page-id=0%3A1&node-id=40%3A16&viewport=241%2C48%2C0.73&scaling=scale-down&starting-point-node-id=40%3A16&show-proto-sidebar=1)).

To get started a react project is included. TypeScript is strongly recommended for this exercise. CSS modules are supported using the `.module.css` extension alternatively you can use any styling tooling/library you choose. Feel free to add other dependencies as
necessary.

Some items have been over simplifed for the sake of the assignment. We are looking for general adherence to the mockups, but we understand that based on the information given you might need to make some best guesses (font, pixel size, etc). Internally we use Zeplin to communicate requirements to engineers. 

You reach out with any questions. Any assumptions you make should be documented in the readme under *Developer Notes*. Assume that the person who reviews the exersize is not going to be the same person you interviewed with/asked questions to. 

### API

All responses return either a `data` property containing responses contents in the case of an `ok` response. Alternatively it may return an `error` property.

### GET /page/:id

Returns a description of the page. Containing several parts:

```
    {
        lists: Array<{
            id, // ID used to look up the list
            components, // Ordered list of component ids
        }>;
        components: Array<{
            id, // ID used to look up component
            type, // The type of the component (ex: `image`, `weather`)
            options, // An object with options specific to the component type
        }>;
        variables?: Array<{
            name, // Variable name
            type, // Variable type (ex: `string`)
            initialValue, // Value the variable starts at
        }> // optional not used on page-one. Should be page specific.
    }
```

### GET /integration/weather?lat=<lat>&lon=<lon>

Returns weather information for specific coordinates used in pages.


## Requirements

### Part 1
* Create image component
* Create weather component
* Render components on page

#### Notes
* Use the id (found in the pages path) via API to look up the Page entity mentioned in introduction.
* Cross referencing the Page entity and the mockups to create the `image` and `weather` components. The weather component will also require use of it's own API route described above in the introduction section.
* Using these components and the Page entity to render the page. 

##
## You can assume the list with id 0 will always be the pages root.
##

#### Mockups
* [Part 1](https://www.figma.com/proto/9NtrKC7KAudIqARPU4OzfL/Front-End-Assessment?page-id=0%3A1&node-id=40%3A16&viewport=241%2C48%2C0.73&scaling=scale-down&starting-point-node-id=40%3A16&show-proto-sidebar=1)

### Part 2
* Create Button Component
* Create Condition Component
* Setup Variables

#### Notes
This page additionally includes variables, as well as 2 new components: button, and condition.

* Variables are set to their initial values when the page is loaded.
* Buttons when clicked change a variables current value.
* Conditions are components that render their `children` list when a specific variable is equal to the given value.

On completion this page will look like the mockups and the show and hide buttons should function.

#### Mockups
* [Part 2](https://www.figma.com/proto/9NtrKC7KAudIqARPU4OzfL/Front-End-Assessment?page-id=0%3A1&node-id=78%3A48&viewport=241%2C48%2C0.73&scaling=scale-down&starting-point-node-id=78%3A48&show-proto-sidebar=1)


### Part 3
* Test previous work against a more complex page
* Fix any issues


#### Notes

This page has show and hide buttons as well as buttons which rotation through the different \
locations. There is no additional functionality but you should check your implementation against \
the more complex page configuration and resolve any issues. Again you can also check your \
implementation against the mockups.

#### Mockups
* [Part 3](https://www.figma.com/proto/9NtrKC7KAudIqARPU4OzfL/Front-End-Assessment?page-id=0%3A1&node-id=98%3A79&viewport=241%2C48%2C0.73&scaling=scale-down&starting-point-node-id=98%3A79&show-proto-sidebar=1)
* [Part 3 - NYC](https://www.figma.com/proto/9NtrKC7KAudIqARPU4OzfL/Front-End-Assessment?page-id=0%3A1&node-id=98%3A111&viewport=241%2C48%2C0.73&scaling=scale-down&starting-point-node-id=98%3A111&show-proto-sidebar=1)
* [Part 3 - SF](https://www.figma.com/proto/9NtrKC7KAudIqARPU4OzfL/Front-End-Assessment?page-id=0%3A1&node-id=98%3A151&viewport=241%2C48%2C0.73&scaling=scale-down&starting-point-node-id=98%3A151&show-proto-sidebar=1)
* [Part 3 - CH](https://www.figma.com/proto/9NtrKC7KAudIqARPU4OzfL/Front-End-Assessment?page-id=0%3A1&node-id=98%3A188&viewport=241%2C48%2C0.73&scaling=scale-down&starting-point-node-id=98%3A188&show-proto-sidebar=1)


## Submission
Upon completion of the assessment, please email your point of contact at Blue Bite a link to the repository.


## Local Setup

1. Clone repository into your GitHub account
2. Install Node version specified in `.nvmrc`
3. Use Yarn or NPM to install dependencies
4. Use 2 terminal sessions to start both the development server and the API via:
    a. `yarn run start` OR `npm run start`
    b. `yarn run start-server` OR `npm run start-server`
5. Follow steps in the `Requirements` section. Commit your work as needed.

### Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn start-server`

Runs API by default this is hosted at http://localhost:3030

### `yarn test` (Usage optional)

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## Developer Notes

### SETUP
1. open terminal 
2. git clone https://github.com/jcrist70/jc-assesment-14.git jc_assesment
-OR-
3. git clone git@github.com:jcrist70/jc-assesment-14.git jc_assesment
4. follow USING NODE 14 below if your system node is not already 14.17, oterwise skip to RUNNING PROJECT section (developed using node 16.14.0)

### USING NODE 14
1. navigate to <location>/jc_assesment
2. load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  
nvm install 14.17
nvm use
3. issue workaround
- delete lock files
- npm cache clean --force 
5. npm install

### RUNNING PROJECT
1. Open two terminals, navigate to base directory
2. terminal 1 -> npm run start-server -OR- npm run start-watch-server
3. terminal 2 -> npm start (may need to select y if port 3000 is in use) 
4. Open devtools in Chrome and switch to mobile mode for 'iPhone SE', 'iPhone XR' or 'iPhone 12 Pro'
5. NOTE: if a different port is used, search root project directory for BASE_URL and PORT and update all occurences.  Expect to need to make this update for the playwright test file.

### TESTING 
- I have added detection for the server returning an error.  This can be tested by entering in an invalid page id (i.e. localhost:PORT/page-not).  The code will alert the error message returned from the Axios call and then redirect to "/"
#### Playwright
- One test file was included (/tests/ui..)
- Within this file, there are several tests, to 
execute only one add '.only' after test (i.e. 'test.only('...)) designation 
- BASE_URL & PORT are hardcoded and will need to be updated if the UI is not at "http://localhost:3000/"
##### Run Tests - Run Commands from project directory via terminal
- Start the server and UI outlined in RUNNING PROJECT above then wait for it to be functional (i.e. test links and verify that the pages are loading).  Now you can run either of the next two commands to run playwright and then the third to display the report.  If any tests fail the report will be automatically loaded.
- npx playwright test --project=chromium 
- npx playwright test --project=chromium --headed
- npx playwright show-report

### ASSUMPTIONS & NOTES
1. be it show_weather or show_image, we do not want both show and hide buttons visible at the same time (my interpretation)
2. since there is no mode label included in the Figma slides, the show/hide buttons will look identical no matter which variable they are operating on -> FUTURE: one option: add variable label (i.e. 'City' or 'Weather', my interpretation)  
3. The styling is setup for ['iPhone SE', 'iPhone XR', 'iPhone 12 Pro'], I have not added media detection and alternate styling. (no explicit specification)
4. The styling is setup for Chrome, I have not added support for other browsers. (no explicit specification)
5. The info.component.css is included for my test/dev/troubleshooting purposes and can be ignored.  If you want to package an obj nicely as a component on the DOM, just copy the button jsx and change the classNames to info-*.

### FUTURE
- create a range of page data to test all potential corner cases
- convert many of the js files to typescript
