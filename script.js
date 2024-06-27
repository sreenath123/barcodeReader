(() => {
  const width = 320;
  let height = 0;
  let video = null;
  let canvas = null;
  let captureBtn;
  let photo;
  let select;
  let stopBtn;
  let scanBtn;
  let selectedDeviceId;
  let opMessage;
  const defaultConstraint = {
    video: true,
    audio: false,
  };
  function startup() {
    video = document.querySelector("#video");
    canvas = document.querySelector("#canvas");
    captureBtn = document.querySelector("#capture");
    // photo = document.querySelector("#photo");
    select = document.querySelector("#deviceSelection");
    stopBtn = document.querySelector("#stopBtn");
    scanBtn = document.querySelector("#scanbtn");
    opMessage = document.querySelector("#opMessage");

    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        devices.filter(d => d.kind === 'videoinput').forEach((device) => {
          let option = new Option(
            `${device.kind}: ${device.label}`,
            device.deviceId
          );
          select.add(option);
          console.log(
            `${device.kind}: ${device.label} id = ${device.deviceId}`
          );
        });
      })
      .catch((err) => {
        console.error(`${err.name}: ${err.message}`);
      });
    console.log(select.value);
    startStream();

    video.addEventListener(
      "canplay",
      (event) => {
        height = video.videoHeight / (video.videoWidth / width);
        canvas.setAttribute("width", width);
        canvas.setAttribute("height", height);
      },
      false
    );

    captureBtn.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        takePicture();
      },
      false
    );

    select.addEventListener("change", function () {
      // This function will execute whenever an option is selected
      let selectedOption = select.options[select.selectedIndex];
      let selectedValue = selectedOption.value;
      stopStream();
      console.log("Selected value:", selectedValue);

      startStream(selectedValue);
    });

    stopBtn.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        stopStream();
      },
      false
    );

    scanBtn.addEventListener("click", async (event) => {
      event.preventDefault();
      if ("BarcodeDetector" in window) {
        let bcDetector = new window.BarcodeDetector();
        let op = await bcDetector.detect(canvas);
        opMessage.innerText = op?.[0].rawValue;
        drawLine(op);
      }
    });
  }

  function startStream(selectedDeviceId) {
    let constraint = selectedDeviceId
      ? {
          video: {
            deviceId: {
              exact: selectedDeviceId,
            },
          },
          audio: false,
        }
      : { video: true, audio: false };
    navigator.mediaDevices
      .getUserMedia(constraint)
      .then((stream) => {
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.log(`some error occured`, err);
      });
  }

  function stopStream() {
    if (video && video.srcObject) {
      const stream = video.srcObject;
      const tracks = stream.getTracks();

      tracks.forEach((track) => {
        track.stop();
      });

      video.srcObject = null;
    }
  }

  function clearphoto() {
    const context = canvas.getContext("2d");
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    const data = canvas.toDataURL("image/png");
    // photo.setAttribute("src", data);
  }

  function takePicture() {
    const context = canvas.getContext("2d");
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);

      const data = canvas.toDataURL("image/png");
      // photo.setAttribute("src", data);
      //  drawLine()
    } else {
      clearphoto();
    }
  }
  function drawLine(barcode) {
    if (barcode.length) {
      const ctx = canvas.getContext("2d");
      let bc = barcode[0];
      let x1 = bc.cornerPoints[0].x;
      let y1 = bc.cornerPoints[0].y;
      let x2 = bc.cornerPoints[1].x;
      let y2 = bc.cornerPoints[1].y;
      let x3 = bc.cornerPoints[2].x;
      let y3 = bc.cornerPoints[2].y;
      let x4 = bc.cornerPoints[3].x;
      let y4 = bc.cornerPoints[3].y;
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x3, y3);
      ctx.lineTo(x4, y4);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    }
  }

  window.addEventListener("load", startup, false);
})();
