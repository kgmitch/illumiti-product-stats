sap.ui.define([
    "jquery.sap.global",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    'sap/m/MessageToast',
    "com/illumiti/launchpad/service/ServiceManager"
], function (jQuery, Controller, JSONModel, Toast,ServiceManager) {
    "use strict";

    return Controller.extend("com.illumiti.launchpad.controller.App", {
 
        onInit: function (evt) {
        },
        onAfterRendering: function(){
            if(!(this.loaded)){
              var tiles = ServiceManager.loadTiles();
              this.getOwnerComponent().getModel("launchpad").setProperty("/tiles",tiles); 
              this.getView().setModel(this.getOwnerComponent().getModel("launchpad"));
              this.loaded = true;
            }
        },

        onTileClick: function (evt) {
            var obj = evt.getSource().getBindingContext().getObject();

            // Handle direct URL's that need to run in a separate window
            var url = obj.url;
            if (url && url.substr(0,1) === ">"){
                url = url.substr(1);
                window.open(url);
            }else {
                sap.ui.getCore().getEventBus().publish('LAUNCHPAD', 'TILE_CLICK', obj);
            }

        }
    });

});

