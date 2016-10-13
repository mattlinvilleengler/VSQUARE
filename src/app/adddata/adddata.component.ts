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
  one: boolean = true;
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
    var me = this;
    database.ref('settings/' + this.userID).on('value', function (snapshot: any) {
      me.updateSettings(snapshot.val());
    });
  }
  updateSettings(settings: any) {
    if (settings) {
      var me = this;
      me.settingsOrganized = [];
      var settings = settings.settings ? settings.settings : [];
      settings.forEach(function (x) {
        var yes = false;
        var selectedArray = [];
        x.forEach(function (a) {
          a.selected ? (yes = true, selectedArray.push(a)) : false;
        });
        yes ? me.settingsOrganized.push(selectedArray) : false;
      });
    }
    vsquare.upgradeDelay();
  }
  saveData() {
    if (this.loggedIn) {
      var d = new Date();
      var date = d.getTime();
      if (this.lastData && (+this.lastData > 1)) {
        var lastDate: any = new Date(this.lastData);
        if ((d.getDate() != lastDate.getDate()) || (d.getMonth() != lastDate.getMonth()) || (d.getFullYear() != lastDate.getFullYear())) {
          this.saveD(date);
        } else {
          this.dialog.nativeElement.showModal();
        }
      } else {
        this.saveD(date);
      }
    }
  }
  saveD(date, flag?) {
    var data = {
      "time": date
    };
    this.settingsOrganized.forEach(function (x) {
      x.forEach(function (a) {
        data[a.measurement] = a.value;
      });
    });
    database.ref("data/" + this.userID + "/").push({ "data": data });
    flag ? false : this.successDialog.nativeElement.showModal();
  }
  getData() {
    var me = this;
    database.ref('data/' + this.userID).limitToLast(1).on('value', function (snapshot: any) {
      me.updateData(snapshot.val());
    });
  }
  updateData(data: any) {
    if (data) {
      for (var d in data) {
        this.lastData = data[d].data.time ? data[d].data.time : false;
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
  dashboardFake() {
    vsquare.close(this.newDialog);
    this.fakeDialogSuccess.nativeElement.close();
    window.location.pathname = "my-app/dashboard";
  }
  closeNewDialog() {
    vsquare.close(this.newDialog);
    vsquare.set('newAddData', "false");
    vsquare.set('newDashboard', "true");
    window.location.pathname = "my-app/dashboard";
  }
}
