import { Component, OnInit, AfterViewInit } from '@angular/core';
declare var componentHandler: any;
declare var firebase: any;
@Component({
  moduleId: module.id,
  selector: 'my-register',
  templateUrl: 'register.component.html'
})
export class RegisterComponent implements AfterViewInit {
    provider = new firebase.auth.GoogleAuthProvider();
    email: string;
    password: string;

    ngAfterViewInit():any {
    componentHandler.upgradeDom();
    }
    register(){
alert(this.email + " " + this.password)
firebase.auth().createUserWithEmailAndPassword(this.email, this.password).catch(function(error:any) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});
    }
    registerGoogle(){
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


}