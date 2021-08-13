sap.ui.define([
	"./BaseController"
], function (Controller) {
	"use strict";

	return Controller.extend("demo.FinalProject.controller.NoPayments", {

		onInit: function () {
			this._loadEmployee();
			this._checkIfGoMain();
		},
		_checkIfGoMain: function(){   //AFTER PAGE REFRESH 
			var oController = this;
			var oModel = oController.getOwnerComponent().getModel();
			oModel.read("/Payments", {
				success: function (oData) {
					for (var result in oData.results) {
						if (oData.results[result].Status === 2) {      //  2!!
							oController.getRouter().navTo("Main");
						}
					}
				}
			});
		}

	});

});