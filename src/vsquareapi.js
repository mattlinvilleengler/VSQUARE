//dom
var upgrade = function () {
    componentHandler.upgradeDom();
}
//storage
var setStorage = function (a, b) {
    window.localStorage.setItem(a, b);
};
var getStorage = function (a) {
    return window.localStorage.getItem(a);
};
//dialogs
var registerDialogs = function (dialogs) {
    dialogs.forEach(function (d) {
        if(!d.nativeElement.showModal){
            dialogPolyfill.registerDialog(d.nativeElement);
        }
    });
};
var showDialog = function (d) {
    if (d.nativeElement) {
        d.nativeElement.showModal();
    } else {
        d.showModal();
    }
};
var closeDialog = function (d) {
    if (d.nativeElement) {
        d.nativeElement.close();
    } else {
        d.close();
    }
};
var showDialogDelay = function (d) {
    setTimeout(function () { showDialog(d); }, 1500);
};
//user
var isNewUser = function (x) {
    return (vsquare.get(x) == "true") ? true : false;
}
var vUser = {
    ID: 0,
    Name: "",
    LoggedIn: false,
    LogInMethod: "",
    LoggingIn: ""
}
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        vUser.ID = user.uid;
        vUser.Name = user.displayName ? user.displayName : "";
        vUser.LoggedIn = true;
        vUser.LogInMethod = vsquare.get('loginMethod');
        vUser.LoggingIn = vsquare.get('loggingIn') == "true" ? true : false;
    } else {
        vUser.LoggedIn = false;
    }
});
var signOut = function () {
    firebase.auth().signOut().then(function () {
        console.log("signOutSuccess");
    }, function (error) {
        console.log(error);
    });
}
var signIn = function(e, p){
    firebase.auth().signInWithEmailAndPassword(e, p).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
}
var register = function(e, p){
    firebase.auth().createUserWithEmailAndPassword(e, p).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
}
var reset = function(e){
    var auth = firebase.auth();
     auth.sendPasswordResetEmail(e).then(function () {
      alert("Email Sent");
    }, function (error) {
      alert("Error");
    });
}
//database
//account
var getAccount = function () {
    var account = null;
    database.ref('account/' + vsquare.user.ID).on('value', function (snapshot) {
        account = snapshot.val();
    });
    return account;
};
var saveAccount = function (data) {
    if (vsquare.user.LoggedIn) {
        database.ref("account/" + vsquare.user.ID + "/").set(data);
    }
};
var deleteData = function () {
    if (vsquare.user.LoggedIn) {
        database.ref("data/" + vsquare.user.ID).remove();
    }
};
var updateEmail = function (e) {
    var response = false;
    if (vsquare.user.LoggedIn) {
        var user = firebase.auth().currentUser;
        user.updateEmail(e).then(function () {
            response = true;
        },
            function (error) { response = false; }
        );
    }
    return response;
};
var updatePassword = function (p) {
    var response = false;
    if (vsquare.user.LoggedIn) {
        var user = firebase.auth().currentUser;
        user.updatePassword(p).then(function () {
            response = true;
        },
            function (error) { response = false; }
        );
    }
    return response;
};
var reAuth = function (p) {
    var response = false;
    var user = firebase.auth().currentUser;
    var credential = firebase.auth.EmailAuthProvider.credential(user.email, me.loginPassword);
    user.reauthenticate(credential).then(function () {
        response = true;
    }, function (error) { response = false; }
    );
    return response;
};
//data
var timeCheck = function (lastData) {
    var response = false;
    var d = new Date();
    var date = d.getTime();
    if (lastData && (+lastData > 1)) {
        var lastDate = new Date(lastData);
        if ((d.getDate() != lastDate.getDate()) || (d.getMonth() != lastDate.getMonth()) || (d.getFullYear() != lastDate.getFullYear())) {
            response = date;
        }
    } else {
        response = date;
    }
    return response;
};
var saveData = function (date, settingsOrganized) {
    var response = false;
    var data = {
        "time": date
    };
    settingsOrganized.forEach(function (x) {
        x.forEach(function (a) {
            data[a.measurement] = a.value;
        });
    });
    database.ref("data/" + vsquare.user.ID + "/").push({ "data": data });
    return response;
};
var getData = function () {
    var response = false;
    database.ref('data/' + vsquare.user.ID).limitToLast(1).on('value', function (snapshot) {
        response = snapshot.val();
    });
    return response;
}
var getAllData = function () {
    var response = false;
    database.ref('data/' + vsquare.user.ID).on('value', function (snapshot) {
        response = snapshot.val();
    });
    return response
}
var organizeData = function (data, settingsSelected) {
    var organizedData = [];
    var day = 1;
    var count = 0;
    for (var d in data) {
        for (var x in data[d].data) {
            if (x != "time" && settingsSelected[x.toLowerCase()]) {
                count = 0;
                organizedData.push({
                    Measurement: x,
                    Day: (new Date(data[d].data.time)),
                    Mili: data[d].data.time,
                    Value: data[d].data[x]
                });
                count++;
            }
        }
        day++;
    }
    return [organizedData, count];
}
var organizeDataX = function (data, settingsSelected) {
    var organizedData = [];
    for (var d in data) {
        data[d].data.time = (new Date(data[d].data.time)).toLocaleDateString();
        data[d].data.measurements = [];
        for (var x in data[d].data) {
            if (x != "time" && settingsSelected[x.toLowerCase()]) {
                data[d].data.measurements.push({
                    name: x,
                    value: data[d].data[x]
                });
            }
        }
        organizedData.push(data[d].data);
    }
    return organizedData;
}
var organizeDataGraph = function (data, settingsSelected, firstMili) {
    var newData = [];
    var dataNumbers = [];
    var dataForTime = [];
    for (var d in data) {
        if (firstMili > data[d].data.time || firstMili == 0) {
            firstMili = data[d].data.time;
        }
        dataForTime.push(data[d].data);
        for (var x in data[d].data) {
            if (x != "time" && settingsSelected[x.toLowerCase()]) {
                if (settingsSelected[x.toLowerCase()].valueType == "range") {
                    newData.push({
                        Measurement: x,
                        Day: (new Date(data[d].data.time)),
                        Mili: data[d].data.time,
                        Value: data[d].data[x]
                    })
                } else {
                    dataNumbers.push({
                        Measurement: x,
                        Day: (new Date(data[d].data.time)),
                        Mili: data[d].data.time,
                        Value: data[d].data[x]
                    })
                }
            }
        }
    }
    return [ newData, dataNumbers, dataForTime, firstMili ];
}
var calculateAvg = function (data, settingsSelected) {
    var measurementsAvg = [];
    var measGroup = {};
    data.forEach(function (x) {
        measGroup[x.Measurement] ? false : measGroup[x.Measurement] = [];
        measGroup[x.Measurement].push(x.Value);
    });
    for (var m in measGroup) {
        var total = 0;
        var mesArray = [];
        measGroup[m].forEach(function (x) {
            total += +x;
            mesArray.push(+x);
        })
        var highest = Math.max.apply(Math, mesArray);
        var lowest = Math.min.apply(Math, mesArray);
        var val = 565 - ((565 - 180) * ((total / measGroup[m].length) * .01));
        measurementsAvg.push({
            name: m,
            value: val,
            valueV: (total / measGroup[m].length).toFixed(0),
            isRange: settingsSelected[m.toLowerCase()].valueType == "number" ? false : true,
            height: (+(total / measGroup[m].length).toFixed(0) / +settingsSelected[m.toLowerCase()].max) * 100,
            avg: +(total / measGroup[m].length).toFixed(0),
            low: lowest,
            high: highest,
            x: ""
        })
    }
    return measurementsAvg;
}
//settings
var getSettings = function () {
    var response = false;
    database.ref('settings/' + vsquare.user.ID).on('value', function (snapshot) {
        response = snapshot.val();
    });
    return response;
};
var saveSettings = function(d){
 database.ref("settings/" + vsquare.user.ID + "/").set(d);
};
var organizeSettings = function (settings) {
    var settingsOrganized = [];
    var settings = settings.settings || [];
    settings.forEach(function (x) {
        var yes = false;
        var selectedArray = [];
        x.forEach(function (a) {
            a.selected ? (yes = true, selectedArray.push(a)) : false;
        });
        yes ? settingsOrganized.push(selectedArray) : false;
    });
    return settingsOrganized;
};
var organizeSettingsX = function (settings, settingsSelected) {
    var settingsOrganized = [];
    var settings = settings.settings || [];
    settings.forEach(function (x) {
        var selectedArray = false;
        x.forEach(function (a) {
            var selected = false;
            a.selected ? selected = true : false;
            selected ? settingsSelected[a.measurement.toLowerCase()] = a : false;
        });
        selectedArray ? settingsOrganized.push(x) : false;
    });
    return [settingsOrganized, settingsSelected];
}
//etc
var feedback = function (d) {
    database.ref("feedback/").push(d);
}
var vsquare = {
    registerDialogs: registerDialogs,
    show: showDialog,
    close: closeDialog,
    showDelay: showDialogDelay,
    //users
    user: vUser,
    isNew: isNewUser,
    signOut: signOut,
    signIn: signIn,
    register: register,
    reset: reset,
    //database
    //account
    getAccount: getAccount,
    saveAccount: saveAccount,
    updateEmail: updateEmail,
    updatePassword: updatePassword,
    reAuth: reAuth,
    //data
    timeCheck: timeCheck,
    saveData: saveData,
    getData: getData,
    getAllData: getAllData,
    calculateAvg: calculateAvg,
    organizeData: organizeData,
    organizeDataX: organizeDataX,
    organizeDataGraph: organizeDataGraph,
    //settings
    getSettings: getSettings,
    saveSettings: saveSettings,
    organizeSettings: organizeSettings,
    organizeSettingsX: organizeSettingsX,
    //etc
    feedback: feedback,
    //dom
    get: getStorage,
    set: setStorage,
    upgrade: upgrade,
    upgradeDelay: function () { setTimeout(function () { upgrade(); }, 500) },
};