sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/resource/ResourceModel"
], function (UIComponent, JSONModel, ResourceModel) {
	"use strict";

	return UIComponent.extend("com.illumiti.shell.Component", {

		metadata : {
			rootView: "com.illumiti.shell.view.Shell",
           //Component Properties:
            properties: {
                  //back button ref
                  backButton: {type: "Object"},

				  //previously set component, for going back
				  prevComp: {type: "string"},
				  navHistory: {type:"object"}
			},
		},
		init : function () {
			
			com.illumiti.ShellComp = this;

			this.setNavHistory({hash:[]});

			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);
			
//			var i18nModel = new ResourceModel({
//				bundleUrl: BNX.RTL.URL_I18N,
//				locale: sap.ui.getCore().getConfiguration().getLanguage() || "en"
//			});  // Added configured URL - Peter 2017-07-28

//			sap.ui.getCore().setModel(i18nModel, 'i18n');
//			this.setModel(i18nModel, "i18n");
			
			// var i18nModel = new ResourceModel({bundleUrl : BNX.RTL.URL_I18N});  // Added configured URL - Peter 2017-07-28
			// sap.ui.getCore().setModel(i18nModel, 'i18n');
            // this.setModel(i18nModel, "i18n");
			window.location.hash = "launchpad";
		},

	});

});
