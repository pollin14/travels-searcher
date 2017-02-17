## Travels Searcher

A widget searches travels from a place to other. It is built jQuery UI's autocomplete and datepicker. It uses the design pattern of jQuery UI widget.

## How does it work?

1. The widget start with a list of places.
2. It searches places using only the name property (the label) of the place.
3. It groups the places by cities (a place is city if it is a group) and terminals (a place is terminal if it is not a group)

### Presentation formats:

Cities category shows the results in the format: city + state abbreviation.
Terminals category shows the results in the format: terminal + city + state abbreviation.

## Requirements

This plugin requires of the following jQuery UI components:

* core
* datepicker
* widget
* position
* menu
* autocomplete
* tooltip

It uses *latinize* to remove accents (diacritics)
* latinize [https://github.com/dundalek/latinize](https://github.com/dundalek/latinize)

Also, it requires the stylesheets `jquery-ui.min.css` and `theme.css` of jQuery UI.

## Optional

* *core.js/client/shim.min.js* to browser compatibility (HIGHLY RECOMMENDED)  . [corejs](https://github.com/zloirock/core-js)
* jQuery UI datepicker i18n

## Building

In order to build the widget to production use you need run

```bash
gulp build-dist
```

The command generates in the directory *dist* a stylesheet and javascript ready to use in production.

## Development

The source code of widget is inside of the directory *src*. You can run the command

```bash
gulp server
```

to create a web server that serve the demo application to test the widget. The server includes *livereload* to ease the development.

## Installation

You need include both `travels-searcher.js` and `travels-searcher.css` in the directory *dist* after build the widget, and initialize it as any other jQuery plugin. You can se the demo to a concrete example.

The plugin accept the following options (it defaults)

```javascript
{
    origin: 'input.origin',
    destination: 'input.destination',
    departureDate: 'input.departure-date',
    returnDate: 'input.return-date',
    datepicker: {
        dateFormat: 'dd/mm/yy', //Only format supported,
        numberOfMonths: 2,
        minDate: today
    },
    tooltips: {
        origin: {
            textualPosition: 'right'
        },
        destination: {
            textualPosition: 'right'
        },
        departureDate: {
            textualPosition: 'bottom'
        }
    },
    internalDateFormat: 'yy-mm-dd', //Unique format supported
    sort: identity,
    placesUrl: '/places',
    adjacencyListUrl: '/adjacency-list',
    amountResults: 5,
    searchResultsUrl: '/'
}
```

The options, `datepicker` and `tooltip` are passed to underlying widget of datepicker and tooltip, respectively