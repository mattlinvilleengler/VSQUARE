import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { DataVisualizationComponent } from '../datavisualization/datavisualization.component';
import { SingleVisualizationComponent } from '../singlevisualization/singlevisualization.component';
import { DataDaysComponent } from '../datadays/datadays.component';
declare var vsquare: any;

@Component({
  moduleId: module.id,
  selector: 'my-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css'],
  directives: [DataVisualizationComponent, DataDaysComponent, SingleVisualizationComponent]
})
export class DashboardComponent implements AfterViewInit {
  newUser: boolean = false;
  data: any[] = [];
  group: any[] = [];
  measurementsAvg: any[] = [];
  settingsOrganized: any[] = [];
  settingsSelected: any = {};
  one: boolean = true;
  two: boolean = false;
  three: boolean = false;
  loggedIn: boolean = false;
  vsquare: any = vsquare;

  @ViewChild('newDialog') newDialog: any;
  @ViewChild('noData') noData: any;
  @ViewChild('twoRef') twoRef: any;

  ngAfterViewInit(): any {
    this.newUser = vsquare.isNew('newDashboard') ? true : false;
    this.newUser ? vsquare.showDelay(this.newDialog) : false;
    vsquare.upgrade();
    var dialogs = [this.newDialog, this.noData, this.newDialog]
    vsquare.registerDialogs(dialogs);
  }
  closeNewDialog() {
    vsquare.close(this.newDialog);
    vsquare.set('newDashboard', "false");
  }
  ngOnInit() {
    this.loggedIn = vsquare.user.LoggedIn;
    this.getSettings();
    this.getData();
  }
  getSettings() {
    var response = vsquare.getSettings();
    this.updateSettings(response);
  }
  updateSettings(settings: any) {
    var response = vsquare.organizeSettingsX(settings, this.settingsSelected);
    this.settingsOrganized = response[0];
    this.settingsSelected = response[1];
    vsquare.upgradeDelay();
  }
  getData() {
    var response = vsquare.getAllData();
    this.updateData(response);
  }
  updateData(data: any) {
    if (data) {
      var response = vsquare.organizeData(data, this.settingsSelected);
      this.data = response[0]
      !this.newUser && this.data.length <= response[1] ? vsquare.showDelay(this.noData) : false;
      this.calculateAvg();
    }
    else {
      !this.newUser ? vsquare.showDelay(this.noData) : false;
    }
  }
  calculateAvg() {
    this.measurementsAvg = vsquare.calculateAvg(this.data, this.settingsSelected);
  }
  average() {
    var me = this;
    var avg = this.measurementsAvg;
    this.measurementsAvg = [];
    setTimeout(function () { me.measurementsAvg = avg }, 250);
    this.two = true;
    this.twoRef.nativeElement.click();
  }
}
