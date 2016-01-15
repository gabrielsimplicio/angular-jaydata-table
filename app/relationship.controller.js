﻿(function () {
    'use strict';

    var JayDataDemoApp = angular.module("jayDataDemoApp");

    JayDataDemoApp.controller("RelationshipController", relationshipController);

    function relationshipController($scope, $data, jayTableOptions) {

        $scope.list = [];
        $scope.selectedItems = [];

        $data
            .initService("http://angular-jaydata-table.azurewebsites.net/odata")
            .then(function (odataContext) {

                odataContext
                    .Person
                    .include("School")
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
            .addColumn("School.Name").withTitle("School")

        $scope.options = jayTableOptions;
    }

})();