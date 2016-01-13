(function () {
    'use strict';

    JayDataDemoApp.controller("FormatController", function ($scope, $data, jayTableOptions) {

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
        
        var dateFormat = {
            date: "dd/MM/yyyy"
        }

        jayTableOptions
            .initializeHeader()
            .addColumn("Name").format("uppercase")
            .addColumn("DateOfBirth").withTitle("Date Of Birth").format(dateFormat)

        $scope.options = jayTableOptions;
    });
})();