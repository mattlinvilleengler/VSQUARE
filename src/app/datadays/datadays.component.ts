import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataCardComponent } from '../datacard/datacard.component';
import { G } from '../G.service'; 

@Component({
  moduleId: module.id,
  selector: 'my-datadays',
  templateUrl: 'datadays.component.html',
  directives: [DataCardComponent],
  providers: [ G ]

})
export class DataDaysComponent implements AfterViewInit, OnInit {
  loggedIn: boolean = false;
  data: any = [];
  settingsOrganized: any[] = [];
  settingsSelected: any[] = [];
  G:G = new G;

  ngAfterViewInit(): any {
    this.G.G.upgrade();
    this.loggedIn = this.G.G.user.LoggedIn;
    this.getSettings();
    this.getData();
  }
  ngOnInit(): any {
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
    this.data = this.G.G.organizeDataX(data, this.settingsSelected)
    this.data.reverse();
  }
}
