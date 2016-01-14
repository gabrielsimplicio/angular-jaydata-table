(function() {
    'use strict';
        
    var app = angular.module("angular-jaydata-table");
    
    app.directive("jayTablePagination", jayTablePaginationDirective);

    function jayTablePaginationDirective($rootScope) {

        return {
            restrict: 'E',
            template: '<div class="btn-group">' +
                            '<span style="float:left; margin: 15px 8px 0 0">{{ currentPage }}/{{ numberOfPages }}</span>' +
                            '<button class="btn btn-default navbar-btn" ng-click="backToPreviousPage()" ng-disabled="currentPage == 1"><span class="glyphicon glyphicon-menu-left" aria-hidden="true"></span></button>' +
                            '<button class="btn btn-default navbar-btn" ng-click="goToNextPage()" ng-disabled="currentPage == numberOfPages"><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button>' +
                        '</div>',
            scope: {
                list: "=",
                render: "="
            },
            controller: function ($scope, $element, $attrs) {
                if (!angular.isDefined($scope.list)) {
                    console.error("Error at 'jayTablePagination' directive. You must provide an attribute called 'list'.");
                    return;
                }

                $scope.count = 0;
                $scope.total = 0;

                $scope.numberOfPages = 1;
                $scope.currentPage = 1;

                $scope.nextFn = null;
                $scope.goToNextPage = function () {
                    $scope.currentPage++;
                    $scope.nextFn().then(emitScopeChanges);
                };

                $scope.prevFn = null;
                $scope.backToPreviousPage = function () {
                    $scope.currentPage--;
                    $scope.prevFn().then(emitScopeChanges);
                }

                $scope.$watch("list", getItems);

                function getItems(data) {
                    $scope.list = data;

                    $scope.count = data.length;
                    $scope.total = data.totalCount;

                    if ($scope.currentPage == 1 && ($scope.count > 0 && $scope.total > 0)) {
                        $scope.numberOfPages = Math.ceil($scope.total / $scope.count);
                    }

                    $scope.nextFn = data.next;
                    $scope.prevFn = data.prev;

                    $rootScope.$broadcast("paginationClicked", $scope.list);
                }

                function emitScopeChanges(data) {
                    $scope.$apply(function () {
                        getItems(data);
                        if (angular.isDefined($scope.render)) {
                            $scope.render(data);
                        }
                    });
                }
            }
        }
    }
    
})();