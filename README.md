# angular-jaydata-table
AngularJS directive for those using HTML tables and jaydata.

# Installation

#### Install with Bower

```sh
$ bower install angular-jaydata-table
```

# Basic usage

#### Add dependency to your project
```js
var MyApp = angular.module('myModule', ['angular-jaydata-table']);
```

#### HTML
```html
<jay-table list="list" options="options" selected-items="selectedItems"></jay-table>
```

#### JS
```js
MyApp.controller("MyController", function ($scope, $data, jayTableOptions) {

    $scope.list = [];
    $scope.selectedItems = [];

    $data //Jaydata service
        .initService(<odata-url>)
        .then(function (odataContext) {

            odataContext
                .School
                .toArray()
                .then(function (school) {
                    $scope.$apply(function () {
                        $scope.list = school;
                    });
                });
        })

    jayTableOptions
        .initializeHeader()
        .addColumn("Name")
        .addColumn("Address")

    $scope.options = jayTableOptions;
});
```

#### Optional Config

Set default empty table text, if you prefer.

```js
MyApp.config(function (jayTableConfigProvider) {
    jayTableConfigProvider.setEmptyText('This table is empty!');
});
```

# Demo

Take a look at [directive in action](http://gabrielsimplicio.github.io/angular-jaydata-table/) and [demo project](https://github.com/gabrielsimplicio/angular-jaydata-table/tree/master/demo) to see more options.

#### Enjoy it! ;)