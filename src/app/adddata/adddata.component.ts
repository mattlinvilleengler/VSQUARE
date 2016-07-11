import { Component, OnInit, AfterViewInit } from '@angular/core';
declare var componentHandler: any;
declare var database: any;
declare var firebase: any;

@Component({
  moduleId: module.id,
  selector: 'my-adddata',
  templateUrl: 'adddata.component.html'
})
export class AddDataComponent implements AfterViewInit, OnInit {
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
  updateSettings(settings:any){
  this.financeSet = settings.finance;
  this.happinessSet = settings.happiness;
  this.exerciseSet = settings.exercise;
  this.nutritionSet = settings.nutrition;
  this.sleepSet = settings.sleep;
  this.alcoholSet = settings.alcohol;
  }
  saveData(){
    if(this.loggedIn){
      var d = new Date();
      var date = d.getTime();
    database.ref("data/" + this.userID + "/").push(
      {"time": date, "finance": this.finance, "happiness": this.happiness,
      "exercise": this.exercise, "nutrition": this.nutrition, "sleep": this.sleep, "alcohol": this.alcohol } 
    );
    }
  }
}
