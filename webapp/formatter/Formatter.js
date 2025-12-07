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

        formatTableTime: function (oTime) {
            if (!oTime) {
                return "";
            }

            // Handle Edm.Time format (milliseconds from midnight)
            if (oTime.__edmType === "Edm.Time" && oTime.ms !== undefined) {
                var totalSeconds = Math.floor(oTime.ms / 1000);
                var hours = Math.floor(totalSeconds / 3600);
                var minutes = Math.floor((totalSeconds % 3600) / 60);
                var seconds = totalSeconds % 60;

                var ampm = hours >= 12 ? 'PM' : 'AM';

                hours = hours % 12;
                hours = hours === 0 ? 12 : hours;

                return String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0") + " " + ampm;

            }

        },

        formatDuration: function (iMinutes) {
            if (!iMinutes && iMinutes !== 0) {
                return "";
            }

            var hours = Math.floor(iMinutes / 60);
            var minutes = iMinutes % 60;

            if (hours > 0) {
                return hours + "h " + minutes + "min";
            } else {
                return minutes + "min";
            }
        },


        imageURL: function (sMovieID) {
            if (!sMovieID) {
                return "img/no-image.png"; // fallback
            }

            // Build the image SRC dynamically
            const baseUrl = "https://f80d7f7e-8924-4544-9498-5524e9fd4ff1.abap-web.us10.hana.ondemand.com/sap/opu/odata/sap/ZUI_EH_LHIND_CINEMA_O2";
            var sUrl = `${baseUrl}/MOVIES(MovieID=guid'${sMovieID}',IsActiveEntity=true)/$value`;
            console.log("Image URL:", sUrl);
            return sUrl;
        }



    };
});