# Easy Static Ref Generator
Easy Static Ref Generator (ESRG) lets you generate static API reference pages with a uniform look and feel. With ESRG, you can modify Redoc-rendered API pages with custom page elements. For example, you can add a custom page header so that your API reference has the same header as your user guide. 

With ESRG, you define and build API reference pages using the following components:
- A single config.json file
- An OpenAPI YAML API definition for each reference
- A single [Handlebars](https://handlebarsjs.com/) template
- A few [gulp.js](https://gulpjs.com/) tasks
- [Redoc](https://github.com/Redocly/redoc) to render your YAML definitions


## Contents
1. [Install](#install)
2. [Dependencies](#dependencies)
3. [Project structure](#project-structure)
4. [Project components](#project-components)
5. [Get started](#get-started)
6. [Build](#build)
7. [Serve locally](#serve-locally)
8. [Publish](#publish)
9. [License](#license)
10. [Author](#authordeveloper)

## Install
Before you start, you need [nodejs](https://nodejs.org/en/) version 10 or higher, [npm](https://www.npmjs.com/package/npm), and the [gulp-cli](https://gulpjs.com/docs/en/getting-started/quick-start#install-the-gulp-command-line-utility).

[Fork](https://help.github.com/en/github/getting-started-with-github/fork-a-repo) the project to create a copy of the repository under your GitHub account. Then run the following commands to clone the project and try it out:

```bash
# Clone the repo
git clone < your remote repository URL >

# Change into the repo directory
cd easy-static-ref-generator

# Install Node packages
npm install

# Build the example page
gulp makeDocs

# Serve the example page locally
npx serve build
```

he example page uses Swagger's Petstore (1.0.0) example API. To view the example page, open ```localhost:5000``` in your browser and click on **example-slug-for-ref**.

## Dependencies
- [handlebars](https://handlebarsjs.com/) - a simple templating language used to define a common layout for all generated HTML pages.
- [gulp](https://gulpjs.com/) - a taskrunner and build system for front-end web development used to build your static HTML files in a directory called /build.
- [gulp-clean-css](https://github.com/scniro/gulp-clean-css) - a gulp plugin that minifies CSS files before moving stylesheets to the ```/build``` directory.
- [gulp-compile-handlebars](https://github.com/thegrubbsian/gulp-compile-handlebars) - a gulp plugin that precompiles handlebars templates into HTML.
- [gulp-rename](https://www.npmjs.com/package/gulp-rename) - a gulp plugin enabling easy file renaming during gulp tasks.
- [gulp-uglify](https://www.npmjs.com/package/gulp-uglify) - a gulp plugin that minifies JavaScript files before moving scripts to the ```/build``` directory.
- [serve](https://github.com/zeit/serve) - a node package for serving static files from your local computer.

## Project structure
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
|___node_modules (not tracked)
|   |   ...
|
|---build (not tracked)
```



## Project components
### templates/api-ref.handlebars
The **api-ref.handlebars** template defines all common HTML content. Include elements like a header and footer with Handlebars notation in this file. Note that the provided **redoc-standalone.js** ```<script>``` tag and ```<redoc>``` element must remain in this template for proper rendering.

### config-files/config.json
Use this config file to define properties for each reference you want to build. 

**config.json** defines the following properties for for each *individual* reference page:
#### Required
- title - a browser title for the reference.
- slug - a URL [slug](https://developer.mozilla.org/en-US/docs/Glossary/Slug) for the reference.
- yamlSource - your YAML source file for the reference.
- description - a metadata description for the generated page to improve site SEO.
#### Optional
- hide - adds ```<meta name="robots" content="noindex,nofollow,noarchive" />``` to the ```<head>``` of the page in question to hide the reference from search engine crawlers. You can set this property to publish a reference for a limited audience.

You can include additional properties to use in **api-ref.handlebars** in your **config.json** file. For example, to add a link to an associated developer guide for each API reference, you can create a field called "guidelink" in **config.json** for each reference. Then use "guidelink" in **api-ref.handlebars** to specify the link:
```HTML
<a href='{{ guidelink }}'>Visit the developer guide</a>
```

### gulpfile.js
**gulpfile.js** does most of the heavy lifting in this project. The file defines tasks you can execute from the command line.
Example: 

```bash
gulp < insert task name >
```

#### gulp tasks
- **makeDocs** - calls ```cleanBuild``` to remove the ```/build``` directory, then calls ```moveAssets``` and ```makeHtml```.
- **cleanBuild** - removes the ```/build``` directory and its contents.
- **makeHtml** - makes HTML documents for each api ref specified in
config.json based on the slug for each reference.
- **moveYaml** - moves all YAML source files to the ```/build``` directory for easy bundling.
- **moveAssets** - minifies JavaScript and CSS files, moves assets to the ```/build``` directory, and calls ```moveYaml```.

## Get started
This basic tutorial will show you how to:
- Add and build a new REST API reference.
- Customize your common reference theme by modifying **api-ref.handlebars**.

Before you start, make sure you've [installed the project](#install) on your machine.

### 1. Add your Swagger API YAML to the /yaml folder
Write up your REST API reference in YAML format according to the [Swagger/OpenAPI](https://swagger.io/resources/open-api/) specification, then add it to the /yaml folder.

### 2. Define a new API reference object in config.json
Add a new object to the list in [config.json](#config-filesconfigjson) for the reference you want to create. Make sure to include values for the following properties:
- [title](#required)
- [slug](#required)
- [yamlSource](#required)
- [description](#required)

You can also include more fields to use as variables in your **api-ref.handlebars** template. 

### 3. Customize api-ref.handlebars
Open [api-ref.handlebars](#templatesapi-refhandlebars) in your editor. Note that it comes with placeholder header and footer elements, some predefined meta tags, and the required ```<redoc>``` element and script tag.

![image of api-ref.handlebars contents](/assets/images/handlebars-template.PNG)

Modify the template as you see fit. Consider changing the header or footer, adding a breadcrumb for navigation, or including an interactive feedback module. See the official [Handlebars docs](https://handlebarsjs.com/guide/) for details on customizing the **api-ref.handlebars** template. 

Remember that **api-ref.handlebars** defines common page elements that will be visible on each of your generated API reference pages.

### 4. Build and serve your references locally
Use the ```makeDocs``` gulp command to build your static API references. See [Build](#build) for more information.

Then, [serve your references locally](#serve-locally).


## Build
Once you've set up **config.json** and customized **api-ref.handlebars**, you can build all HTML files using the following command:
```bash
gulp makeDocs
```
You will see a series of messages like the following, indicating that any existing build artifacts have been removed, all assets have been moved (and scripts/css minified), and all HTML pages have been generated and placed in the ```/build``` directory.

![successful build messages](/assets/images/build-messages.PNG)

The ```/build``` directory should now contain the following files:
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

## Serve locally
To see the rendered YAML locally, use the [serve](https://github.com/zeit/serve) package to serve the ```/build``` directory from your machine. 

After running `gulp makeDocs`, start serving with the following command:
```bash
npx serve build
```

You should see this message:

![successful serve message](/assets/images/build-serving.PNG)

Open localhost:5000 in your browser to see the ```/build``` directory's contents:
![view page locally](/assets/images/build-open-page.PNG)

Select the page you want to view. For example, ```example-slug-for-ref``` in the image above.

You should see a page like the following:
![example-slug-for-ref page in the browser](/assets/images/build-example-page.png)

To stop serving locally, type `ctrl+c` to stop the process.

## Publish
Serve all bundled contents of the ```/build``` directory statically.

If you're looking for an easy way to host a static website, consider using [Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html).

## License
### Easy Static Ref Generator
MIT

Copyright 2020 Kendra Ellis

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

### Swagger Petstore (1.0.0) example API
[Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0.html)

## Author/Developer
Kendra Ellis ([ellisken](https://github.com/ellisken/))
### Credits
ReDoc and OpenAPI/Swagger for Swagger Petstore (1.0.0).
