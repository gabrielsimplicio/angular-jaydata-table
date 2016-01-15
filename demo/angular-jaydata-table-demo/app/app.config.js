(function () {
  'use strict';
  
    var JayDataDemoApp = angular.module("jayDataDemoApp");

    JayDataDemoApp.config(function (jayTableConfigProvider) {
        jayTableConfigProvider.setEmptyText('Não há conteúdo para ser exibido');
    });

})();