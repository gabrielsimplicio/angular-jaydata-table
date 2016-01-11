angular.module("demoApp", [
    "jaydata",
    "jaydata-table"
])

.controller("jayTableSample", function ($scope, $data, jayTableOptions) {
    
    $scope.list = [];
    $scope.selectedItems = [];

    $data
        .initService("http://localhost:54273/odata")
        .then(function (odataContext) {

            odataContext
                .Person
                .toArray(function (people) {
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
        .addColumn("Name").withTitle("Name")
        .addColumn("DateOfBirth").withTitle("Date Of Birth")
        .addColumn("Phone").withTitle("Phone");
    
    $scope.options = jayTableOptions;

})