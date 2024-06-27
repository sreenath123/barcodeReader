(() => {
  const width = 320;
  let height = 0;
  let video = null;
  let canvas = null;
  let captureBtn;
  let photo;
  let select;
  let stopBtn;
  let selectedDeviceId;
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

    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        //filter(d => d.kind === 'videoinput')
        devices.forEach((device) => {
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
  }

  function startStream(selectedDeviceId) {
    let constraint = selectedDeviceId? {video: {
      deviceId: {
        exact: selectedDeviceId
      }
    },audio: false}: {video: true, audio: false}
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
      photo.setAttribute("src", data);
    } else {
      clearphoto();
    }
  }

  window.addEventListener("load", startup, false);
})();
