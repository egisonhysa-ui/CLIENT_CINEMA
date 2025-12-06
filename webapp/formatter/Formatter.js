sap.ui.define([
    "sap/ui/model/type/Time",
    "sap/ui/core/format/DateFormat",
], function (Time, DateFormat) {
    "use strict";
    return {

        formatTableDates: function (oDate) {
            if (!oDate) {
                return "";
            }
            // Convert to JS Date if needed
            var date = new Date(oDate);
            // Format to DD.MM.YYYY (or whatever you prefer)
            var day = String(date.getDate()).padStart(2, "0");
            var month = String(date.getMonth() + 1).padStart(2, "0");
            var year = date.getFullYear();
            return day + "/" + month + "/" + year;
        },


        imageURL: function (sMovieID) {
            if (!sMovieID) {
                return "img/no-image.png"; // fallback
            }

            // Build the image SRC dynamically
            const baseUrl = "https://f80d7f7e-8924-4544-9498-5524e9fd4ff1.abap-web.us10.hana.ondemand.com/sap/opu/odata/sap/ZUI_EH_LHIND_CINEMA_O2";
            return `${baseUrl}/MOVIES(MovieID=guid'${sMovieID}',IsActiveEntity=true)/$value`;
        }



    };
});