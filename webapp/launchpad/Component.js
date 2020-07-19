sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/resource/ResourceModel"
], function (UIComponent, JSONModel, ResourceModel) {
	"use strict";

	return UIComponent.extend("com.illumiti.launchpad.Component", {

		metadata : {
			rootView: "com.illumiti.launchpad.view.App",
			includes: ["css/style.css"]
		},

		init : function () {
			com.illumiti.launchpad = this;
			UIComponent.prototype.init.apply(this, arguments);
                  this.setModel(sap.ui.getCore().getModel('i18n'), 'i18n');			
                  var oModel = new JSONModel();
                  this.setModel(oModel, 'launchpad');			
                      
		}
	});

});
