var app = {
  numberOfCupsReturned: 6,
  numberOfCupsToReturn: 4,
  percentOfCupsReturned: 60,
  numberOfCupsNotReturned: 0,

  initialize: function() {
    M.AutoInit();
    document.addEventListener(
      "deviceready",
      this.onDeviceReady.bind(this),
      false
    );
  },

  onDeviceReady: function() {
    this.initPush();
    this.initNfc();
  },

  initNfc: function() {
    nfc.readerMode(
      nfc.FLAG_READER_NFC_A,
      this.onNfcTagReceived.bind(this),
      error => console.log("NFC reader mode failed", error)
    );
  },

  initPush: function() {
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
    });

    push.on("notification", data => {
      console.log(data);
      window.plugins.toast.showWithOptions({
        message: data.message
      });
      this.numberOfCupsReturned = this.numberOfCupsReturned + 1;
      this.numberOfCupsToReturn = this.numberOfCupsToReturn - 1;
      this.percentOfCupsReturned = this.percentOfCupsReturned + 10;
      this.numberOfCupsNotReturned = this.numberOfCupsNotReturned - 1;
      this.updateBonusStats();
    });

    push.on("error", e => {
      console.log(e.message);
    });
  },

  onScanPress: function() {
    cordova.plugins.barcodeScanner.scan(
      function(result) {
        this.sendTag(result.text);
        window.plugins.toast.showWithOptions({
          message: "Cup scanned",
          duration: "long", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
          position: "bottom",
          addPixelsY: -40 // added a negative value to move it up a bit (default 0)
        });
        console.log(
          "We got a barcode\n" +
            "Result: " +
            result.text +
            "\n" +
            "Format: " +
            result.format +
            "\n" +
            "Cancelled: " +
            result.cancelled
        );
      }.bind(this),
      function(error) {
        console.log("Scanning failed: " + error);
      },
      {
        prompt: "Place cup barcode inside the scan area", // Android
        orientation: "landscape"
      }
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
    this.numberOfCupsNotReturned = this.numberOfCupsNotReturned + 1;
    this.updateBonusStats();

    var userID = "JAN";

    var data = JSON.stringify({
      id_cl: userID,
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

    xhr.open("POST", "https://f8e562f3.ngrok.io/client");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("cache-control", "no-cache");
    xhr.send(data);
  },

  updateBonusStats: function() {
    document.getElementById("numberOfCupsReturned").innerText =
      this.numberOfCupsReturned + "/";
    document.getElementById("numberOfCupsToReturn").innerText =
      this.numberOfCupsToReturn + " returns until next reward";
    document.getElementById("bonusProgressBar").style.width =
      this.percentOfCupsReturned + "%";

    if (this.numberOfCupsNotReturned > 0) {
      document.getElementById("numberOfCupsNotReturned").style.display =
        "block";
    } else {
      document.getElementById("numberOfCupsNotReturned").style.display =
        "none";
    }

    if (this.numberOfCupsReturned >= 10) {
      this.numberOfCupsReturned = 0;
      this.numberOfCupsToReturn = 10;
      this.percentOfCupsReturned = 0;
      this.numberOfCupsNotReturned = 0;
    }
  }
};

app.initialize();
