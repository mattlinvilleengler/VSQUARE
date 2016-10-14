import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
declare var vsquare: any;

@Component({
  moduleId: module.id,
  selector: 'my-adddata',
  templateUrl: 'adddata.component.html',
})

export class AddDataComponent implements AfterViewInit, OnInit {
  lastData: number;
  document: any = document;
  settingsOrganized: any = [];
  newUser: boolean = false;
  vsquare: any = vsquare;

  @ViewChild('errorDialog') dialog: any;
  @ViewChild('successDialog') successDialog: any;
  @ViewChild('newDialog') newDialog: any;

  ngAfterViewInit(): any {
    vsquare.upgrade();
    var dialogs = [this.dialog, this.newDialog, this.successDialog]
    vsquare.registerDialogs(dialogs);
    this.document = document;
    this.getSettings();
    this.newUser = vsquare.isNew("newAddData");
    this.newUser ? vsquare.showDelay(this.newDialog) : this.getData();
  }
  ngOnInit(): any {
  }
  getSettings() {
    var response = vsquare.getSettings();
    if (response) {
      this.settingsOrganized = vsquare.organizeSettings(response);
    }
    vsquare.upgradeDelay();
  }
  saveData() {
    var response = vsquare.timeCheck(this.lastData);
    response ? this.saveD(response) : vsquare.show(this.dialog);
  }
  saveD(date, flag?) {
    var response = vsquare.saveData(date, this.settingsOrganized)
    flag ? false : vsquare.show( this.successDialog);
  }
  getData() {
    var response = vsquare.getData();
    if (response) {
      for (var d in response) {
        this.lastData = response[d].data.time ? response[d].data.time : false;
      }
    }
  }
  dashboard() {
    vsquare.close(this.dialog);
    window.location.pathname = "my-app/dashboard";
  }
  dashboardSuccess() {
    vsquare.close(this.successDialog);
    window.location.pathname = "my-app/dashboard";
  }
  closeNewDialog() {
    vsquare.close(this.newDialog);
    vsquare.set('newAddData', "false");
    vsquare.set('newDashboard', "true");
    window.location.pathname = "my-app/dashboard";
  }
}
