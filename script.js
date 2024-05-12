// check compatibility
const statusField = document.getElementById('status');
let text = ""
if (!("BarcodeDetector" in globalThis)) {
    text = "Barcode Detector is not supported by this browser.";
  } else {
    text = "Barcode Detector supported!";
  
    // create new detector
    const barcodeDetector = new BarcodeDetector({
      formats: ["code_39", "codabar", "ean_13"],
    });
  }
  
  statusField.text = text