angular.module("demoApp", [
    "jaydata",
    "jaydata-table"
])

.controller("jayTableSample", function ($scope, $data, jayTableOptions) {
    
    $scope.list = [];
    $scope.list2 = [];
    $scope.selectedItems = [];
    $scope.selectedItems2 = [];

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

            odataContext
                .Person
                .withCount()
                .take(10)
                .toArray()
                .then(function (people) {
                    $scope.$apply(function () {
                        $scope.list2 = people;
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

})