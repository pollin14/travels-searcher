# Travels Searcher

It is angular module with a directive to do search of travels widget of ClickBus.

## Requirements

The project use

* *grunt* as task runner
* *bower* as packages manager
* *sass* as css preprocessor.
* *angular* as javascript framework
* *karma* as framework to unit test
* *jshint* as quality tool to Javascript source code
* *jscs* to code style check

You have to install this tools to can develop the project.

## Conventions

### Directories structure

```text

src
    |- scripts
        |- controllers
        |- directives
        |- services
        |- filters
        |- configs
        |- values
        |- const
        |- travelsSeacher.js
    |- styles
    |- views
    |- images
```

The name of the files follow a angular's directive name convention. Namely, it uses camel case style but the first letter must be in lower case. For example, `firstLetterNoInCamelCase.js`. In this way, the file name is consistent with the angular's component name. Similar to the convention of class name equal file name in OOP.

However, the images, stylesheets and views must use a dash style to the file name. For example, `an-dash-style.css`.

### CSS selectors

The css selectors must have a dash style name. For example, `.button-green`. In this way, the selectors follow the same style than the properties of css.

### Angular components

Each angular component must have the next basic structure

```js
'use strict';

angular
    .module('travelsSearcher')
    .controller('controllerName', function ($scope) {

    });
```

There are two important parts in this structure. The first, it retrieves the module previously defined. And second, the dependencies injection not use the annotation style. It is so because we use a grunt's task to generate these annotations.

Also, each component must be in its own file.

## Installation

Run `npm install && bower install`.

## Build & development

Run `grunt` for building and `grunt serve` for preview the demo.

## Testing

Running `grunt test` will run the unit tests with karma.
