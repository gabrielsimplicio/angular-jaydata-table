(function () {
    'use strict';

    var JayDataDemoApp = angular.module("jayDataDemoApp");

    JayDataDemoApp.controller("PaginationController", paginationController);

    function paginationController($scope, $data, jayTableOptions) {
        $scope.list = [];
        $scope.selectedItems = [];

        $data
            .initService("http://localhost:54273/odata")
            .then(function (odataContext) {

                odataContext
                    .Person
                    .withCount()
                    .take(10)
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
            .addColumn("DateOfBirth").withTitle("Date Of Birth")
            .addColumn("Phone")

        $scope.options = jayTableOptions;
    }

})();