//dom
var upgrade = function(){
    componentHandler.upgradeDom();
}
//dialogs
var registerDialogs = function (dialogs) {
    dialogs.forEach(function (d) {
        dialogPolyfill.registerDialog(d.nativeElement);
    });
};
var showDialog = function (d) {
    if(d.nativeElement){
        d.nativeElement.showModal();
    } else{
        d.showModal();
    }
};
var closeDialog = function (d) {
    if(d.nativeElement){
        d.nativeElement.close();
    } else{
        d.close();
    }
};
var showDialogDelay = function (d) {
    setTimeout(function () { showDialog(d); }, 1500);
};
//user
var isNewUser = function (x) {
    return (window.localStorage.getItem(x) == "true") ? true : false;
}
var vUser = {
    ID: 0,
    Name: "",
    LoggedIn: false,
}
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        vUser.ID = user.uid;
        vUser.Name = user.displayName ? user.displayName : "";
        vUser.LoggedIn = true;
    } else {
        vUser.LoggedIn = false;
    }
});
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
}
//storage
var setStorage = function(a,b){
    window.localStorage.setItem(a, b);
};
var vsquare = {
    registerDialogs: registerDialogs,
    show: showDialog,
    close: closeDialog,
    showDelay: showDialogDelay,
    //users
    user: vUser,
    isNew: isNewUser,
    //database
    //account
    getAccount: getAccount,
    saveAccount: saveAccount,
    updateEmail: updateEmail,
    updatePassword: updatePassword,
    reAuth: reAuth,
    //dom
    set: setStorage,
    upgrade: upgrade,
    upgradeDelay: function(){ setTimeout(function () { upgrade(); }, 500)},
};