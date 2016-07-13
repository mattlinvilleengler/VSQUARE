import { Component, OnInit, AfterViewInit, Input, ViewChild } from '@angular/core';
declare var componentHandler: any;
declare var firebase: any;

@Component({
  moduleId: module.id,
  selector: 'my-landing',
  templateUrl: 'landing.component.html'
})
export class LandingComponent implements AfterViewInit {
    provider = new firebase.auth.GoogleAuthProvider();
    email: string;
    password: string;
    emailRegister: string;
    passwordRegister: string;

  @ViewChild('loginDialog') loginDialog: any;
  @ViewChild('registerDialog') registerDialog: any;
  

signInRe(){
  window.localStorage.setItem('loginMethod','current');
  window.localStorage.setItem('loggingIn','true');
  this.closeLoginDialog();
  firebase.auth().signInWithRedirect(this.provider);
}
 ngAfterViewInit():any {
     var me = this;
   componentHandler.upgradeDom();
firebase.auth().getRedirectResult().then(function(result:any) {
  if (result.credential) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // ...
  }
  // The signed-in user info.
  var user = result.user;
  
}).catch(function(error:any) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
});
}
signInFitSocial(){
  window.localStorage.setItem('loginMethod','current');
  window.localStorage.setItem('loggingIn','true');
  this.closeLoginDialog();
  firebase.auth().signInWithEmailAndPassword(this.email, this.password).catch(function(error: any) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});
}
    register(){
        window.localStorage.setItem('loginMethod','new');
        window.localStorage.setItem('loggingIn','true');
        this.closeRegisterDialog();
firebase.auth().createUserWithEmailAndPassword(this.emailRegister, this.passwordRegister).catch(function(error:any) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});
    }
    registerGoogle(){
        window.localStorage.setItem('loginMethod','new');
        window.localStorage.setItem('loggingIn','true');
        this.closeRegisterDialog();
firebase.auth().signInWithRedirect(this.provider).then(function(result:any) {
  // This gives you a Google Access Token. You can use it to access the Google API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;
  // ...
}).catch(function(error:any) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
});
    }

        closeRegisterDialog(){
          this.registerDialog.nativeElement.close();
        }
         closeLoginDialog(){
          this.loginDialog.nativeElement.close();
        }
         openRegister(){
        this.registerDialog.nativeElement.showModal();
        }
         openLogin(){
        this.loginDialog.nativeElement.showModal();
        }
}