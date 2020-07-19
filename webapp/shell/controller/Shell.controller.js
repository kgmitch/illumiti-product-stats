sap.ui.define([
    "jquery.sap.global",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",
    "com/illumiti/shell/service/ServiceManager",
    "sap/ui/core/routing/History"
], function (jQuery, Controller, JSONModel, ResourceModel, ServiceMgr, History) {
    "use strict";

    return Controller.extend("com.illumiti.shell.controller.Shell", {

        onInit: function (evt) {
            var that = this;

            this.getUserProfile();

            //read user settings to get language
            var up = sap.ui.getCore().getModel('UserProfile');
            var userId = up.getProperty('/id');
            if (userId) {
                if (localStorage) {
                    var us;
                    var settings = localStorage.getItem(userId);
                    if (settings)
                        us = JSON.parse(settings);
                    else {
                        us = {
                            language: 'EN',
                            theme: 'sap_belize_plus'
                        };
                        localStorage.setItem(userId, JSON.stringify(us));
                    }

                    var lang = us.language || 'EN';
                    var theme = us.theme || 'sap_belize_plus';
                    var compactOn = us.compactOn || false;
                }

                up.setProperty('/language', lang);
                up.setProperty('/theme', theme);
                up.setProperty('/compactOn', compactOn);
                this.switchLanguage(lang);
                this.switchTheme(theme);
                this.switchDensity(compactOn);
            }

            var oShell = new sap.ui.unified.Shell('uShell2', {
                icon: "/webapp/shell/logo.png",
                height: "100%",
                headItems: [
                    new sap.ui.unified.ShellHeadItem({
                        tooltip: "Home",
                        icon: "sap-icon://home",
                        visible: "true",
                        press: function () {
                            sap.ui.getCore().byId('Container').setComponent(com.illumiti.launchpad);
                            window.location.hash = "launchpad";
                            com.illumiti.ShellComp.getNavHistory().hash = [];
                            sap.ui.getCore().byId('backButton').setVisible(false);
                        }
                    }),
                    new sap.ui.unified.ShellHeadItem('backButton', {
                        icon: "sap-icon://nav-back",
                        tooltip: "Back",
                        visible: false,
                        press: function () {
                            if(sap.ui.getCore().byId('Container').getComponentInstance().onExit)
                                sap.ui.getCore().byId('Container').getComponentInstance().onExit();
                            var history = com.illumiti.ShellComp.getNavHistory().hash.pop();
                            sap.ui.getCore().byId('Container').setComponent(history.comp);
                            window.location.hash = history.hash;
                            if(com.illumiti.ShellComp.getNavHistory().hash.length)
                                sap.ui.getCore().byId('backButton').setVisible(true);
                            else 
                                sap.ui.getCore().byId('backButton').setVisible(false);    
                        }   
                    })
                ],
                headEndItems: [
                    new sap.ui.unified.ShellHeadItem({
                        tooltip: "Logoff",
                        icon: "sap-icon://log",
                        visible: "true",
                        press: function () {
                            window.location = "logout";
                        }
                    })
                ],
                user: new sap.ui.unified.ShellHeadUserItem({
                    image: "sap-icon://person-placeholder",
                    showPopupIndicator: true,
                    username: "{UserProfile>/name}",
                    press: function (evt) {
                        that.openUserQuickView(evt);
                    }
                }),
                content: [
                    new sap.ui.core.ComponentContainer('Container1', {
                        name: "com.illumiti.launchpad",
                        height: "100%"
                    })
                ]
            });


            var oShell2 = new sap.m.Shell('uShell', {
                logo: "/webapp/shell/logo.png",
                headerRightText: "kmitchell",
                appWidthLimited: false,
                title: "Launchpad",
                showLogout: true,
                logout: function(){alert('logout clicked');},
                app: [
                    new sap.ui.core.ComponentContainer('Container', {
                        name: "com.illumiti.launchpad",
                        height: "100%"
                    })
                ]
            });




            //oShell.addStyleClass("sapUiSizeCompact");

            this.getView().byId("ShellPage").addContent(oShell2);

            //Subscribe to launchpad events
            sap.ui.getCore().getEventBus().subscribe('LAUNCHPAD', 'TILE_CLICK', this.onLaunchpadClick, this);

        },

        onDensitySwitch: function(e){
            var compactOn = e.getSource().getState();   
            this.switchDensity(compactOn);

            if (localStorage) {
                var userId = sap.ui.getCore().getModel('UserProfile').getProperty('/id');
                var settings = localStorage.getItem(userId);
                var us = JSON.parse(settings);
                us.compactOn = compactOn;
                localStorage.setItem(userId, JSON.stringify(us));
            };            

        },

        switchDensity: function(compactOn){
            jQuery(document.body).toggleClass("sapUiSizeCompact", compactOn);
            jQuery(document.body).toggleClass("sapUiSizeCozy", !compactOn);
            sap.ui.getCore().notifyContentDensityChanged();
        },

        preloadUI: function () {
        },

        onLanguageChange: function (e) {
            var lang = e.getSource().getSelectedKey();
            if (!lang)
                return;

            this.switchLanguage(lang);

            if (localStorage) {
                var userId = sap.ui.getCore().getModel('UserProfile').getProperty('/id');
                var settings = localStorage.getItem(userId);
                var us = JSON.parse(settings);
                us.language = lang;
                localStorage.setItem(userId, JSON.stringify(us));
            };
        },

        switchLanguage: function (lang) {
            sap.ui.getCore().getConfiguration().setLanguage(lang);
        },

        onThemeChange: function (e) {
            var theme = e.getSource().getSelectedKey();
            if (!theme)
                return;

            this.switchTheme(theme);

            if (localStorage) {
                var userId = sap.ui.getCore().getModel('UserProfile').getProperty('/id');
                var settings = localStorage.getItem(userId);
                var us = JSON.parse(settings);
                us.theme = theme;
                localStorage.setItem(userId, JSON.stringify(us));
            }
        },

        switchTheme: function (theme) {
            sap.ui.getCore().applyTheme(theme);
        },

        getComponentById: function (sId, sCompName, sTitle) {
            var oComponent = sap.ui.getCore().getComponent(sId);
            if (!oComponent) {
                try {
                    //register module path for the component
                    var path = (window.location.hostname === "localhost") ? "/webapp/" : "/home/webapp/";
                    jQuery.sap.registerModulePath(sCompName, path + sId);

                    //create component
                    oComponent = sap.ui.getCore().createComponent({
                        name: sCompName,
                        id: sId,
                        async: true,
                        componentData: {
                            userProfile: sap.ui.getCore().getModel('UserProfile')
                        },
                        dependencies: {
                            libs: ["sap.m"]
                        },
                        settings: {appTitle: sTitle}
                    });

                } catch (ex) {
                    sap.m.MessageToast.show('This application is not yet connected...');
                }
            }
            jQuery.sap.log.info('Exiting getComponentById', 'Shell', 'FBM');
            return oComponent;
        },

        onLaunchpadClick: function (channel, event, oData) {
            var that = this;
            var mayBeComponent = this.getComponentById(oData.appId, "com.illumiti." + oData.appId, oData.appTitle);

            if (mayBeComponent instanceof Promise) {
                mayBeComponent.then(function (oComponent) {
                    that.continueLaunchpadClick(oComponent, oData);
                });
            }
            else {
                that.continueLaunchpadClick(mayBeComponent, oData);
            }
        },

        continueLaunchpadClick: function (oComponent, oData) {
            var oContainer = sap.ui.getCore().byId('Container');

            if (!oComponent) {
                return;
            }

                com.illumiti.ShellComp.getNavHistory().hash.push({comp:oContainer.getComponent(), hash:window.location.hash.substring(1)});
                oContainer.setComponent(oComponent);

                //If tile has a route - use it, otherwise just set component name as hash
                if (oData.appRoute) {
                    oComponent.getRouter().oHashChanger.setHash(oData.appRoute);
                } else {
                    window.location.hash = oData.appId;
                }
        },
        getUserProfile: function () {
            var userProfile = new JSONModel({
                  "sub": "role1",
                  "name": "Keith Mitchell",
                  "groups": ["group1"],
                  "given_name": "Keith",
                  "family_name": "User",
                  "email": "kmitchell@illumiti.com",
                  "roles": ["role1"],
                  "id": "kmitchell"
                 });
             
             sap.ui.getCore().setModel(userProfile, 'UserProfile');
             this.getView().setModel(userProfile, 'UserProfile')
             return;

            var that = this;
            let url = BNX.RTL.URL_BPSERVICE + "getUserProfile";
            $.ajax({
                type: "GET",
                // url: "/auth/api/Roles/getUserProfile",
                url: url,
                contentType: 'application/JSON',
                data: null,
                async: false,
                xhrFields: {
                    withCredentials: true
                },
                success: function (data, textStatus, xhr) {
                    var userProfile = new JSONModel(data.userProfile);
                    sap.ui.getCore().setModel(userProfile, 'UserProfile');
                    that.getView().setModel(userProfile, 'UserProfile')
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log("Error getting user profile");
                    // // Use temporary user profile for test purposes only - Peter 2017-07-28
                    // if (location.hostname === "localhost") {
                    //     var userProfile = new JSONModel({
                    //         "sub": "category1",
                    //         "name": "Category User",
                    //         "groups": ["category_group"],
                    //         "given_name": "Category",
                    //         "family_name": "User",
                    //         "email": "category@email.com",
                    //         "roles": ["category"],
                    //         "id": "category1"
                    //     });
                    // }
                    // sap.ui.getCore().setModel(userProfile, 'UserProfile');
                    // that.getView().setModel(userProfile, 'UserProfile')
                }
            });
        },

        openUserQuickView2: function (oEvent) {
            if (!this._oPref) {
                this._oPref = sap.ui.xmlfragment("com.illumiti.shell.fragment.UserView", this);
            }
            this._oPref.open(); //.addStyleClass("sapUiSizeCompact");
        },

        openUserQuickView: function (oEvent) {
            this.createPopover();

            this._oUserView.setModel(this.getView().getModel('UserProfile'));

            // delay because addDependent will do a async rerendering and the actionSheet will immediately close without it.
            var oButton = oEvent.getSource();
            jQuery.sap.delayedCall(0, this, function () {
                this._oUserView.openBy(oButton);
            });
        },

        createPopover: function () {
            if (!this._oUserView) {
                this._oUserView = sap.ui.xmlfragment("com.illumiti.shell.fragment.UserSettings", this);
                this.getView().addDependent(this._oUserView);
            }
        },

        onDelegatesClick: function (oEvt) {
            var that = this;
            //Show variant dialog
            if (! this._oDialog) {
                this._oDialog = new sap.m.Dialog({
                    title: 'Add Delegates',
                    contentWidth: "800px",
                    contentHeight: "500px",
                    resizable: true,
                    content: sap.ui.xmlfragment("com.illumiti.shell.fragment.Delegates", this),
                    beginButton: new sap.m.Button({
                        text: 'Done',
                        press: function () {
                            that._oDialog.close();
                        }
                    }),
                    endButton: new sap.m.Button({
                        text: 'Cancel',
                        press: function () {
                            that._oDialog.close();
                        }
                    })
                });
            };
            that.setDelegateModel();
            that._oDialog.addStyleClass('sapUiSizeCompact');
            that._oDialog.getContent()[0].setModel(this.getView().getModel('UserProfile'));
            that._oDialog.open();

        },

        setDelegateModel: function () {

            var del = JSON.parse('{"processes":[{"name":"Vendor initiated process","users":["category2"],"tasks":[{"id":"Request Enrichment"}]},{"name":"Internally initiated process","users":["category2"],"tasks":[{"id":"Request Initiator"}]}],"delegations":[{"task":"enrich","delegate":"category2","from":"2017-11-01","to":"2017-11-30"},{"task":"enrich","delegate":"category2","from":"2017-09-01","to":"2017-09-15"}]}')
            var usr = this.getView().getModel('UserProfile');
            usr.oData.userProcessInfo = del;
        },

        onDelete: function (evt) {
            var ctx = evt.getSource().getBindingContext().sPath;
            var idx =  ctx.substr(ctx.lastIndexOf("/")+1);
            var mdl = this.getView().getModel('UserProfile');
            mdl.oData.userProcessInfo.delegations.splice(idx,1);
            mdl.refresh();
            this._oDialog.getContent()[0].setModel(mdl);

        },
        onAddDelegate: function (evt) {
            var mdl = this.getView().getModel('UserProfile');
            mdl.oData.userProcessInfo.delegations.push({
                "task": "",
                "delegate": "",
                "from": "2017-11-01",
                "to": "2017-11-30"
            });
            mdl.refresh();
            this._oDialog.getContent()[0].setModel(mdl);

        }

    });

});
