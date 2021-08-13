sap.ui.define([
	"./BaseController",
	"sap/m/MessageBox"
], function (Controller, MessageBox) {
	"use strict";
	return Controller.extend("demo.FinalProject.controller.Main", {
		onInit: function () {
			this.getView().setBusy(true);
			this.getOwnerComponent().getModel("System").setData(this.oSystedData);
			this._loadEmployee();
			this._setSumOfCards();
		},
		
		
		// model functions -->
		_setSumOfCards: function (oEvent) {
			var oController = this;
			var oModel = oController.getOwnerComponent().getModel();
			
			var systemModel = oController.getOwnerComponent().getModel("System");
			var systemModelData = systemModel.getData();
			var allCards = 0;

			oModel.read("/Payments", {
				success: function (oData) {
					for (var result in oData.results) {
						if (oData.results[result].Status === 2) { //  2!!
							allCards += 1;
						}
					}
					if (allCards > 0) {
						oController.getView().setBusy(false);
						systemModelData.allCards = allCards;
						systemModel.setData(systemModelData);
					} else {
						oController.getRouter().navTo("NoPayments");
					}
				},
				error: function (oError) {
					oController.getRouter().navTo("ErrorPage"); 
				}
			});

		},


		// backEnd functions-->
		onSendReject: function (oEvent) {
			var oController = this;
			oController.getView().byId("cards").setBusy(true);
			var oModel = this.getOwnerComponent().getModel();
			var sPath = "/Payments(" + oEvent.getSource().data().id + ")";

			oModel.update(sPath, {
				"ApproveMessage": oEvent.getSource().data().ApproveMessage,
				"ApproveType": 2,	 // 2 !!
				"Status": 3 	// 3 !!
			}, {
				success: function (oData) {
					sap.m.MessageToast.show("תשלום נדחה", {
						at: sap.ui.core.Popup.Dock.CenterCenter
					});
				},
				error: function (oError) {
					oController.getRouter().navTo("ErrorPage");
				},
				refreshAfterChange: true
			});
			this._closePopup("SubmitReject");

			this._setSumOfCards();
			this._handlePickedCards(false);
			
			oController.getView().byId("cards").setBusy(false);
		},
		onSendPayments: function (oEvent) {
			var oController = this;
			var oModel = this.getOwnerComponent().getModel();
			var idArray = this.pickedCardIds;
			if (this.pickedCardIds.length > 0) {

				oController.getView().setBusy(true);
				for (var oId in idArray) {
					var sPath = "/Payments(" + idArray[oId].id + ")";
					idArray[oId].boxId.getAggregation("items")[0].addStyleClass("paymentHeaderSent");
					idArray[oId].boxId.getAggregation("items")[1].addStyleClass("paymentBoxPickedSent");
					oModel.update(sPath, {
						"ApproveType": 1, //  1!!
						"Status": 3 //  3!!
					}, {
						success: function () {
							// this.pickedCardIds[oId].boxId.getAggregation("items")[0].addStyleClass("paymentHeaderSent");
							// this.pickedCardIds[oId].boxId.getAggregation("items")[1].addStyleClass("paymentBoxPickedSent");
							oController.getView().setBusy(false);
							sap.m.MessageToast.show("ריצות תשלום אושרו", {
								at: sap.ui.core.Popup.Dock.CenterCenter
							});
						},
						error: function (oError) {
							//error
							oController.getView().setBusy(false);
							oController.getRouter().navTo("ErrorPage");
						},
						refreshAfterChange: true
					});
				}
				this._setSumOfCards();
				this._handlePickedCards(false);

			} else {
				sap.m.MessageBox.error("נא לבחור ריצת תשלום", {
					title: ""
				});
			}
		},


		// payment cards functions -->
		onpickAllCards: function (oEvent) {
			var selectedValue = oEvent.getSource().getProperty("selected");
			this._handlePickedCards(selectedValue);
		},
		onSelectCard: function (oEvent) {
			var OAmount = parseFloat(oEvent.getSource().data().amount, 0);
			var cardId = oEvent.getSource().data().id;
			var cardBoxId = oEvent.getSource().getParent().getParent().getParent();
			var selectedValue = oEvent.getSource().getProperty("selected");
			this._changeViewCards(selectedValue, OAmount, cardId, cardBoxId);
			this._setPickAllSelectedValue();
		},
		_handlePickedCards: function (oValue) {
			var cards = this.getView().byId("cards").getAggregation("items");
			for (var card in cards) {
				if (cards[card].data().Status === 2) { // 2!!
					var cardCheckBox = cards[card].getAggregation("items")[0]
						.getAggregation("items")[0].getAggregation("items")[0];
					var cardBoxId = cards[card];
					var amountCard = parseFloat(cardCheckBox.data().amount, 0);
					var cardId = cards[card].data().id;
					if (oValue) {
						if (!cardCheckBox.getSelected()) {
							cardCheckBox.setSelected(true);
							this._changeViewCards(true, amountCard, cardId, cardBoxId);
						}
					} else {
						if (cardCheckBox.getSelected()) {
							cardCheckBox.setSelected(false);
							this._changeViewCards(false, amountCard, cardId, cardBoxId);
						}
					}
				}
			}
			this._setPickAllSelectedValue();
		},
		_changeViewCards: function (oValue, OAmount, oId, cardBoxId) {
			var systemModel = this.getOwnerComponent().getModel("System");
			var systemModelData = systemModel.getData();
			var sumValue = parseFloat(systemModelData.sumAmount);
			var chosen = systemModelData.chosen;

			if (oValue) {
				cardBoxId.getAggregation("items")[1].addStyleClass("paymentBoxPicked");
				sumValue += OAmount;
				chosen += 1;
			} else {
				sumValue -= OAmount;
				chosen -= 1;
				cardBoxId.getAggregation("items")[1].removeStyleClass("paymentBoxPicked");
			}
			this._changeListCardsId(oValue, oId, cardBoxId);

			systemModelData.sumAmount = sumValue.toString();
			systemModelData.chosen = chosen;
			systemModel.setData(systemModelData);
		},
		_changeListCardsId: function (oValue, oId, oBoxId) {
			var idArray = this.pickedCardIds;
			if (oValue) {
				idArray.push({
					id: oId,
					boxId: oBoxId
				});
			} else {
				for (var cardId in idArray) {
					if (idArray[cardId].id === oId) {
						idArray.splice(cardId, 1);
					}
				}
			}
		},
		_setPickAllSelectedValue: function () {
			var oController = this;
			var systemModel = oController.getOwnerComponent().getModel("System");
			var systemModelData = systemModel.getData();

			var chosen = systemModelData.chosen;
			var allCards = systemModelData.allCards;

			if (chosen < allCards) {
				oController.byId("pickAll").setSelected(false);
			} else {
				oController.byId("pickAll").setSelected(true);
			}
		},


		// dialog functions -->
		onOpenSubmitDialog: function (oEvent) {
			var oData = {
				id: oEvent.getSource().data().id,
				Amount: oEvent.getSource().data().amount,
				Currency: oEvent.getSource().data().Currency,
				PaymentDate: oEvent.getSource().data().PaymentDate,
				ApproveMessage: ""
			};
			this.getOwnerComponent().getModel("rejectBoxModel").setData(oData);
			this._openPopup("SubmitReject");

		},
		onCloseSubmit: function () {
			this.getOwnerComponent().getModel("rejectBoxModel").setData({});
			this._closePopup("SubmitReject");
		}
	});
});