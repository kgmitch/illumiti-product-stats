sap.ui.define([
    "jquery.sap.global",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    'sap/m/MessageToast',
    "com/illumiti/dataentry/service/ServiceManager"
], function (jQuery, Controller, JSONModel, Toast,ServiceManager) {
    "use strict";

    return Controller.extend("com.illumiti.dataentry.controller.App", {
 
        onInit: function (evt) {
        },
        onAfterRendering: function(){
  
        },

        onPressBack: function (evt) {
          if(sap.ui.getCore().byId('Container').getComponentInstance().onExit)
          sap.ui.getCore().byId('Container').getComponentInstance().onExit();
          var history = com.illumiti.ShellComp.getNavHistory().hash.pop();
          sap.ui.getCore().byId('Container').setComponent(history.comp);
          window.location.hash = history.hash;
//          if(com.bianix.ShellComp.getNavHistory().hash.length)
//            sap.ui.getCore().byId('backButton').setVisible(true);
//          else 
 //           sap.ui.getCore().byId('backButton').setVisible(false);    
          }
    });

});

