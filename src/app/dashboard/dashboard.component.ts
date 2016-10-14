import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { DataVisualizationComponent } from '../datavisualization/datavisualization.component';
import { SingleVisualizationComponent } from '../singlevisualization/singlevisualization.component';
import { DataDaysComponent } from '../datadays/datadays.component';
import { G } from '../G.service'; 

@Component({
  moduleId: module.id,
  selector: 'my-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css'],
  directives: [DataVisualizationComponent, DataDaysComponent, SingleVisualizationComponent],
  providers: [ G ]
})
export class DashboardComponent implements AfterViewInit {
  newUser: boolean = false;
  data: any = [];
  group: any[] = [];
  measurementsAvg: any[] = [];
  settingsOrganized: any[] = [];
  settingsSelected: any = {};
  one: boolean = true;
  two: boolean = false;
  three: boolean = false;
  loggedIn: boolean = false;
  G:G = new G;

  @ViewChild('newDialog') newDialog: any;
  @ViewChild('noData') noData: any;
  @ViewChild('twoRef') twoRef: any;

  ngAfterViewInit(): any {
    this.newUser = this.G.G.isNew('newDashboard') ? true : false;
    this.newUser ? this.G.G.showDelay(this.newDialog) : false;
    this.G.G.upgrade();
    var dialogs = [this.newDialog, this.noData, this.newDialog]
    this.G.G.registerDialogs(dialogs);
  }
  closeNewDialog() {
    this.G.G.close(this.newDialog);
    this.G.G.set('newDashboard', "false");
  }
  ngOnInit() {
    this.loggedIn = this.G.G.user.LoggedIn;
    this.getSettings();
    this.getData();
  }
  getSettings() {
    var response = this.G.G.getSettings();
    this.updateSettings(response);
  }
  updateSettings(settings: any) {
    var response = this.G.G.organizeSettingsX(settings, this.settingsSelected);
    this.settingsOrganized = response[0];
    this.settingsSelected = response[1];
    this.G.G.upgradeDelay();
  }
  getData() {
    var response = this.G.G.getAllData();
    this.updateData(response);
  }
  updateData(data: any) {
    if (data) {
      var response = this.G.G.organizeData(data, this.settingsSelected);
      this.data = response[0];
      !this.newUser && this.data.length <= response[1] ? this.G.G.showDelay(this.noData) : false;
      this.calculateAvg();
    }
    else {
      !this.newUser ? this.G.G.showDelay(this.noData) : false;
    }
  }
  calculateAvg() {
    this.measurementsAvg = this.G.G.calculateAvg(this.data, this.settingsSelected);
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
