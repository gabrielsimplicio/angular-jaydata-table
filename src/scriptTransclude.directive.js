(function() {
    'use strict';
        
    var app = angular.module("angular-jaydata-table");
    
    app.directive("scriptTransclude", scriptTranscludeDirective);

    function scriptTranscludeDirective() {
        return {
            controller: function ($scope, $element, $attrs) {
                $scope.$watch(function () {
                    return $element;
                }, function (row) {
                    $scope.noContentColspan = row.children().length == 0 ? 1 : row.children().length;
                });
            },
            compile: function (el, attrs, transcludeFn) {
                if (angular.isFunction(transcludeFn)) {
                    transcludeFn(el, function (cl) {
                        var clone = $(cl);
                        var elem = $(el);
                        var isHeader = elem.parent().is("thead");

                        var $content = clone.filter('script').text();

                        if ($content.length > 0) {

                            if (!isHeader) {
                                elem.append('<td><input type="checkbox" ng-checked="item.IsSelected" ng-click="toggleSelected(item, $event)" style="cursor: pointer"/></td>');

                                if ($content.indexOf("<td>") > -1) {
                                    elem.append($content.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>'));
                                } else {
                                    elem.append('<td>' + $content + '</td>');
                                }
                            } else {
                                elem.append($content.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>'));
                            }
                        } else {
                            if (isHeader) {
                                elem.append('<th class="is-not-checkbox" ng-if="!default" colspan="{{colspan}}"></th>');

                                if (clone) {
                                    var th = elem.find("th.is-not-checkbox");
                                    th.append(clone);
                                }
                            }
                        }
                    });
                }
            }
        }
    }
    
})();