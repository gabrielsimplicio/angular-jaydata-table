(function () {
    'use strict';

    var JayDataDemoApp = angular.module("jayDataDemoApp");

    JayDataDemoApp.controller("BasicController", basicController);

    function basicController($scope, $data, jayTableOptions) {
        $scope.list = [];
        $scope.selectedItems = [];

        $data
            .initService("http://localhost:54273/odata")
            .then(function (odataContext) {

                odataContext
                    .School
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
            .addColumn("Address")

        $scope.options = jayTableOptions;
    }

})();