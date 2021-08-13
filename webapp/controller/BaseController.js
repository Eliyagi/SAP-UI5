/*global history */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageBox"
], function (Controller, History, MessageBox) {
	"use strict";

	return Controller.extend("demo.FinalProject.controller.BaseController", {
		oSystedData: {
			sumAmount: "0",
			chosen: 0,
			allCards: 0
		},
		pickedCardIds: [],
		
		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},

		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		onNavBack: function () {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("master", {}, true);
			}
		},
		_openPopup: function (vPopupName) {
			var oView = this.getView();
			this[vPopupName] = oView.byId(vPopupName);
			// this[vPopupName].bindElement();

			// create dialog lazily
			if (!this[vPopupName]) {
				// create dialog via fragment factory
				this[vPopupName] = sap.ui.xmlfragment(oView.getId(), "demo.FinalProject.view.fragments." + vPopupName, this);
				// connect dialog to view (models, lifecycle)
				oView.addDependent(this[vPopupName]);
			}

			try {
				this[vPopupName].open();
			} catch (e) {
				jQuery.sap.log.error(e);
			}
		},

		_closePopup: function (vPopupName) {
			// var oView = this.getView();
			try {
				this[vPopupName].close();
			} catch (e) {
				jQuery.sap.log.error(e);
			}
		},
		_loadEmployee: function () {
			this.byId("employeeBox").bindElement("/Employee(1)");
		}

	});

});