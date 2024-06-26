(() => {
  const width = 320;
  let height = 0;
   let video = null;
   let canvas= null;
  let captureBtn ;
  let photo;
  let select;
  function startup(){
    video = document.querySelector("#video");
    canvas = document.querySelector("#canvas");
    captureBtn = document.querySelector("#capture");
    photo= document.querySelector("#photo");
    select = document.querySelector("#deviceSelection");

    navigator.mediaDevices
    .enumerateDevices()
    .then((devices) => {
      devices.forEach((device) => {
        let option = new Option(`${device.kind}: ${device.label}`,device.deviceId)
        select.add(option)
        console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
      });
    })
    .catch((err) => {
      console.error(`${err.name}: ${err.message}`);
    });

    navigator.mediaDevices.getUserMedia({
      video:true,
      audio: false
    }).then(stream => {
      video.srcObject = stream;
      video.play()
    }).catch(err => {
      console.log(`some error occured`, err)
    })

    video.addEventListener('canplay', (event) => {
      height = video.videoHeight / (video.videoWidth/width);
      canvas.setAttribute('width', width);
      canvas.setAttribute("height", height);
    }, false)

    captureBtn.addEventListener('click', (event) => {
      event.preventDefault();
      takePicture()
    }, false)
  }
  function clearphoto() {
    const context = canvas.getContext("2d");
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);
  
    const data = canvas.toDataURL("image/png");
    photo.setAttribute("src", data);
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
  
  
   window.addEventListener("load", startup, false)
  })()