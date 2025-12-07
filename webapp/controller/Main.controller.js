sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "clientcinema/formatter/Formatter",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
], (Controller, Formatter, MessageToast, MessageBox) => {
    "use strict";

    return Controller.extend("clientcinema.controller.Main", {
        formatter: Formatter, _slideInterval: null,

        onInit() {

            // Start auto-slide when view is loaded
            this.getView().addEventDelegate({
                onAfterRendering: this.startAutoSlide.bind(this)
            });
            
            var oMoviesJSONModel = new sap.ui.model.json.JSONModel();
            var that = this;
            //read the data from Back End (READ_GET_ENTITYSET)
            var oDataModel = this.getOwnerComponent().getModel();
            var sPath = "/MOVIES_SHOWTIME";
            oDataModel.read(sPath, {
                sorters: [new sap.ui.model.Sorter("MovieID", false)],
                success: function (oresponse) {
                    console.log(oresponse);
                    //attach the data to the model
                    oMoviesJSONModel.setData(oresponse.results);
                    //attach the Model to the View
                    that.getView().setModel(oMoviesJSONModel, "MoviesJSONModel");
                },
                error: function (oerror) {
                    console.log("error")
                },
            });

        },

        onSearchMovie: function (oEvent) {
            const sQuery = oEvent.getParameter("newValue");
            const oBinding = this.byId("MoviesTable").getBinding("items");

            if (sQuery) {
                const oFilter = new sap.ui.model.Filter("Title", sap.ui.model.FilterOperator.Contains, sQuery);
                oBinding.filter([oFilter]);
            } else {
                oBinding.filter([]);
            }
        },

        startAutoSlide: function() {
            var oCarousel = this.byId("_IDGenCarousel1");
            if (!oCarousel) return;
            
            // Clear any existing interval first
            this.stopAutoSlide();
            
            // Set interval to slide every 3 seconds (3000ms)
            this._slideInterval = setInterval(function() {
                oCarousel.next(); // Move to next slide
            }, 3000);
        },

        stopAutoSlide: function() {
            if (this._slideInterval) {
                clearInterval(this._slideInterval);
                this._slideInterval = null;
            }
        },
        
        // Optional: Pause on hover
        onCarouselHover: function() {
            this.stopAutoSlide();
        },
        
        // Optional: Resume when mouse leaves
        onCarouselLeave: function() {
            this.startAutoSlide();
        },
        
        onDestroy: function() {
            // Clean up when controller is destroyed
            this.stopAutoSlide();
        },

        onTilePress: function(evt) {
			MessageToast.show("The generic tile two pressed.");
		},

        onMoviePress: function (oItem) {
            // const MovieID = oEvent.getSource().getBindingContext().getProperty("MovieID");
            // this.getOwnerComponent().getRouter().navTo("MovieDetails", {
            //  MovieID: MovieID });
            // sap.m.MessageToast.show("ADD NAV.");

            this.getOwnerComponent().getRouter().navTo("Showtime", {
                MovieID: oItem.getSource().getBindingContext("MoviesJSONModel").getProperty().MovieID
            });
        }

    });
});