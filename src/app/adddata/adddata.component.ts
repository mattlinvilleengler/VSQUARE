import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { G } from '../G.service'; 
declare var firebase: any;


@Component({
  moduleId: module.id,
  selector: 'my-adddata',
  templateUrl: 'adddata.component.html',
  providers: [ G ]
})

export class AddDataComponent implements AfterViewInit, OnInit {
  lastData: number;
  document: any = document;
  settingsOrganized: any = [];
  newUser: boolean = false;
  G:G = new G;

  @ViewChild('errorDialog') dialog: any;
  @ViewChild('successDialog') successDialog: any;
  @ViewChild('newDialog') newDialog: any;

  ngAfterViewInit(): any {
    this.G.G.upgrade();
    var dialogs = [this.dialog, this.newDialog, this.successDialog]
    this.G.G.registerDialogs(dialogs);
    this.document = document;
  }
  ngOnInit(): any {
      var me = this;
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        me.manageUser();
      }
    });
  }
  manageUser(){
this.getSettings();
    this.newUser = this.G.G.isNew("newAddData");
    this.newUser ? this.G.G.showDelay(this.newDialog) : this.getData();
  }
  getSettings() {
    var response = this.G.G.getSettings();
    if (response) {
      this.settingsOrganized = this.G.G.organizeSettings(response);
    }
    this.G.G.upgradeDelay();
  }
  saveData() {
    var response = this.G.G.timeCheck(this.lastData);
    response ? this.saveD(response) : this.G.G.show(this.dialog);
  }
  saveD(date, flag?) {
    var response = this.G.G.saveData(date, this.settingsOrganized)
    flag ? false : this.G.G.show( this.successDialog);
  }
  getData() {
    var response: any = this.G.G.getData();
    if (response) {
      for (var d in response) {
        this.lastData = response[d].data.time ? response[d].data.time : false;
      }
    }
  }
  dashboard() {
    this.G.G.close(this.dialog);
    window.location.pathname = "my-app/dashboard";
  }
  dashboardSuccess() {
    this.G.G.close(this.successDialog);
    window.location.pathname = "my-app/dashboard";
  }
  closeNewDialog() {
    this.G.G.close(this.newDialog);
    this.G.G.set('newAddData', "false");
    this.G.G.set('newDashboard', "true");
    window.location.pathname = "my-app/dashboard";
  }
}
