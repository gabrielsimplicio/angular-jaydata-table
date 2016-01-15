(function(){
    'use strict';
    
    var app = angular.module("angular-jaydata-table");
    
    app.provider("jayTableConfig", function(){
        
        this.setEmptyText = function (text) {
            this.emptyText = text;
        };

        this.$get = function () {
            return this;
        };
        
    });
    
})();