(function() {
    'use strict';
        
    var app = angular.module("angular-jaydata-table");
    
    app.directive("jayTableBody", jayTableBodyDirective);

    function jayTableBodyDirective($compile, $parse) {

        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            require: '^jayTable',
            template: '<tbody>' +
                        '<tr ng-if="items.length == 0">' +
                            '<td colspan="{{ default ? tableOptions.length + 1 : noContentColspan + 1 }}" style="text-align: center"><i>Empty table</i></td>' +
                        '</tr>' +
                        '<tr ng-if="default" ng-repeat="item in items" ng-click="toggleSelected(item, $event, noCheckBox)" style="cursor: pointer" ng-style="{ \'background-color\': (!noCheckBox ? (item.IsSelected ? \'#fbebbc\': \'\') : \'\') }">' +
                            '<td ng-if="!noCheckBox">' +
                                '<input type="checkbox" ng-checked="item.IsSelected" ng-click="toggleSelected(item, $event, noCheckBox)" style="cursor: pointer"/>' +
                            '</td>' +
                            '<td ng-repeat="option in tableOptions">' +
                                '{{ processColumn(item, option) }}' +
                            '</td>' +
                        '</tr>' +
                        '<tr ng-if="!default" ng-repeat="item in items" ng-click="toggleSelected(item, $event, withoutCheckboxes)" style="cursor: pointer" ng-style="{ \'background-color\': (!noCheckBox ? (item.IsSelected ? \'#fbebbc\': \'\') : \'\') }" script-transclude></tr>' +
                    '</tbody>',
            link: function ($scope, $element, $attrs) {
                $scope.noCheckBox = $scope.withoutCheckboxes;
            }
        }
    };
    
})();