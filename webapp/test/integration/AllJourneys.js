/* global QUnit*/

sap.ui.define([
	"sap/ui/test/Opa5",
	"demo/FinalProject/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"demo/FinalProject/test/integration/pages/App",
	"demo/FinalProject/test/integration/navigationJourney"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "demo.FinalProject.view.",
		autoWait: true
	});
});