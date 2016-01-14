(function () {
    'use strict';

    JayDataDemoApp.controller("ConcatColumnsJavascriptController", function ($scope, $data, jayTableOptions) {

        $scope.list = [];
        $scope.selectedItems = [];

        $data
            .initService("http://angular-jaydata-table.azurewebsites.net/odata")
            .then(function (odataContext) {

                odataContext
                    .School
                    .include("City")
                    .toArray()
                    .then(function (people) {
                        $scope.$apply(function () {
                            $scope.list = people;
                        });
                    });
            })
            .fail(function (error) {
                console.log(error);
            });

        jayTableOptions
            .initializeHeader()
            .addColumn("Name")
            .addColumns()
                .withTitle("Address/City")
                .like(function () {
                    return this.Address + "/" + this.City;
                })
                .add("Address").as("Address")
                .add("City.Name").as("City")

        $scope.options = jayTableOptions;
    });
})();