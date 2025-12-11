sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "clientcinema/formatter/Formatter",
], (Controller, Formatter) => {
    "use strict";

    return Controller.extend("clientcinema.controller.MyTickets", {
        formatter: Formatter,

        onInit: function () {

            sap.ui.core.BusyIndicator.show(0);

            var oDataModel = this.getOwnerComponent().getModel();

            // Read tickets
            oDataModel.read("/MY_TICKETS", {
                filters: [new sap.ui.model.Filter("LocalCreatedBy", sap.ui.model.FilterOperator.EQ, "CB9980001705")],
                success: (oTicketsData) => {
                    var aTickets = oTicketsData.results;
                    if (!aTickets.length) {
                        this.getView().setModel(new sap.ui.model.json.JSONModel([]), "MyTicketsModel");
                        return;
                    }

                    // Read showtimes for these tickets
                    var aShowtimeIds = aTickets.map(t => t.Showtimeid);
                    var sShowtimeFilter = aShowtimeIds.map(id => `Showtimeid eq '${id}'`).join(' or ');

                    oDataModel.read(`/ALL_SHOWTIMES?$filter=${encodeURIComponent(sShowtimeFilter)}`, {
                        success: (oShowtimesData) => {
                            var aShowtimes = oShowtimesData.results;

                            // Read movies for these showtimes
                            var aMovieIds = [...new Set(aShowtimes.map(st => st.MovieId))]; // unique MovieIds
                            var sMovieFilter = aMovieIds.map(id => `MovieID eq '${id}'`).join(' or ');

                            oDataModel.read(`/MOVIES_SHOWTIME?$filter=${encodeURIComponent(sMovieFilter)}`, {
                                success: (oMoviesData) => {
                                    var aMovies = oMoviesData.results;

                                    // Combine everything
                                    var aCombined = aTickets.map(ticket => {
                                        var oShowtime = aShowtimes.find(st => st.Showtimeid === ticket.Showtimeid);
                                        var oMovie = aMovies.find(m => m.MovieID === oShowtime.MovieId);

                                        return {
                                            Ticketid: ticket.Ticketid,
                                            MovieID: oMovie?.MovieID || "",
                                            Title: oMovie?.Title || "",
                                            HallName: oShowtime?.HallName || "",
                                            ShowDate: oShowtime?.ShowDate || "",
                                            ShowDateStr: oShowtime?.ShowDate ? new Date(oShowtime.ShowDate).toLocaleDateString() : "",
                                            ShowTime: oShowtime?.ShowTime || "",
                                            ShowTimeStr: oShowtime?.ShowTime ? `${Math.floor(oShowtime.ShowTime.ms / 3600000)}:${(oShowtime.ShowTime.ms % 3600000) / 60000}` : "",
                                            Price: oShowtime?.Price || "",
                                            PriceStr: oShowtime?.Price ? oShowtime.Price.toString() : "",
                                            Currency: oShowtime?.Currency || "",
                                            SeatNumber: ticket.SeatNumber
                                        };
                                    });

                                    this.getView().setModel(new sap.ui.model.json.JSONModel(aCombined), "MyTicketsModel");
                                    // console.log("MyTicketsModel:", aCombined);
                                    sap.ui.core.BusyIndicator.hide();
                                },
                                error: (err) => console.error("Error loading movies:", err)
                            });
                        },
                        error: (err) => console.error("Error loading showtimes:", err)
                    });
                },
                error: (err) => console.error("Error loading tickets:", err)
            });
        },

        onSearch: function (oEvent) {
            const sQuery = oEvent.getParameter("newValue");
            const oBinding = this.byId("_IDGenTable").getBinding("items");

            if (sQuery) {
                const aFilters = [
                    new sap.ui.model.Filter("Title", sap.ui.model.FilterOperator.Contains, sQuery),
                    new sap.ui.model.Filter("HallName", sap.ui.model.FilterOperator.Contains, sQuery),
                    // new sap.ui.model.Filter("SeatNumber", sap.ui.model.FilterOperator.Contains, sQuery),
                    new sap.ui.model.Filter("ShowDateStr", sap.ui.model.FilterOperator.Contains, sQuery),
                    new sap.ui.model.Filter("ShowTimeStr", sap.ui.model.FilterOperator.Contains, sQuery),
                    new sap.ui.model.Filter("PriceStr", sap.ui.model.FilterOperator.Contains, sQuery),
                    new sap.ui.model.Filter("Currency", sap.ui.model.FilterOperator.Contains, sQuery)
                ];

                const oMultiFilter = new sap.ui.model.Filter({
                    filters: aFilters,
                    and: false // OR filter across all columns
                });

                oBinding.filter(oMultiFilter);
            } else {
                oBinding.filter([]); // clear filter
            }
        },

        //// ***************************************************
        //// ********************Open Preview Dialog*************
        //// ************************************************** */
        onTicketPress: function (oItem) {

            var fnOpenAndSetValues = function () {

                // var sTicketid = oItem.getSource().getBindingContext("MyTicketsModel").getProperty().Ticketid;
                // var sMovieID = oItem.getSource().getBindingContext("MyTicketsModel").getProperty().MovieID;
                // var sTitle = oItem.getSource().getBindingContext("MyTicketsModel").getProperty().Title;
                // var sHallName = oItem.getSource().getBindingContext("MyTicketsModel").getProperty().HallName;
                // var sShowDateStr = oItem.getSource().getBindingContext("MyTicketsModel").getProperty().ShowDateStr;
                // var sShowTime = oItem.getSource().getBindingContext("MyTicketsModel").getProperty().ShowTime;
                // var sShowTimeStr = oItem.getSource().getBindingContext("MyTicketsModel").getProperty().ShowTimeStr;
                // var sPrice = oItem.getSource().getBindingContext("MyTicketsModel").getProperty().Price;
                // var sPriceStr = oItem.getSource().getBindingContext("MyTicketsModel").getProperty().PriceStr;
                // var sCurrency = oItem.getSource().getBindingContext("MyTicketsModel").getProperty().Currency;
                // var sSeatNumber = oItem.getSource().getBindingContext("MyTicketsModel").getProperty().SeatNumber;
                // var sShowDate = oItem.getSource().getBindingContext("MyTicketsModel").getProperty().ShowDate;

                var oContext = oItem.getSource().getBindingContext("MyTicketsModel");
                var oData = oContext.getObject();

                // Create a new model with the selected ticket data
                var oPreviewModel = new sap.ui.model.json.JSONModel({
                    ticketData: {
                        Ticketid: oData.Ticketid,
                        MovieID: oData.MovieID,
                        Title: oData.Title,
                        HallName: oData.HallName,
                        ShowDateStr: oData.ShowDateStr,
                        ShowTime: oData.ShowTime,
                        ShowTimeStr: oData.ShowTimeStr,
                        Price: oData.Price,
                        PriceStr: oData.PriceStr,
                        Currency: oData.Currency,
                        SeatNumber: oData.SeatNumber,
                        ShowDate: oData.ShowDate
                    }
                });

                // Set it as a named model on the view
                this.getView().setModel(oPreviewModel, "PreviewModel");
                console.log("PreviewModel data:", oPreviewModel);

                this.oPreviewDialog.open();
            }.bind(this);

            if (!this.oPreviewDialog) {
                this.loadFragment({
                    id: this.getView().getId(),
                    name: "clientcinema.fragment.PreviewTicket",
                }).then(
                    function (oPreviewDialog) {
                        this.oPreviewDialog = oPreviewDialog;
                        fnOpenAndSetValues();
                        this.oPreviewDialog.open();
                    }.bind(this)
                );
            } else {
                fnOpenAndSetValues();
                this.oPreviewDialog.open();
            }
        },


        onCancelPreview: function () {
            this.oPreviewDialog.close();
        },
        //********************Close Preview Dialog*************

        onDownloadPDF: function () {
            // Method 1: Direct approach using stored dialog reference
            if (!this.oPreviewDialog) {
                MessageBox.error("Preview dialog is not available. Please open a ticket preview first.");
                return;
            }

            // Get the dialog content
            var oDialogContent = this.oPreviewDialog.getContent();

            if (!oDialogContent || oDialogContent.length === 0) {
                MessageBox.error("No content found in the dialog.");
                return;
            }

            // Show loading indicator
            sap.ui.core.BusyIndicator.show(0);

            // Get the main content container
            var oContentContainer = oDialogContent[0];

            // Try to get DOM reference
            if (!oContentContainer.getDomRef()) {
                // Force rendering if not already rendered
                sap.ui.getCore().applyChanges();
            }

            var oDomElement = oContentContainer.getDomRef();

            if (!oDomElement) {
                sap.ui.core.BusyIndicator.hide();
                MessageBox.error("Cannot access dialog content. Please try again.");
                return;
            }

            // Start PDF generation
            this._generatePDFFromElement(oDomElement);
        },

        _generatePDFFromElement: function (oDomElement) {
            // Load required libraries
            this._loadPDFLibraries()
                .then(() => {
                    return this._captureElementAsCanvas(oDomElement);
                })
                .then((canvas) => {
                    return this._convertCanvasToPDF(canvas);
                })
                .then((pdfBlob) => {
                    this._downloadPDFFile(pdfBlob);
                    sap.ui.core.BusyIndicator.hide();
                    MessageToast.show("PDF downloaded successfully!");

                })
                .catch((error) => {
                    sap.ui.core.BusyIndicator.hide();
                    MessageBox.error("Failed to generate PDF: " + error.message);
                    console.error("PDF generation error:", error);
                });
        },

        _loadPDFLibraries: function () {
            return new Promise((resolve, reject) => {
                // Check if html2canvas is already loaded
                if (typeof html2canvas !== 'undefined' && typeof jspdf !== 'undefined') {
                    resolve();
                    return;
                }

                var librariesLoaded = 0;
                var totalLibraries = 2;

                var checkAllLoaded = function () {
                    librariesLoaded++;
                    if (librariesLoaded === totalLibraries) {
                        resolve();
                    }
                };

                // Load html2canvas
                if (typeof html2canvas === 'undefined') {
                    var html2canvasScript = document.createElement('script');
                    html2canvasScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
                    html2canvasScript.onload = checkAllLoaded;
                    html2canvasScript.onerror = function () {
                        reject(new Error('Failed to load html2canvas library'));
                    };
                    document.head.appendChild(html2canvasScript);
                } else {
                    checkAllLoaded();
                }

                // Load jsPDF
                if (typeof jspdf === 'undefined') {
                    var jsPDFScript = document.createElement('script');
                    jsPDFScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
                    jsPDFScript.onload = checkAllLoaded;
                    jsPDFScript.onerror = function () {
                        reject(new Error('Failed to load jsPDF library'));
                    };
                    document.head.appendChild(jsPDFScript);
                } else {
                    checkAllLoaded();
                }
            });
        },

        _captureElementAsCanvas: function (oDomElement) {
            return new Promise((resolve, reject) => {
                // Add temporary class for better PDF rendering
                oDomElement.classList.add('pdf-export-mode');

                // Configure html2canvas options
                var options = {
                    scale: 2, // Higher resolution for better quality
                    useCORS: true, // For loading images from different origins
                    backgroundColor: '#ffffff',
                    logging: false,
                    allowTaint: true,
                    imageTimeout: 0, // No timeout for images
                    onclone: function (clonedDoc) {
                        // Style adjustments for PDF
                        var clonedElement = clonedDoc.querySelector('.pdf-export-mode');
                        if (clonedElement) {
                            // Ensure white background
                            clonedElement.style.backgroundColor = '#ffffff';
                            clonedElement.style.padding = '20px';

                            // Make sure images are visible
                            var images = clonedElement.getElementsByTagName('img');
                            for (var i = 0; i < images.length; i++) {
                                images[i].style.maxWidth = '100%';
                                images[i].style.height = 'auto';
                            }
                        }
                    }
                };

                html2canvas(oDomElement, options)
                    .then(function (canvas) {
                        // Remove temporary class
                        oDomElement.classList.remove('pdf-export-mode');
                        resolve(canvas);
                    })
                    .catch(function (error) {
                        oDomElement.classList.remove('pdf-export-mode');
                        reject(new Error('Failed to capture screen: ' + error.message));
                    });
            });
        },

        _downloadPDFFile: function (pdf) {
            var oPreviewModel = this.getView().getModel("PreviewModel");
            var ticketData = oPreviewModel ? oPreviewModel.getProperty("/ticketData") : {};

            // Generate filename
            var movieName = ticketData.Title ? ticketData.Title.replace(/[^a-z0-9]/gi, '_') : 'Ticket';
            var ticketId = ticketData.Ticketid || new Date().getTime();
            var fileName = 'Lufthansa_Cinema_Ticket_' + movieName + '_' + ticketId + '.pdf';

            // Save PDF
            pdf.save(fileName);
        },

        onDownloadPDFSimple: function () {
            if (!this.oPreviewDialog) {
                MessageBox.error("Preview dialog is not available.");
                return;
            }

            sap.ui.core.BusyIndicator.show(0);

            // Get the dialog DOM element
            var oDialogDom = this.oPreviewDialog.getDomRef();

            if (!oDialogDom) {
                sap.ui.core.BusyIndicator.hide();
                MessageBox.error("Cannot access dialog content.");
                return;
            }

            // Find the content container
            var oContent = oDialogDom.querySelector('.sapMDialogScrollCont') ||
                oDialogDom.querySelector('.printPreview') ||
                oDialogDom;

            // Use window.print for simple PDF generation
            var printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Movie Ticket</title>
                        <style>
                            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                            @media print {
                                body { margin: 0; }
                                .no-print { display: none !important; }
                            }
                        </style>
                    </head>
                    <body>
                        <div style="border: 2px solid #000; padding: 20px; max-width: 800px; margin: 0 auto;">
            `);
            printWindow.document.write(oContent.innerHTML);
            printWindow.document.write(`
                        </div>
                        <div class="no-print" style="text-align: center; margin-top: 20px;">
                            <button onclick="window.print()">Print/Save as PDF</button>
                            <button onclick="window.close()">Close</button>
                        </div>
                    </body>
                </html>
            `);
            printWindow.document.close();

            sap.ui.core.BusyIndicator.hide();

            // Auto-print after content loads
            printWindow.onload = function () {
                printWindow.print();
            };
        },


        _convertCanvasToPDF: function (canvas) {
            var that = this;
            return new Promise(function (resolve, reject) {
                try {
                    // Check if jsPDF is available
                    if (typeof window.jspdf === 'undefined') {
                        reject(new Error('jsPDF library not loaded'));
                        return;
                    }

                    var jsPDF = window.jspdf.jsPDF;
                    var pdf = new jsPDF('p', 'mm', 'a4');

                    // Get ticket data for filename
                    var oPreviewModel = that.getView().getModel("PreviewModel");
                    var ticketData = oPreviewModel ? oPreviewModel.getProperty("/ticketData") : {};

                    // Calculate dimensions
                    var imgData = canvas.toDataURL('image/png');
                    var pageWidth = pdf.internal.pageSize.getWidth();
                    var pageHeight = pdf.internal.pageSize.getHeight();

                    var margin = 10; // 10mm margin
                    var contentWidth = pageWidth - (2 * margin);
                    var contentHeight = canvas.height * contentWidth / canvas.width;

                    // Check if content fits on one page
                    if (contentHeight > pageHeight - (2 * margin)) {
                        // Scale down to fit
                        var scale = (pageHeight - (2 * margin)) / contentHeight;
                        contentWidth *= scale;
                        contentHeight *= scale;
                    }

                    // Center the content
                    var xPos = (pageWidth - contentWidth) / 2;
                    var yPos = (pageHeight - contentHeight) / 2;

                    // Add image to PDF
                    pdf.addImage(imgData, 'PNG', xPos, yPos, contentWidth, contentHeight);

                    // Add ticket info as metadata
                    if (ticketData && ticketData.Ticketid) {
                        pdf.setProperties({
                            title: 'Movie Ticket - ' + (ticketData.Title || ''),
                            subject: 'Ticket ID: ' + ticketData.Ticketid,
                            creator: 'Lufthansa Cinema'
                        });
                    }

                    resolve(pdf);
                } catch (error) {
                    reject(new Error('Failed to create PDF: ' + error.message));
                }
            });
        },






    });
});