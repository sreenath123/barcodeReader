// check compatibility
let text = ""
if (!("BarcodeDetector" in globalThis)) {
    text = "Barcode Detector is not supported by this browser.";
  } else {
    text = "Barcode Detector supported!";
  
    // create new detector
    const barcodeDetector = new BarcodeDetector({
      formats: ["code_39", "codabar", "ean_13"],
    });
    const imageEl = new Image();
    imageEl.addEventListener('load', () => {
      alert('image loaded')
    })
    imageEl.src = "img/bar.jpg"

    barcodeDetector
  .detect(imageEl)
  .then((barcodes) => {
    barcodes.forEach((barcode) => alert(barcode.rawValue));
  })
  .catch((err) => {
    console.log(err);
  });

  }
  
  