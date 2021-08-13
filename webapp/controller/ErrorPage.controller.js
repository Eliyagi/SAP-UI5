sap.ui.define(["./BaseController"], function (Controller) {
	"use strict";
	return Controller.extend("demo.FinalProject.controller.ErrorPage", {
		onInit: function () {

		},
		
		onNavButtonPress: function () {
			this.getRouter().navTo("Main");
		}
	});
});