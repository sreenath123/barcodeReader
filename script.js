// check compatibility
import imageEl from 'bar.jpg'
let text = ""
if (!("BarcodeDetector" in globalThis)) {
    text = "Barcode Detector is not supported by this browser.";
  } else {
    text = "Barcode Detector supported!";
  
    // create new detector
    const barcodeDetector = new BarcodeDetector({
      formats: ["code_39", "codabar", "ean_13"],
    });

    barcodeDetector
  .detect(imageEl)
  .then((barcodes) => {
    barcodes.forEach((barcode) => alert(barcode.rawValue));
  })
  .catch((err) => {
    console.log(err);
  });

  }
  
  