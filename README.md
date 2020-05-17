# Easy Static Ref Generator
Easy Static Ref Generator (ESRG) simplifies the process of building (mostly) static* HTML reference pages for REST APIs with a uniform look and feel.

The project's flexible, lightweight model helps you get started without investing hours learning to use a platform like Gatsby. 

Quickly define and build one or more static HTML pages for [Swagger/OpenAPI](https://swagger.io/) REST API documentation with:
- A single config.json file
- A YAML API definition for each reference
- A single [Handlebars](https://handlebarsjs.com/) template
- A few [gulp.js](https://gulpjs.com/) tasks
- [ReDoc](https://github.com/Redocly/redoc) to translate and format your YAML definitions

*(mostly) static in that ReDoc dynamically translates the YAML in the browser.

## Contents
[Install](#install)
[Dependencies](#dependencies)
[Project Structure](#project-structure)
[Project Components](#project-components)
[Get Started](#get-started)
[Build](#build)
[Serve](#serve)
[Publish](#publish)

## Install
Before you start, you need [nodejs](https://nodejs.org/en/) version 10 or higher, [npm](https://www.npmjs.com/package/npm), and the [gulp-cli](https://gulpjs.com/docs/en/getting-started/quick-start#install-the-gulp-command-line-utility) installed globally.

Then, run the following commands to open the project, install all Node packages, build the example page, and serve it:

```bash
# Clone the repo
git clone < insert Easy Static Ref Generator GitHub URL here >

# Change into the repo directory
cd easy-static-ref-generator

# Install Node packages
npm install

# Build the example page
gulp makeDocs

# Serve the example page locally
npx serve build
```

To view the example page, open localhost:5000 in your browser and click on **example-slug-for-ref** to open the reference.

## Dependencies
- [handlebars](https://handlebarsjs.com/) - simple templating language used to define a common layout for all generated HTML pages
- [gulp](https://gulpjs.com/) - taskrunner and build system for front-end web development used to build the static HTML files and create the /build directory
- [gulp-clean-css](https://github.com/scniro/gulp-clean-css) - gulp plugin used to minify css files before moving stylesheets to the /build directory
- [gulp-compile-handlebars](https://github.com/thegrubbsian/gulp-compile-handlebars) - gulp plugin used to precompile handlebars templates into HTML
- [gulp-rename](https://www.npmjs.com/package/gulp-rename) - gulp plugin enabling easy file renaming during gulp tasks
- [gulp-uglify](https://www.npmjs.com/package/gulp-uglify) - gulp plugin used to minify JavaScript files before moving scripts to the /build directory
- [serve](https://github.com/zeit/serve) - lets you serve the built pages from your local computer so you can easily view the rendered YAML before publishing 

## Project Structure
```
handlebars-poc
|   README.md
|   .gitignore
|   gulpfile.js
|   package.json
|   package-lock.json
|
|___assets
|   |___images
|       |   ...
|
|   |___scripts
|       |   redoc.standalone.js
|       |   < add more JavaScript snippets here >
|
|   |___styles
|       |   < your local stylesheet >.css
|
|___config-files
|   |   config.json
|   |   < add more config files here if needed >
|
|___templates
|   |   api-ref.handlebars
|
|___yaml
|   |   ...
|
|___node_modules
|   |   ...
|
|---build (not tracked)
```



## Project Components
### api-ref.handlebars
The api-ref.handlebars template defines all common HTML content. Include elements like a header and footer with handlebars notation in this file. Note that the provided redoc-standalone.js ```<script>``` tag and ```<redoc>``` element must remain in this template for proper rendering.

### config.json
Use this config file to define variable properties for each reference you want to build. 

config.json requires the following properties for for each *individual* reference:
#### Required
- title - appears as the browser tab title
- slug - URL [slug](https://developer.mozilla.org/en-US/docs/Glossary/Slug) for the reference
- YAML source file - the associated YAML source file for the reference
- description - metadata description for the generated page to improve site SEO
#### Optional
- hide - adds ```<meta name="robots" content="noindex,nofollow,noarchive" />``` to the ```<head>``` of the page in question to hide the reference from seach engine crawlers. Set this property when you want to publish a reference intended for a limited audience.

Optionally include additional fields for each reference to define variables for use in api-ref.handlebars. For example, to add an outlink to an associated developer guide for each API reference, create a field called "outlink" in config.json for each reference, then use its value in api-ref.handlebars:
```HTML
    <a src='{{ outlink }}'>Visit the developer guide</a>
```

### gulpfile.js
Gulpfile.js does most of the heavy lifting in this project, defining tasks you can execute from the command line.
Example:

```bash
gulp < insert task name >
```

#### gulp tasks
- **makeDocs** - calls cleanBuild to remove the /build directory, then calls moveAssets and makeDocs.
- **cleanBuild** - removes the /build directory and its contents.
- **makeHtml** - makes  HTML documents for each api ref specified in
config.json based on the slug for each reference.
- **moveYaml** - moves all YAML source files to the /build directory for easy bundling.
- **moveAssets** - minifies JavaScript and CSS files, moves assets to the /build directory, and calls moveYaml.

## Get Started
This basic tutorial will show you how to:
- Add and build a new REST API reference.
- Customize your common reference theme by modifying api-ref.handlebars.

Before you start, make sure you've [installed the project](##Installation) on your machine.

### 1. Add your Swagger API YAML to the /yml folder
Write up your REST API reference in YAML according to the [Swagger/OpenAPI](https://swagger.io/resources/open-api/) specification 

### 2. Define a new API reference object in config.json
Add a new object to the list in [config.json](###config.json) for the reference you want to create, making sure to include values for the following properties:
- [title](####Required)
- [slug](####Required)
- [yamlSource](####Required)
- [description](####Required)

You can also include more fields for use as variables in the api-ref.handlebars template. 

### 3. Customize api-ref.handlebars
Open [api-ref.handlebars](###api-ref.handlebars) in your editor. Note that it comes with placeholder header and footer elements, some pre-defined meta tags, and the required ```<redoc>``` element and script tag.

![iamge of api-ref.handlebars contents](/assets/images/handlebars-template.PNG)

Modify the template as you see fit. Consider changing the header or footer, adding a breadcrumb for navigation, or including an interactive feedback module. See the official [Handlebars docs](https://handlebarsjs.com/guide/) for details on customizing the api-ref.handlebars template. 

Remember that api-ref.handlebars defines common elements that will be visible on each of your generated API reference pages.

### 4. Build and serve your references locally
Use the ```makeDocs``` gulp command to build your static API references. See [Building](##Build) for more information.

Then, [serve your references locally](##Serve).


## Build
Once you've set up config.json and customized api-ref.handlebars, you can build all HTML files using the following command:
```bash
gulp makeDocs
```
You will see a series of messages like the following, indicating that any existing build artifacts have been removed, all assets have been moved (and scripts/css minified), and all HTML pages have been generated and placed in the /build directory.

![successful build messages](/assets/images/build-messages.PNG)

The /build directory should now contain the following files:
```
build
|___assets
|   |___images
|       |  < associated images used in api-ref.handlebars or your README > 
|
|   |___scripts
|       |   redoc.standalone.js (minified)
|
|   |___styles
|       |   < associated local stylesheets >
|
|___yaml
|   |   all YAML source files
|
|___.html files for each reference defined in config.json
```

## Serve
To see the rendered YAML locally, you need to use the [serve](https://github.com/zeit/serve) package to serve the /build directory from your computer. 

After running `gulp makeDocs`, start up `serve` with the following command in the terminal:
```bash
npx serve build
```

You should see this message in the terminal:

![successful serve message](/assets/images/build-serving.PNG)

Open localhost:5000 in your browser to see a basic render of the /build directory's contents.

Click on the page you want to view:

![view page locally](/assets/images/build-open-page.PNG)

To stop serving locally, type `ctrl+c` to force-close all sockets and then enter 'y' to signal a complete stop.

## Publish
Serve all bundled contents of the /build directory.
