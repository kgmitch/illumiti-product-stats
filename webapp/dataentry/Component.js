sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",
    "com/illumiti/dataentry/service/ServiceManager"
 ], function (UIComponent, JSONModel, ResourceModel, ServiceManager) {
    "use strict";
    return UIComponent.extend("com.illumiti.dataentry.Component", {
          
       metadata : {
             manifest: "json",
 
             //Component Properties:
             properties: {
                   //Single View reference
                   splitAppView: {type: "Object"},
 
                   //Reference to Navigation List
                   navList: {type: "Object"},
 
                   //Grid View reference
                   gridView: {type:"Object"},
 
                   currentBatchIndex: {type: "int"},
 
                   currentViewSet: {type: "string"},
                   regenerateViewSet: {type: "boolean"},
 
                   dynUI: {type: "Object"}
             }
       },
 
       getDisplayMode: function(){
             return this.getModel('app').getProperty('/displayMode');
       },
 
       init : function () {
             
             //set component reference
             jQuery.sap.getObject("com.illumiti", 0);
 
             this.setModel(sap.ui.getCore().getModel('i18n'), 'i18n');
             
             this.setModel(new JSONModel({displayMode:false}), 'app');
             this.setModel(sap.ui.getCore().getMessageManager().getMessageModel(), "message"); 
             this.setModel(sap.ui.getCore().getModel('UserProfile'), 'UserProfile');
 
             // call the init function of the parent
             UIComponent.prototype.init.apply(this, arguments);
 
             // create the views based on the url/hash
 //            this.getRouter().initialize();
  
       },
       onExit: function(){
       }
 
    });
 });