
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "clientcinema/formatter/Formatter",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
], (Controller, Formatter, MessageToast, MessageBox, Filter, FilterOperator, Sorter) => {
    "use strict";

    return Controller.extend("clientcinema.controller.Showtime", {
        formatter: Formatter,

        onInit: function () {

            this.gShowTimeId = null;
            this.gFullPrice = 0;
            this.gOnePrice = 0;
            this.gBookedSeatIds = [];

            this.getOwnerComponent().getRouter().getRoute("Showtime").attachPatternMatched(this._onObjectMatchedActors, this);
            this.getView().getModel("MOVIE_ACTORSModel");

            this.getOwnerComponent().getRouter().getRoute("Showtime").attachPatternMatched(this._onObjectMatchedDirectors, this);
            this.getView().getModel("MOVIE_DIRECTORSModel");

            this.getOwnerComponent().getRouter().getRoute("Showtime").attachPatternMatched(this._onObjectMatchedCategory, this);
            this.getView().getModel("MOVIE_CATEGORYSModel");

            this.getOwnerComponent().getRouter().getRoute("Showtime").attachPatternMatched(this._onObjectMatchedShowtime, this);
            this.getView().getModel("ShowtimeModel");

        },


        _onObjectMatchedActors: function (oEvent) {

            sap.ui.core.BusyIndicator.show(0);
            //read the url parameters
            var sMovieID = oEvent.getParameter("arguments").MovieID;

            var oMOVIE_ACTORSJSONModel = new sap.ui.model.json.JSONModel();
            var that = this;
            //read the data from Back End (READ_GET_ENTITY)
            var oDataModel = this.getOwnerComponent().getModel();
            var sPath = "/MOVIES(MovieID=guid'" + sMovieID + "',IsActiveEntity=true)";

            console.log(oDataModel.sServiceUrl + sPath + "?$expand=to_actors");

            oDataModel.read(sPath, {
                urlParameters: {
                    "$expand": "to_actors"
                },

                success: function (oresponse) {
                    // console.log(oresponse);
                    //attach the data to the model
                    oMOVIE_ACTORSJSONModel.setData(oresponse);
                    //attach the Model to the View
                    that.getView().setModel(oMOVIE_ACTORSJSONModel, "MOVIE_ACTORSModel");
                    // console.log(that.getView().getModel("MOVIE_ACTORSModel"));
                },
                error: function (oerror) { },
            });
        },

        _onObjectMatchedDirectors: function (oEvent) {
            //read the url parameters
            var sMovieID = oEvent.getParameter("arguments").MovieID;

            var oMOVIE_DIRECTORSJSONModel = new sap.ui.model.json.JSONModel();
            var that = this;
            //read the data from Back End (READ_GET_ENTITY)
            var oDataModel = this.getOwnerComponent().getModel();
            var sPath = "/MOVIES(MovieID=guid'" + sMovieID + "',IsActiveEntity=true)";

            console.log(oDataModel.sServiceUrl + sPath + "?$expand=to_directors");

            oDataModel.read(sPath, {
                urlParameters: {
                    "$expand": "to_directors"
                },

                success: function (oresponse) {
                    // console.log(oresponse);
                    //attach the data to the model
                    oMOVIE_DIRECTORSJSONModel.setData(oresponse);
                    //attach the Model to the View
                    that.getView().setModel(oMOVIE_DIRECTORSJSONModel, "MOVIE_DIRECTORSModel");
                    // console.log(that.getView().getModel("MOVIE_DIRECTORSModel"));
                },
                error: function (oerror) { },
            });
        },

        _onObjectMatchedCategory: function (oEvent) {
            //read the url parameters
            var sMovieID = oEvent.getParameter("arguments").MovieID;

            var oMOVIE_CATEGORYJSONModel = new sap.ui.model.json.JSONModel();
            var that = this;
            //read the data from Back End (READ_GET_ENTITY)
            var oDataModel = this.getOwnerComponent().getModel();
            var sPath = "/MOVIES(MovieID=guid'" + sMovieID + "',IsActiveEntity=true)";

            console.log(oDataModel.sServiceUrl + sPath + "?$expand=to_category");

            oDataModel.read(sPath, {
                urlParameters: {
                    "$expand": "to_category"
                },

                success: function (oresponse) {
                    // console.log(oresponse);
                    //attach the data to the model
                    oMOVIE_CATEGORYJSONModel.setData(oresponse);
                    //attach the Model to the View
                    that.getView().setModel(oMOVIE_CATEGORYJSONModel, "MOVIE_CATEGORYModel");
                    // console.log(that.getView().getModel("MOVIE_CATEGORYModel"));
                },
                error: function (oerror) { },
            });
        },

        _onObjectMatchedShowtime: function (oEvent) {
            //read the url parameters
            var sMovieID = oEvent.getParameter("arguments").MovieID;

            var oShowtimeJSONModel = new sap.ui.model.json.JSONModel();
            var that = this;
            //read the data from Back End (READ_GET_ENTITY)
            var oDataModel = this.getOwnerComponent().getModel();
            var sPath = "/MOVIES_SHOWTIME(MovieID=guid'" + sMovieID + "',IsActiveEntity=true)";

            oDataModel.read(sPath, {
                urlParameters: {
                    "$expand": "to_SHOWTIMES"
                },

                success: function (oresponse) {
                    // console.log(oresponse);
                    //attach the data to the model
                    oShowtimeJSONModel.setData(oresponse);
                    //attach the Model to the View
                    that.getView().setModel(oShowtimeJSONModel, "ShowtimeModel");
                    // console.log(that.getView().getModel("ShowtimeModel"));

                    sap.ui.core.BusyIndicator.hide();
                },
                error: function (oerror) { },
            });
        },

        openTrailer: function (oEvent) {
            // Get the model from the view
            var oModel = this.getView().getModel("ShowtimeModel");

            // Get the TrailerUrl from the model
            var sUrl = oModel.getProperty("/TrailerUrl");

            // Check if URL exists
            if (sUrl) {
                window.open(sUrl, "_blank");
            } else {
                sap.m.MessageToast.show("Trailer URL not available");
            }

        },

        _onGetSeatsOfHall: function (sHallIDValue) {
            var that = this;

            return new Promise(function (resolve, reject) {
                var oSeatsJSONModel = new sap.ui.model.json.JSONModel();
                var oDataModel = that.getOwnerComponent().getModel();
                var sPath = "/VH_HALLS(HallID=guid'" + sHallIDValue + "',IsActiveEntity=true)";

                oDataModel.read(sPath, {
                    urlParameters: { "$expand": "to_Seats" },
                    success: function (oresponse) {
                        oSeatsJSONModel.setData(oresponse);
                        that.getView().setModel(oSeatsJSONModel, "SeatsModel");
                        resolve(oresponse);
                    },
                    error: function (oerror) {
                        reject(oerror);
                    }
                });
            });
        },

        _onGetBookedSeat: function (sShowtimeidValue) {
            var oDataModel = this.getOwnerComponent().getModel();

            return new Promise(function (resolve, reject) {
                var sPath = "/MY_TICKETS";
                var oParams = {
                    "$filter": "Showtimeid eq guid'" + sShowtimeidValue + "'",
                    "$select": "SeatID"
                };

                oDataModel.read(sPath, {
                    urlParameters: oParams,
                    success: function (oResponse) {
                        // Extract the SeatID array
                        var aBookedSeatIds = oResponse.results.map(function (item) {
                            return item.SeatID;
                        });
                        resolve(aBookedSeatIds);
                    },
                    error: function (err) {
                        reject(err);
                    }
                });
            });
        },


        //***************************************************
        //********************Open Tickets Dialog*************
        //************************************************** */
        onOpenTicketDialog: async function (oEvent) {

            sap.ui.core.BusyIndicator.show(0);

            this.gFullPrice = 0;

            this.gShowTimeId = oEvent.getSource().getBindingContext("ShowtimeModel").getObject().Showtimeid;

            this.gBookedSeatIds = await this._onGetBookedSeat(this.gShowTimeId);

            var sHallIDValue = oEvent.getSource().getBindingContext("ShowtimeModel").getObject().HallId;


            this._onGetSeatsOfHall(sHallIDValue).then(function () {

                var oSeatsModel = this.getView().getModel("SeatsModel");

                var oSeatsModel = this.getView().getModel("SeatsModel");
                var nCapacity = oSeatsModel.getProperty("/Capacity");
                var nRowSeats = oSeatsModel.getProperty("/RowSeats");
                var aAllSeats = oSeatsModel.getProperty("/to_Seats/results");

                var aSeats = [];
                for (var i = 0; i < nCapacity; i++) {
                    var iSeatNumber = aAllSeats[i].ChairNumber;
                    var sSeatId = aAllSeats[i].SeatId;

                    // Check if you have corresponding seat data from SeatsModel
                    var oSeatData = aAllSeats && aAllSeats[i] ? aAllSeats[i] : null;

                    aSeats.push({
                        seatId: sSeatId,
                        seatNumber: iSeatNumber,
                        selected: false,
                        isBooked: this.gBookedSeatIds.includes(sSeatId),
                        // isBooked: aBookedSeatNumbers.includes(iSeatNumber),
                        // Add additional data from SeatsModel if available
                        originalSeatId: oSeatData ? oSeatData.SeatId : null,
                        hallId: oSeatData ? oSeatData.HallId : null,
                        // Add any other properties you might need
                        seatType: oSeatData ? oSeatData.SeatType || "Regular" : "Regular",
                        rowNumber: oSeatData ? oSeatData.RowNumber || Math.ceil(iSeatNumber / nRowSeats) : Math.ceil(iSeatNumber / nRowSeats)
                    });
                }

                var oSeatModel = new sap.ui.model.json.JSONModel({
                    seats: aSeats,
                    rowSeats: nRowSeats,
                    capacity: nCapacity,
                    hallInfo: {
                        hallId: oSeatsModel.getProperty("/HallId"),
                        hallName: oSeatsModel.getProperty("/HallName")
                    }
                });

                this.getView().setModel(oSeatModel, "seatModel");

                var sHallName = oEvent.getSource().getBindingContext("ShowtimeModel").getObject().HallName;
                var sShowDate = oEvent.getSource().getBindingContext("ShowtimeModel").getObject().ShowDate;
                var sShowTime = oEvent.getSource().getBindingContext("ShowtimeModel").getObject().ShowTime;
                var sCurrency = oEvent.getSource().getBindingContext("ShowtimeModel").getObject().Currency;

                this.gOnePrice = oEvent.getSource().getBindingContext("ShowtimeModel").getObject().Price;

                var sShowDateFormatted = this.formatter.formatTableDates(sShowDate);
                var sShowTimeFormatted = this.formatter.formatTableTime(sShowTime);

                var fnOpenAndSetValues = function () {
                    this.byId("_IDInput2").setValue(sHallName);
                    this.byId("_IDInput3").setValue(sShowDateFormatted);
                    this.byId("_IDInput4").setValue(sShowTimeFormatted);
                    this.byId("_IDInput5").setValue(this.gOnePrice);
                    this.byId("_IDInput6").setValue(sCurrency);

                    var sFullPrice = (this.gFullPrice).toFixed(2);
                    this.byId("_IDInput7").setValue(sFullPrice);
                    this.byId("_IDInput8").setValue(sCurrency);

                    // Call renderSeatGrid here
                    this.renderSeatGrid();

                    this.oDialog.open();
                }.bind(this);

                if (!this.oDialog) {
                    this.loadFragment({
                        name: "clientcinema.fragment.BuyTickets",
                    }).then(
                        function (oDialog) {
                            this.oDialog = oDialog;
                            fnOpenAndSetValues();
                            //  that.renderSeatGrid();
                            this.oDialog.open();
                        }.bind(this)
                    );
                } else {
                    fnOpenAndSetValues();
                    //  that.renderSeatGrid();
                    this.oDialog.open();
                }

                sap.ui.core.BusyIndicator.hide();

            }.bind(this));

        },

        onCancelDialog: function () {
            this.oDialog.close();
        },
        //********************Close Tickets Dialog*************


        renderSeatGrid: function () {

            if (!this.oDialog) {
                console.error("Dialog not found!");
                return;
            }

            // Find the VBox
            var oVBox = this.byId("seatVBox");

            if (!oVBox) {
                console.error("Cannot find seatVBox!");
                return;
            }

            // console.log("Found VBox:", oVBox.getId());

            oVBox.removeAllItems();

            var oModel = this.getView().getModel("seatModel");
            var aSeats = oModel.getProperty("/seats");
            var RowSeats = oModel.getProperty("/rowSeats");

            for (var i = 0; i < aSeats.length; i += RowSeats) {
                var oHBox = new sap.m.HBox({
                    wrap: "NoWrap",
                    alignItems: "Center",
                    justifyContent: "Center"
                });

                for (var j = i; j < i + RowSeats && j < aSeats.length; j++) {
                    var oSeat = aSeats[j];

                    var oButton = new sap.m.Button({
                        text: oSeat.seatNumber.toString(),
                        type: this.getSeatType(oSeat),
                        enabled: !oSeat.isBooked,
                        press: this.onSeatPress.bind(this, j),
                        width: "3rem",
                        class: "sapUiSmallMarginBegin"
                    });

                    var sTooltip = "Seat " + oSeat.seatNumber + " (ID: " + oSeat.seatId + ")";
                    if (oSeat.isBooked) {
                        sTooltip += " - Booked (RED)";
                    } else if (oSeat.selected) {
                        sTooltip += " - Selected (GREEN)";
                    } else {
                        sTooltip += " - Available (BLUE)";
                    }
                    oButton.setTooltip(sTooltip);

                    oHBox.addItem(oButton);
                }
                oVBox.addItem(oHBox);
            }

            // console.log("Seats rendered successfully. Total seats:", aSeats.length);
        },

        getSeatType: function (oSeat) {
            if (oSeat.isBooked) {
                return "Reject";       // RED
            } else if (oSeat.selected) {
                return "Accept";       // GREEN
            } else {
                return "Default";      // BLUE
            }
        },

        onSeatPress: function (iIndex) {
            var oModel = this.getView().getModel("seatModel");
            var aSeats = oModel.getProperty("/seats");

            // Only toggle if seat is not booked
            if (aSeats[iIndex] && !aSeats[iIndex].isBooked) {

                if (aSeats[iIndex].selected) {
                    this.gFullPrice -= Number(this.gOnePrice);
                } else {
                    this.gFullPrice += Number(this.gOnePrice);
                }

                aSeats[iIndex].selected = !aSeats[iIndex].selected;
                oModel.setProperty("/seats", aSeats);

                var sFullPrice = (this.gFullPrice).toFixed(2);
                this.byId("_IDInput7").setValue(sFullPrice);

                // Update UI
                if (this.oDialog && this.oDialog.isOpen()) {
                    this.renderSeatGrid();
                }
            }
        },

        onBuyTickets: function () {

            var oModel = this.getView().getModel("seatModel");
            var aSeats = oModel.getProperty("/seats");

            var aSelectedSeats = [];
            for (var i = 0; i < aSeats.length; i++) {
                if (aSeats[i].selected && !aSeats[i].isBooked) {
                    aSelectedSeats.push({
                        seatId: aSeats[i].seatId,
                        seatNumber: aSeats[i].seatNumber,
                        index: i
                    });
                }
            }

            if (aSelectedSeats.length === 0) {
                sap.m.MessageToast.show("Please select at least one seat");
                return;
            }

            var sMovieTitle = this.byId("_IDInput1").getValue();
            var sHallName = this.byId("_IDInput2").getValue();
            var sShowDate = this.byId("_IDInput3").getValue();
            var sShowTime = this.byId("_IDInput4").getValue();
            var sPrice = this.byId("_IDInput5").getValue();
            var sCurrency = this.byId("_IDInput6").getValue();

            // Show seat information
            var sSeatInfo = "Selected seats:\n";
            aSelectedSeats.forEach(function (oSeat, iIndex) {
                sSeatInfo += (iIndex + 1) + ". Seat " + oSeat.seatNumber
                    // + " (ID: " + oSeat.seatId + ")"
                    + "\n";
            });

            var fTotal = parseFloat(sPrice) * aSelectedSeats.length;

            var sMessage = sSeatInfo + "\n" +
                "Movie: " + sMovieTitle + "\n" +
                "Hall: " + sHallName + "\n" +
                "Date: " + sShowDate + "\n" +
                "Time: " + sShowTime + "\n\n" +
                "Price per seat: " + sPrice + " " + sCurrency + "\n" +
                "Total seats: " + aSelectedSeats.length + "\n" +
                "Total amount: " + fTotal.toFixed(2) + " " + sCurrency;

            sap.m.MessageBox.confirm(sMessage, {
                title: "Confirm Purchase",
                actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                onClose: function (sAction) {
                    if (sAction === sap.m.MessageBox.Action.OK) {

                        this.onCreateTicketRecord(aSelectedSeats);

                        this.oDialog.close();

                        MessageToast.show("Purchase was successful!");
                    }
                }.bind(this)
            });
        },


        onCreateTicketRecord: function (aSelectedSeats) {

            aSelectedSeats.forEach(function (oSeat) {
                var addparam = {
                    Showtimeid: this.gShowTimeId,
                    SeatID: oSeat.seatId,
                    SeatNumber: oSeat.seatNumber
                };

                var oDataModel = this.getOwnerComponent().getModel();

                console.log(addparam);

                oDataModel.callFunction("/create_ticket", {
                    method: "POST",
                    urlParameters: addparam,
                    success: function () {
                        // sap.m.MessageToast.show("Success");
                    },
                    error: function () {
                        // sap.m.MessageToast.show("Error");
                    }
                });

            }.bind(this));

        },






    });
});