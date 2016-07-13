import { Component, OnInit, AfterViewInit, Input, ViewChild } from '@angular/core';
declare var componentHandler: any;
declare var database: any;
declare var firebase: any;

@Component({
  moduleId: module.id,
  selector: 'my-settings',
  templateUrl: 'settings.component.html',
  styleUrls: ['settings.component.css']
})
export class SettingsComponent implements AfterViewInit, OnInit {
  finance: boolean = false;
  happiness: boolean = false;
  exercise: boolean = false;
  nutrition: boolean = false;
  sleep: boolean = false;
  alcohol: boolean = false;
  loggedIn: boolean = false;
  userID: number;
  newUser: boolean = false;

  @ViewChild('successDialog') successDialog: any;
  @ViewChild('newDialog') newDialog: any;


  ngAfterViewInit(): any {
    componentHandler.upgradeDom();
  }
  ngOnInit(): any {
    var me = this;
    this.newUser = window.localStorage.getItem('newSettings') == "true" ? true : false;
    firebase.auth().onAuthStateChanged(function (user: any) {
      if (user) {
        me.loggedIn = true;
        me.userID = user.uid;
        me.newUser ? me.openDialog(me.newDialog) : me.getSettings();
      } else {
        me.loggedIn = false;
        //me.settings = new Settings();
      }
    });
  }

  getSettings() {
    var me = this;
    database.ref('settings/' + this.userID).on('value', function (snapshot: any) {
      me.updateSettings(snapshot.val());
    });
  }
  updateSettings(settings: any) {
    if (settings) {
      this.finance = settings.finance;
      this.happiness = settings.happiness;
      this.exercise = settings.exercise;
      this.nutrition = settings.nutrition;
      this.sleep = settings.sleep;
      this.alcohol = settings.alcohol;
    }
  }
  saveSettings() {
    if (this.loggedIn) {
      database.ref("settings/" + this.userID + "/").set(
        {
          "finance": this.finance, "happiness": this.happiness,
          "exercise": this.exercise, "nutrition": this.nutrition, "sleep": this.sleep, "alcohol": this.alcohol
        }
      );
      this.successDialog.nativeElement.showModal();
    }
  }
  closeSuccessDialog() {
    this.successDialog.nativeElement.close();
  }
  dashboardSuccess() {
    this.successDialog.nativeElement.close();
    window.location.pathname = "dashboard";
  }
  closeNewDialog() {
    this.newDialog.nativeElement.close();
    window.localStorage.setItem('newSettings', "false");
  }
  closeSuccessDialogNewUser() {
    this.successDialog.nativeElement.close();
    window.location.pathname = "adddata";
    window.localStorage.setItem('newAddData', "true");
  }
  openDialog(d) {
    setTimeout(function () { d.nativeElement.showModal(); }, 1500);
  }
}
