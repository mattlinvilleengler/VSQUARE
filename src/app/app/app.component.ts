import { Component, Inject, ElementRef, OnInit, Injectable, AfterViewInit, ViewChild } from '@angular/core';
import { Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { SettingsComponent } from '../settings/settings.component';
import { DataVisualizationComponent } from '../datavisualization/datavisualization.component';
import { AddDataComponent } from '../adddata/adddata.component';
import { AccountComponent } from '../account/account.component';
import { ProfileComponent } from '../profile/profile.component';
import { LandingComponent } from '../landing/landing.component';
declare var vsquare: any;
declare var firebase: any;

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [ROUTER_DIRECTIVES, LandingComponent],
  providers: [
    ROUTER_PROVIDERS
  ]
})
@RouteConfig([
  { path: '/dashboard', name: 'Dashboard', component: DashboardComponent, useAsDefault: true },
  { path: '/settings', name: 'Settings', component: SettingsComponent },
  { path: '/adddata', name: 'AddData', component: AddDataComponent },
  { path: '/account', name: 'Account', component: AccountComponent }
])
export class AppComponent implements AfterViewInit, OnInit {
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
  vsquare: any = vsquare;
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
    vsquare.upgrade();
    this.errorsOpen = vsquare.get('errorsOpen') == "true" ? true : false;
    var dialogs = [this.submitErrorDialog, this.successDialog];
    vsquare.registerDialogs(dialogs);
    this.manageUser();
    this.refresh.nativeElement.onmouseover = function () { };
    setInterval(function () { me.refreshPage() }, 200)
  }
  manageUser() {
    this.loginMethod = vsquare.user.LogInMethod;
    this.loggingIn = vsquare.user.LoggingIn;
    this.newUser = this.loginMethod == "new" ? true : false;
    this.successMessage = this.newUser ? "Account Successfully Created. " :
      "Successfully signed in as " + vsquare.user.Name;
    this.successMessage += this.newUser ? "Now let's get started." : "";
    this.loggingIn ? vsquare.show(this.successDialog) : this.loggedIn = true;
    this.displayName = vsquare.user.Name;
    this.getAccount();
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
    vsquare.signOut();
    this.loggedIn = false;
  }
  getAccount() {
    var account = vsquare.getAccount();
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
    vsquare.set('loginMethod', "current");
    vsquare.set('loggingIn', "false");
    vsquare.close(this.successDialog);
    this.loggedIn = true;
  }
  closeSuccessNewUser() {
    this.closeSuccess();
    vsquare.set('newAccount', "true");
    window.location.pathname = "my-app/account";
  }
  dismiss() {
    vsquare.set('errorsOpen', 'false');
  }
  addFeedback() {
    var me = this;
    var data = {"name": this.feedbackName, "email": this.feedbackEmail, "message": this.feedbackMessage}
    var response = vsquare.feedback(data);
    this.feedbackSuccess = true;
    setTimeout(function () { vsquare.close(me.submitErrorDialog); me.feedbackSuccess = false; }, 2250);
    this.feedbackName = "";
    this.feedbackEmail = "";
    this.feedbackMessage = "";
  }
}
