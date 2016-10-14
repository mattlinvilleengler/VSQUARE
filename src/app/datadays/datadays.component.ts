import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataCardComponent } from '../datacard/datacard.component';
declare var vsquare: any;

@Component({
  moduleId: module.id,
  selector: 'my-datadays',
  templateUrl: 'datadays.component.html',
  directives: [DataCardComponent]

})
export class DataDaysComponent implements AfterViewInit, OnInit {
  loggedIn: boolean = false;
  data: any = [];
  settingsOrganized: any[] = [];
  settingsSelected: any[] = [];

  ngAfterViewInit(): any {
    vsquare.upgrade();
    this.loggedIn = vsquare.user.LoggedIn;
    this.getSettings();
    this.getData();
  }
  ngOnInit(): any {
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
    this.data = vsquare.organizeDataX(data, this.settingsSelected)
    this.data.reverse();
  }
}
