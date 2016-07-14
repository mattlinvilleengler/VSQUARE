import { Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import { DataVisualizationComponent } from '../datavisualization/datavisualization.component';
import { SingleVisualizationComponent } from '../singlevisualization/singlevisualization.component';
import { DataDaysComponent } from '../datadays/datadays.component';
declare var componentHandler: any;
declare var d3: any;
declare var database: any;
declare var firebase: any;
declare var dialogPolyfill: any;

@Component({
  moduleId: module.id,
  selector: 'my-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css'],
  directives: [DataVisualizationComponent, DataDaysComponent, SingleVisualizationComponent]
})
export class DashboardComponent implements AfterViewInit {
  newUser: boolean = false;
  loggedIn: boolean = false;
  userID: number;

  financeSet: boolean = false;
  happinessSet: boolean = false;
  exerciseSet: boolean = false;
  nutritionSet: boolean = false;
  sleepSet: boolean = false;
  alcoholSet: boolean = false;

  data: any[] = [];
  group: any[] = [];
  measurementsAvg: any[] = [];

  @ViewChild('newDialog') newDialog: any;
  @ViewChild('noData') noData: any;

  ngAfterViewInit(): any {
    this.newUser = window.localStorage.getItem('newDashboard') == "true" ? true : false;
    this.newUser ? this.openDialog(this.newDialog) : false;
    componentHandler.upgradeDom();

     dialogPolyfill.registerDialog(this.noData.nativeElement);    
     dialogPolyfill.registerDialog(this.newDialog.nativeElement);
  }
  gotoDetail() { /* not implemented yet */ }

  closeNewDialog() {
    this.newDialog.nativeElement.close();
    window.localStorage.setItem('newDashboard', "false");
  }
  closeDialog() {
    this.noData.nativeElement.close();
  }
  openDialog(d) {
    setTimeout(function () { d.nativeElement.showModal(); }, 1500);
  }

  ngOnInit() {
    var me = this;
    firebase.auth().onAuthStateChanged(function (user: any) {
      if (user) {
        me.loggedIn = true;
        me.userID = user.uid;
        me.getSettings();
        me.getData();
      } else {
        me.loggedIn = false;
      }
    });
  }
  getSettings() {
    var me = this;
    database.ref('settings/' + this.userID).on('value', function (snapshot: any) {
      me.updateSettings(snapshot.val());
    });
  }
  getData() {
    var me = this;
    database.ref('data/' + this.userID).on('value', function (snapshot: any) {
      me.updateData(snapshot.val());
    });
  }
  updateData(data: any) {
    if (data) {
      this.data = [];
      var day = 1;
      var count = 0;
      for (var d in data) {
        for (var x in data[d]) {
          if (x != "time" && this[x + "Set"]) {
            count = 0;
            this.data.push({
              Measurement: x,
              Day: (new Date(data[d].time)),
              Mili: data[d].time,
              Value: data[d][x]
            })
            count++;
          }
        }
        day++;
      }
      this.calculateAvg();
      !this.newUser && this.data.length <= count ? this.openDialog(this.noData) : false;
    }
    else {
      !this.newUser ? this.openDialog(this.noData) : false;
      }
    }
  updateSettings(settings: any) {
    if (settings) {
      this.financeSet = settings.finance;
      this.happinessSet = settings.happiness;
      this.exerciseSet = settings.exercise;
      this.nutritionSet = settings.nutrition;
      this.sleepSet = settings.sleep;
      this.alcoholSet = settings.alcohol;
    }
  }
  calculateAvg() {
    this.measurementsAvg = [];
    var measGroup: any = {};
    this.data.forEach(function (x) {
      measGroup[x.Measurement] ? false : measGroup[x.Measurement] = [];
      measGroup[x.Measurement].push(x.Value);
    });
    for (var m in measGroup) {
      var total = 0;
      measGroup[m].forEach(function (x: any) {
        total += +x;
      })
      var val = 565 - ((565 - 180) * ((total / measGroup[m].length) * .01));
      this.measurementsAvg.push({ name: m, value: val, valueV: (total / measGroup[m].length).toFixed(0) })
    }
  }

}
