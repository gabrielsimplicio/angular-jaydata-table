(function () {
    'use strict';

    var JayDataDemoApp = angular.module("jayDataDemoApp");

    JayDataDemoApp.controller("CustomHeaderBodyController", customHeaderBodyController);

    function customHeaderBodyController($scope, $data) {
        $scope.list = [];
        $scope.selectedItems = [];

        $data
            .initService("http://localhost:54273/odata")
            .then(function (odataContext) {

                odataContext
                    .Person
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
    }

})();