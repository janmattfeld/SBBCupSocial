var app = {
    
  initialize: function() {
    document.addEventListener(
      "deviceready",
      this.onDeviceReady.bind(this),
      false
    );
  },

  onDeviceReady: function() {
    this.receivedEvent("deviceready");
    nfc.readerMode(
      nfc.FLAG_READER_NFC_A,
      this.onNfcTagReceived.bind(this),
      error => console.log("NFC reader mode failed", error)
    );

    const push = PushNotification.init({
      android: {},
      browser: {
        pushServiceURL: "http://push.api.phonegap.com/v1/push"
      },
      ios: {
        alert: "true",
        badge: "true",
        sound: "true"
      },
      windows: {}
    });

    push.on("registration", data => {
      console.log(data);
      // data.registrationId
    });

    push.on("notification", data => {
      console.log(data);
      // data.message,
      // data.title,
      // data.count,
      // data.sound,
      // data.image,
      // data.additionalData
    });

    push.on("error", e => {
      console.log(e.message);
    });
  },

  onNfcTagReceived: function(nfcTag) {
    console.log(JSON.stringify(nfcTag));
    var nfcTagID = nfcTag.id.join();
    var userID = "JAN";

    var data = JSON.stringify({
      id_client: userID,
      id_cup: nfcTagID
    });

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function() {
      if (this.readyState === 4) {
        console.log(this.responseText);
      }
    });

    xhr.open("POST", "https://7243a96d.ngrok.io/client");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("cache-control", "no-cache");
    xhr.send(data);
  },

  // Update DOM on a Received Event
  receivedEvent: function(id) {
    var parentElement = document.getElementById(id);
    var listeningElement = parentElement.querySelector(".listening");
    var receivedElement = parentElement.querySelector(".received");

    listeningElement.setAttribute("style", "display:none;");
    receivedElement.setAttribute("style", "display:block;");

    console.log("Received Event: " + id);
  }
};

app.initialize();
