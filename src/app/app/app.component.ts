import { Component, Inject, ElementRef, OnInit, Injectable, AfterViewInit, ViewChild } from '@angular/core';
import { Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { SettingsComponent } from '../settings/settings.component';
import { DataVisualizationComponent } from '../datavisualization/datavisualization.component';
import { AddDataComponent } from '../adddata/adddata.component';
import { AccountComponent } from '../account/account.component';
import { ProfileComponent } from '../profile/profile.component';
import { LandingComponent } from '../landing/landing.component';
import { G } from '../G.service';
declare var firebase: any;

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [ROUTER_DIRECTIVES, LandingComponent],
  providers: [ ROUTER_PROVIDERS, G ]
})
@RouteConfig([
  { path: '/dashboard', name: 'Dashboard', component: DashboardComponent, useAsDefault: true },
  { path: '/settings', name: 'Settings', component: SettingsComponent },
  { path: '/adddata', name: 'AddData', component: AddDataComponent },
  { path: '/account', name: 'Account', component: AccountComponent }
])
export class AppComponent implements AfterViewInit, OnInit {
  G:G = new G;
  loggedIn: boolean = false;
  login: boolean = false;
  signUp: boolean = false;
  displayName: string;
  userID: number;
  loginMethod: string = "current";
  newUser: boolean = false;
  loggingIn: boolean = false;
  router: any = Router;
  errorsOpen: boolean = true;
  url: string = "";
  feedbackSuccess: boolean = false;
  feedbackName: string = "";
  feedbackEmail: string = "";
  feedbackMessage: string = "";
  bc: string = "#444";
  fan:string = "";
  successMessage: string = " ";

  @ViewChild('refresh') refresh: any;
  @ViewChild('successDialog') successDialog: any;
  @ViewChild('account') account: any;
  @ViewChild('dashboard') dashboard: any;
  @ViewChild('hiddenLink') hiddenLink: any;
  @ViewChild('submitErrorDialog') submitErrorDialog: any;

ngOnInit(){
  var me = this;
  firebase.auth().onAuthStateChanged(function (user) {
    me.manageUser();
  });
}
  ngAfterViewInit(): any {
    var me = this;
    this.color();
    this.url = window.location.href;
    this.G.G.upgrade();
    this.errorsOpen = this.G.G.get('errorsOpen') == "true" ? true : false;
    var dialogs = [this.submitErrorDialog, this.successDialog];
    this.G.G.registerDialogs(dialogs);
    this.manageUser();
    this.refresh.nativeElement.onmouseover = function () { };
    setInterval(function () { me.refreshPage() }, 200)
  }
  manageUser() {
    this.loginMethod = this.G.G.user.LogInMethod;
    this.loggingIn = this.G.G.user.LoggingIn;
    this.newUser = this.loginMethod == "new" ? true : false;
    this.successMessage = this.newUser ? "Account Successfully Created. " :
      "Successfully signed in as " + this.G.G.user.Name;
    this.successMessage += this.newUser ? "Now let's get started." : "";
    this.loggingIn ? this.G.G.show(this.successDialog) : false;
    this.loggedIn = this.G.G.user.LoggedIn;
   // this.loggedIn = true;
    this.displayName = this.G.G.user.Name;
    this.getAccount();
   // this.G.G.upgrade();
  }
  color() {
    var me = this;
    var colors = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
    setInterval(function () {
      me.bc = colors[Math.floor(Math.random() * (colors.length - 1))];
    }, 5000)
  }
  signOut() {
    this.hiddenLink.nativeElement.click();
    this.G.G.signOut();
    this.loggedIn = false;
  }
  getAccount() {
    var account = this.G.G.getAccount();
    this.updateAccount(account);
  }
  updateAccount(account: any) {
    if (account) {
      this.displayName = account.fullName || "";
    }
  }
  refreshPage() {
    this.refresh.nativeElement.onmouseover();
  }
  closeSuccess() {
    this.G.G.set('loginMethod', "current");
    this.G.G.set('loggingIn', "false");
    this.G.G.close(this.successDialog);
    this.loggedIn = true;
  }
  closeSuccessNewUser() {
    this.closeSuccess();
    this.G.G.set('newAccount', "true");
    window.location.pathname = "my-app/account";
  }
  dismiss() {
    this.G.G.set('errorsOpen', 'false');
  }
  addFeedback() {
    var me = this;
    var data = {"name": this.feedbackName, "email": this.feedbackEmail, "message": this.feedbackMessage}
    var response = this.G.G.feedback(data);
    this.feedbackSuccess = true;
    setTimeout(function () { this.G.G.close(me.submitErrorDialog); me.feedbackSuccess = false; }, 2250);
    this.feedbackName = "";
    this.feedbackEmail = "";
    this.feedbackMessage = "";
  }
}
