// User service UUID: Change this to your generated service UUID
const USER_SERVICE_UUID         = 'fdc3e1c5-34a5-4661-87d1-74b394d11cb4'; // cocoromask LIFF
// User service characteristics
const LED_CHARACTERISTIC_UUID   = 'E9062E71-9E62-4BC6-B0D3-35CDCD9B027B';
const BTN_CHARACTERISTIC_UUID   = '62FBD229-6EDD-4D1A-B554-5C4E1BB29169';

// PSDI Service UUID: Fixed value for Developer Trial
const PSDI_SERVICE_UUID         = 'E625601E-9E55-4597-A598-76018A0D293D'; // Device ID
const PSDI_CHARACTERISTIC_UUID  = '26E2B12B-85F0-4F3F-9FDD-91D114270E6E';

// UI settings
let ledState = false; // true: LED on, false: LED off
let clickCount = 0;


// mode1 settings
let mode1State = false; // true: mode1 on, false: mode1 off
// mode2 settings
let mode2State = false; // true: mode2 on, false: mode2 off
// mode3 settings
let mode3State = false; // true: mode3 on, false: mode3 off


// -------------- //
// On window load //
// -------------- //

window.onload = () => {
    initializeApp();
};

// ----------------- //
// Handler functions //
// ----------------- //

function handlerToggleLed() {
    ledState = !ledState;

    uiToggleLedButton(ledState);
    liffToggleDeviceLedState(ledState);
}


/******* mode1 button action *****************/
  function handlerToggleMode1(){
    mode1State = !mode1State;

    uiToggleMode1Button(mode1State);
    liffToggleDeviceMode1State(mode1State);
    console.log("mode-1");
 }

/******* mode2 button action *****************/
 function handlerToggleMode2(){
   mode2State = !mode2State;

   uiToggleMode2Button(mode2State);
   liffToggleDeviceMode2State(mode2State);
   console.log("mode-2");
}

/******* mode3 button action *****************/
function handlerToggleMode3(){
  mode3State = !mode3State;

  uiToggleMode3Button(mode3State);
  liffToggleDeviceMode3State(mode3State);
  console.log("mode-3");
}


// ------------ //
// UI functions //
// ------------ //

function uiToggleLedButton(state) {
    const el = document.getElementById("btn-led-toggle");
    el.innerText = state ? "Switch LED OFF" : "Switch LED ON";

    if (state) {
      el.classList.add("led-on");
    } else {
      el.classList.remove("led-on");
    }
}

/*************** mode1 switch ***************/
function uiToggleMode1Button(state) {
    const el = document.getElementById("btn-mode1-toggle");
    el.innerText = state ? "男性の声 OFF" : "男性の声 ON";

    if (state) {
      el.classList.add("mode1-on");
    } else {
      el.classList.remove("mode1-on");
    }
}
/***************************************/

/*************** mode2 switch ***************/
function uiToggleMode2Button(state) {
    const el = document.getElementById("btn-mode2-toggle");
    el.innerText = state ? "女性の声 OFF" : "女性の声 ON";

    if (state) {
      el.classList.add("mode2-on");
    } else {
      el.classList.remove("mode2-on");
    }
}
/***************************************/

/*************** mode3 switch ***************/
function uiToggleMode3Button(state) {
    const el = document.getElementById("btn-mode3-toggle");
    el.innerText = state ? "ロボットの声 OFF" : "ロボットの声 ON";

    if (state) {
      el.classList.add("mode3-on");
    } else {
      el.classList.remove("mode3-on");
    }
}
/***************************************/

function uiCountPressButton() {
    clickCount++;

    const el = document.getElementById("click-count");
    el.innerText = clickCount;
}

function uiToggleStateButton(pressed) {
    const el = document.getElementById("btn-state");

    if (pressed) {
        el.classList.add("pressed");
        el.innerText = "Pressed";
    } else {
        el.classList.remove("pressed");
        el.innerText = "Released";
    }
}

function uiToggleDeviceConnected(connected) {
    const elStatus = document.getElementById("status");
    const elControls = document.getElementById("controls");

    elStatus.classList.remove("error");

    if (connected) {
        // Hide loading animation
        uiToggleLoadingAnimation(false);
        // Show status connected
        elStatus.classList.remove("inactive");
        elStatus.classList.add("success");
        elStatus.innerText = "Device connected";
        // Show controls
        elControls.classList.remove("hidden");
    } else {
        // Show loading animation
        uiToggleLoadingAnimation(true);
        // Show status disconnected
        elStatus.classList.remove("success");
        elStatus.classList.add("inactive");
        elStatus.innerText = "Device disconnected";
        // Hide controls
        elControls.classList.add("hidden");
    }
}

function uiToggleLoadingAnimation(isLoading) {
    const elLoading = document.getElementById("loading-animation");

    if (isLoading) {
        // Show loading animation
        elLoading.classList.remove("hidden");
    } else {
        // Hide loading animation
        elLoading.classList.add("hidden");
    }
}

function uiStatusError(message, showLoadingAnimation) {
    uiToggleLoadingAnimation(showLoadingAnimation);

    const elStatus = document.getElementById("status");
    const elControls = document.getElementById("controls");

    // Show status error
    elStatus.classList.remove("success");
    elStatus.classList.remove("inactive");
    elStatus.classList.add("error");
    elStatus.innerText = message;

    // Hide controls
    elControls.classList.add("hidden");
}

function makeErrorMsg(errorObj) {
    return "Error\n" + errorObj.code + "\n" + errorObj.message;
}

// -------------- //
// LIFF functions //
// -------------- //

function initializeApp() {
    liff.init(() => initializeLiff(), error => uiStatusError(makeErrorMsg(error), false));
}

function initializeLiff() {
    liff.initPlugins(['bluetooth']).then(() => {
        liffCheckAvailablityAndDo(() => liffRequestDevice());
    }).catch(error => {
        uiStatusError(makeErrorMsg(error), false);
    });
}

function liffCheckAvailablityAndDo(callbackIfAvailable) {
    // Check Bluetooth availability
    liff.bluetooth.getAvailability().then(isAvailable => {
        if (isAvailable) {
            uiToggleDeviceConnected(false);
            callbackIfAvailable();
        } else {
            uiStatusError("Bluetooth not available", true);
            setTimeout(() => liffCheckAvailablityAndDo(callbackIfAvailable), 10000);
        }
    }).catch(error => {
        uiStatusError(makeErrorMsg(error), false);
    });;
}

function liffRequestDevice() {
    liff.bluetooth.requestDevice().then(device => {
        liffConnectToDevice(device);
    }).catch(error => {
        uiStatusError(makeErrorMsg(error), false);
    });
}

function liffConnectToDevice(device) {
    device.gatt.connect().then(() => {
        document.getElementById("device-name").innerText = device.name;
        document.getElementById("device-id").innerText = device.id;

        // Show status connected
        uiToggleDeviceConnected(true);

        // Get service
        device.gatt.getPrimaryService(USER_SERVICE_UUID).then(service => {
            liffGetUserService(service);
        }).catch(error => {
            uiStatusError(makeErrorMsg(error), false);
        });
        device.gatt.getPrimaryService(PSDI_SERVICE_UUID).then(service => {
            liffGetPSDIService(service);
        }).catch(error => {
            uiStatusError(makeErrorMsg(error), false);
        });

        // Device disconnect callback
        const disconnectCallback = () => {
            // Show status disconnected
            uiToggleDeviceConnected(false);

            // Remove disconnect callback
            device.removeEventListener('gattserverdisconnected', disconnectCallback);

            // Reset LED state
            ledState = false;
            // Reset UI elements
            uiToggleLedButton(false);
            uiToggleStateButton(false);

            // Try to reconnect
            initializeLiff();
        };

        device.addEventListener('gattserverdisconnected', disconnectCallback);
    }).catch(error => {
        uiStatusError(makeErrorMsg(error), false);
    });
}

function liffGetUserService(service) {
    // Button pressed state
    service.getCharacteristic(BTN_CHARACTERISTIC_UUID).then(characteristic => {
        liffGetButtonStateCharacteristic(characteristic);
    }).catch(error => {
        uiStatusError(makeErrorMsg(error), false);
    });

    // Toggle LED
    service.getCharacteristic(LED_CHARACTERISTIC_UUID).then(characteristic => {
        window.ledCharacteristic = characteristic;

        // Switch off by default
        liffToggleDeviceLedState(false);
    }).catch(error => {
        uiStatusError(makeErrorMsg(error), false);
    });
}

function liffGetPSDIService(service) {
    // Get PSDI value
    service.getCharacteristic(PSDI_CHARACTERISTIC_UUID).then(characteristic => {
        return characteristic.readValue();
    }).then(value => {
        // Byte array to hex string
        const psdi = new Uint8Array(value.buffer)
            .reduce((output, byte) => output + ("0" + byte.toString(16)).slice(-2), "");
        document.getElementById("device-psdi").innerText = psdi;
    }).catch(error => {
        uiStatusError(makeErrorMsg(error), false);
    });
}

function liffGetButtonStateCharacteristic(characteristic) {
    // Add notification hook for button state
    // (Get notified when button state changes)
    characteristic.startNotifications().then(() => {
        characteristic.addEventListener('characteristicvaluechanged', e => {
            const val = (new Uint8Array(e.target.value.buffer))[0];
            if (val > 0) {
                // press
                uiToggleStateButton(true);
            } else {
                // release
                uiToggleStateButton(false);
                uiCountPressButton();
            }
        });
    }).catch(error => {
        uiStatusError(makeErrorMsg(error), false);
    });
}

function liffToggleDeviceLedState(state) {
    // on: 0x01
    // off: 0x00
    window.ledCharacteristic.writeValue(
        state ? new Uint8Array([0x01]) : new Uint8Array([0x00])
    ).catch(error => {
        uiStatusError(makeErrorMsg(error), false);
    });
}

/********* mode1 *********/
function liffToggleDeviceMode1State(state) {
    // on: 0x03
    // off: 0x02
    window.ledCharacteristic.writeValue(
        state ? new Uint8Array([0x03]) : new Uint8Array([0x02])
    ).catch(error => {
        uiStatusError(makeErrorMsg(error), false);
    });
}

/********* mode2 *********/
function liffToggleDeviceMode2State(state) {
    // on: 0x05
    // off: 0x04
    window.ledCharacteristic.writeValue(
        state ? new Uint8Array([0x05]) : new Uint8Array([0x04])
    ).catch(error => {
        uiStatusError(makeErrorMsg(error), false);
    });
}

/********* mode3 *********/
function liffToggleDeviceMode3State(state) {
    // on: 0x09
    // off: 0x08
    window.ledCharacteristic.writeValue(
        state ? new Uint8Array([0x09]) : new Uint8Array([0x08])
    ).catch(error => {
        uiStatusError(makeErrorMsg(error), false);
    });
}
