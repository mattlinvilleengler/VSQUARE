import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataCardComponent } from '../datacard/datacard.component';

declare var componentHandler: any;
declare var database: any;
declare var firebase: any;

@Component({
  moduleId: module.id,
  selector: 'my-datadays',
  templateUrl: 'datadays.component.html',
    directives: [ DataCardComponent]

})
export class DataDaysComponent implements AfterViewInit, OnInit {
  finance: number = 0;
  happiness: number = 0;
  exercise: number = 0;
  nutrition: number = 0;
  sleep: number = 0;
  alcohol: number = 0;
  loggedIn: boolean = false;
  userID: number;

  financeSet: boolean = false;
  happinessSet: boolean = false;
  exerciseSet: boolean = false;
  nutritionSet: boolean = false;
  sleepSet: boolean = false;
  alcoholSet: boolean = false;

  data: any = [];
  

  ngAfterViewInit():any {
    componentHandler.upgradeDom();
  }
  ngOnInit():any{
    var me = this;
    firebase.auth().onAuthStateChanged(function(user:any) {
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

  getSettings(){
  var me = this;
  database.ref('settings/' + this.userID ).on('value', function(snapshot:any) {
  me.updateSettings(snapshot.val());
  });
  }
   getData(){
  var me = this;
  database.ref('data/' + this.userID ).on('value', function(snapshot:any) {
  me.updateData(snapshot.val());
  });
   }
    updateData(data:any){
        for(var d in data){
            data[d].time = (new Date(data[d].time)).toLocaleDateString();
           this.data.push(data[d]);
        }

  }
  updateSettings(settings:any){
  this.financeSet = settings.finance;
  this.happinessSet = settings.happiness;
  this.exerciseSet = settings.exercise;
  this.nutritionSet = settings.nutrition;
  this.sleepSet = settings.sleep;
  this.alcoholSet = settings.alcohol;
  }

}
