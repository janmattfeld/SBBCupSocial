var app = {
  // Application Constructor
  initialize: function() {
    document.addEventListener(
      "deviceready",
      this.onDeviceReady.bind(this),
      false
    );
  },

  onDeviceReady: function() {
    this.initNfc();
  },

  initNfc: function() {
    nfc.readerMode(
      nfc.FLAG_READER_NFC_A,
      this.onNfcTagReceived.bind(this),
      error => console.log("NFC reader mode failed", error)
    );
  },

  onNfcTagReceived: function(nfcTag) {
    console.log(JSON.stringify(nfcTag));
    var nfcTagID = nfcTag.id.join();
    this.sendTag(nfcTagID);
    window.plugins.toast.showWithOptions({
      message: "Cup scanned",
      duration: "long", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
      position: "bottom",
      addPixelsY: -40 // added a negative value to move it up a bit (default 0)
    });
  },

  sendTag: function(tagID) {
    var userID = "TrashCan";

    var data = JSON.stringify({
      id_tr: userID,
      id_cu: tagID
    });

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener(
      "readystatechange",
      function() {
        if (this.readyState === 4) {
          console.log(this.responseText);
        }
      }.bind(this)
    );

    xhr.open("POST", "https://f8e562f3.ngrok.io/station");
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
