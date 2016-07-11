import { Component, Inject, ElementRef, OnInit, Injectable, AfterViewInit } from '@angular/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { DashboardComponent }  from '../dashboard/dashboard.component';
import { SettingsComponent }     from '../settings/settings.component';
import { DataVisualizationComponent }     from '../datavisualization/datavisualization.component';
import { LoginComponent }     from '../login/login.component';
import { RegisterComponent }     from '../register/register.component';
import { AddDataComponent }     from '../adddata/adddata.component';
import { AccountComponent }     from '../account/account.component';
import { ProfileComponent }     from '../profile/profile.component';

declare var database: any;
declare var componentHandler: any;
declare var firebase: any;

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [ROUTER_DIRECTIVES, LoginComponent, RegisterComponent ],
  providers: [
    ROUTER_PROVIDERS
  ]
})
@RouteConfig([
  { path: '/dashboard',  name: 'Dashboard',  component: DashboardComponent, useAsDefault: true },
  { path: '/settings',     name: 'Settings',     component: SettingsComponent },
  //{ path: '/datavisualization',     name: 'DataVisualization',     component: DataVisualizationComponent },
  { path: '/login',     name: 'Login',     component: LoginComponent },
  { path: '/signup',     name: 'Register',     component: RegisterComponent },
  { path: '/adddata',     name: 'AddData',     component: AddDataComponent },
  { path: '/account',     name: 'Account',     component: AccountComponent }
  //{ path: '/profile',     name: 'Profile',     component: ProfileComponent }
  
  
  
])
export class AppComponent implements AfterViewInit {
  loggedIn: boolean = false;
  login: boolean = false;
  signUp: boolean = false;
  displayName: string;
  userID: number;


    ngAfterViewInit():any {
      var me = this;
    componentHandler.upgradeDom();
     firebase.auth().onAuthStateChanged(function(user:any) {
  if (user) {
    me.loggedIn = true;
    console.log(user);
    me.userID = user.uid;
    me.displayName = user.displayName;
    me.getAccount();
  } else {
    me.loggedIn = false;
  }
});
  }
  signOut(){
  firebase.auth().signOut().then(function() {
  // Sign-out successful.
  //alert("successfuly signed out");
}, function(error:any) {
  // An error happened.
});
  }
    getAccount(){
  var me = this;
  database.ref('account/' + this.userID ).on('value', function(snapshot:any) {
  me.updateAccount(snapshot.val());
  });
  }
  updateAccount(account:any){
    if(account){
  this.displayName = account.fullName ? account.fullName : "";
    }
  }
  
}
