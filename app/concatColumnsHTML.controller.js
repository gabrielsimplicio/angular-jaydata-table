(function () {
    'use strict';

    var JayDataDemoApp = angular.module("jayDataDemoApp");

    JayDataDemoApp.controller("ConcatColumnsHTMLController", concatColumnsHTMLController);
    
    function concatColumnsHTMLController($scope, $data) {
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
    }

})();