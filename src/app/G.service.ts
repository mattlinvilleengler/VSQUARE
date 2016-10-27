import { Injectable } from '@angular/core';
declare var database: any;
declare var firebase: any;
declare var componentHandler: any;
declare var dialogPolyfill: any;

@Injectable()
export class G {
    //dom
    upgrade() {
        componentHandler.upgradeDom();
    }
    upgradeDelay() {
        var me = this;
        setTimeout(function () { me.upgrade(); }, 500)
    };
    //storage
    set(a, b) {
        window.localStorage.setItem(a, b);
    };
    get(a) {
        return window.localStorage.getItem(a);
    };
    //dialogs
    registerDialogs(dialogs) {
        dialogs.forEach(function (d) {
            if (!d.nativeElement.showModal) {
                dialogPolyfill.registerDialog(d.nativeElement);
            }
        });
    };
    show(d) {
        if (d.nativeElement) {
            d.nativeElement.showModal();
        } else {
            d.showModal();
        }
    };
    close(d) {
        if (d.nativeElement) {
            d.nativeElement.close();
        } else {
            d.close();
        }
    };
    showDelay(d) {
        var me = this;
        setTimeout(function () { me.show(d); }, 1500);
    };
    //user
    isNew(x) {
        return (this.get(x) == "true") ? true : false;
    }
    user: any = {
        ID: 0,
        Name: "",
        LoggedIn: false,
        LogInMethod: "",
        LoggingIn: false
    };
    ini() {
        var me = this;
        firebase.auth().onAuthStateChanged(function (user: any) {
            if (user) {
                me.user.ID = user.uid;
                me.user.Name = user.displayName ? user.displayName : "";
                me.user.LoggedIn = true;
                me.user.LogInMethod = me.get('loginMethod');
                me.user.LoggingIn = me.get('loggingIn') == "true" ? true : false;
            } else {
                me.user.LoggedIn = false;
            }
        });
    }
    signOut() {
        firebase.auth().signOut().then(function () {
            console.log("signOutSuccess");
        }, function (error) {
            console.log(error);
        });
    }
    signIn(e, p) {
        firebase.auth().signInWithEmailAndPassword(e, p).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
        });
    }
    register(e, p) {
        firebase.auth().createUserWithEmailAndPassword(e, p).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
        });
    }
    reset(e) {
        var auth = firebase.auth();
        auth.sendPasswordResetEmail(e).then(function () {
            alert("Email Sent");
        }, function (error) {
            alert("Error");
        });
    }
    //database
    //account
    getAccount() {
        var account = null;
        var me = this;
        database.ref('account/' + me.user.ID).on('value', function (snapshot) {
            account = snapshot.val();
        });
        return account;
    };
    saveAccount(data) {
        var me = this;
        if (this.user.LoggedIn) {
            database.ref("account/" + me.user.ID + "/").set(data);
        }
    };
    deleteData() {
        var me = this;
        if (this.user.LoggedIn) {
            database.ref("data/" + me.user.ID).remove();
        }
    };
    updateEmail(e) {
        var response = false;
        if (this.user.LoggedIn) {
            var user = firebase.auth().currentUser;
            user.updateEmail(e).then(function () {
                response = true;
            },
                function (error) { response = false; }
            );
        }
        return response;
    };
    updatePassword(p) {
        var response = false;
        if (this.user.LoggedIn) {
            var user = firebase.auth().currentUser;
            user.updatePassword(p).then(function () {
                response = true;
            },
                function (error) { response = false; }
            );
        }
        return response;
    };
    reAuth(p) {
        var response = false;
        var user = firebase.auth().currentUser;
        var credential = firebase.auth.EmailAuthProvider.credential(user.email, p);
        user.reauthenticate(credential).then(function () {
            response = true;
        }, function (error) { response = false; }
        );
        return response;
    };
    //data
    timeCheck(lastData) {
        var response: any = false;
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
    createData(settingsOrganized) {
        var me = this;
        database.ref("data/" + me.user.ID).remove();
        var time = 86400000 * 100;
        for (var i = 0; i < 100; i++) {
            settingsOrganized.forEach(function (x) {
                x.forEach(function (a) {
                    if (a.valueType == "range") {
                        a.value = Math.floor(Math.random() * a.max);
                    } else {
                        a.value = Math.floor(Math.random() * a.max);
                    }
                });
            });
            var d = new Date();
            var date = d.getTime();
            date = date - time;
            this.saveData(date, settingsOrganized);
            time -= 86400000;
        }
    }
    saveData(date, settingsOrganized) {
        var response = false;
        var me = this;
        var data = {
            "time": date
        };
        settingsOrganized.forEach(function (x) {
            x.forEach(function (a) {
                data[a.measurement] = a.value;
            });
        });
        database.ref("data/" + me.user.ID + "/").push({ "data": data });
        return response;
    };
    getData() {
        var response = false;
        var me = this;
        database.ref('data/' + me.user.ID).limitToLast(1).on('value', function (snapshot) {
            response = snapshot.val();
        });
        return response;
    }
    getAllData() {
        var response = false;
        var me = this;
        database.ref('data/' + me.user.ID).on('value', function (snapshot) {
            response = snapshot.val();
        });
        return response
    }
    organizeData(data, settingsSelected) {
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
    organizeDataX(data, settingsSelected) {
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
    organizeDataGraph(data, settingsSelected, firstMili) {
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
        return [newData, dataNumbers, dataForTime, firstMili];
    }
    calculateAvg(data, settingsSelected) {
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
    getSettings() {
        var response = false;
        var me = this;
        database.ref('settings/' + me.user.ID).on('value', function (snapshot) {
            response = snapshot.val();
        });
        return response;
    };
    saveSettings(d) {
        var me = this;
        database.ref("settings/" + me.user.ID + "/").set(d);
    };
    organizeSettings(settings) {
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
    organizeSettingsX(settings, settingsSelected) {
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
    feedback(d) {
        database.ref("feedback/").push(d);
    }
    G = {
        registerDialogs: this.registerDialogs,
        show: this.show,
        close: this.close,
        showDelay: this.showDelay,
        //users
        user: this.user,
        isNew: this.isNew,
        signOut: this.signOut,
        signIn: this.signIn,
        register: this.register,
        reset: this.reset,
        ini: this.ini(),
        //database
        //account
        getAccount: this.getAccount,
        saveAccount: this.saveAccount,
        updateEmail: this.updateEmail,
        updatePassword: this.updatePassword,
        reAuth: this.reAuth,
        //data
        timeCheck: this.timeCheck,
        createData: this.createData,
        saveData: this.saveData,
        getData: this.getData,
        deleteData: this.deleteData,
        getAllData: this.getAllData,
        calculateAvg: this.calculateAvg,
        organizeData: this.organizeData,
        organizeDataX: this.organizeDataX,
        organizeDataGraph: this.organizeDataGraph,
        //settings
        getSettings: this.getSettings,
        saveSettings: this.saveSettings,
        organizeSettings: this.organizeSettings,
        organizeSettingsX: this.organizeSettingsX,
        //etc
        feedback: this.feedback,
        //dom
        get: this.get,
        set: this.set,
        upgrade: this.upgrade,
        upgradeDelay: this.upgradeDelay
    };
}
