
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "clientcinema/formatter/Formatter",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
], (Controller, Formatter, MessageToast, MessageBox) => {
    "use strict";

    return Controller.extend("clientcinema.controller.Showtime", {
        formatter: Formatter,

        onInit: function () {

            this.getOwnerComponent().getRouter().getRoute("Showtime").attachPatternMatched(this._onObjectMatchedActors, this);
            this.getView().getModel("MOVIE_ACTORSModel");

            this.getOwnerComponent().getRouter().getRoute("Showtime").attachPatternMatched(this._onObjectMatchedActors, this);
            this.getView().getModel("MOVIE_DIRECTORSModel");

            this.getOwnerComponent().getRouter().getRoute("Showtime").attachPatternMatched(this._onObjectMatchedCategory, this);
            this.getView().getModel("MOVIE_CATEGORYSModel");

            this.getOwnerComponent().getRouter().getRoute("Showtime").attachPatternMatched(this._onObjectMatchedShowtime, this);
            this.getView().getModel("ShowtimeModel");
        },

        _onObjectMatchedActors: function (oEvent) {
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
                    console.log(oresponse);
                    //attach the data to the model
                    oMOVIE_ACTORSJSONModel.setData(oresponse);
                    //attach the Model to the View
                    that.getView().setModel(oMOVIE_ACTORSJSONModel, "MOVIE_ACTORSModel");
                    console.log(that.getView().getModel("MOVIE_ACTORSModel"));
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
                    console.log(oresponse);
                    //attach the data to the model
                    oMOVIE_DIRECTORSJSONModel.setData(oresponse);
                    //attach the Model to the View
                    that.getView().setModel(oMOVIE_DIRECTORSJSONModel, "MOVIE_DIRECTORSModel");
                    console.log(that.getView().getModel("MOVIE_DIRECTORSModel"));
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
                    console.log(oresponse);
                    //attach the data to the model
                    oMOVIE_CATEGORYJSONModel.setData(oresponse);
                    //attach the Model to the View
                    that.getView().setModel(oMOVIE_CATEGORYJSONModel, "MOVIE_CATEGORYModel");
                    console.log(that.getView().getModel("MOVIE_CATEGORYModel"));
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

            console.log(oDataModel.sServiceUrl + sPath + "?$expand=to_SHOWTIMES");

            oDataModel.read(sPath, {
                urlParameters: {
                    "$expand": "to_SHOWTIMES"
                },

                success: function (oresponse) {
                    console.log(oresponse);
                    //attach the data to the model
                    oShowtimeJSONModel.setData(oresponse);
                    //attach the Model to the View
                    that.getView().setModel(oShowtimeJSONModel, "ShowtimeModel");
                    console.log(that.getView().getModel("ShowtimeModel"));
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

        }



    });
});