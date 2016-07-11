import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
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
  lastData: number;
  

  financeSet: boolean = false;
  happinessSet: boolean = false;
  exerciseSet: boolean = false;
  nutritionSet: boolean = false;
  sleepSet: boolean = false;
  alcoholSet: boolean = false;

  @ViewChild('errorDialog') dialog: any;
  

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
      var lastDate = new Date(this.lastData);
      if( (d.getDate() != lastDate.getDate()) || (d.getMonth() != lastDate.getMonth()) || (d.getFullYear() != lastDate.getFullYear()) ){
    database.ref("data/" + this.userID + "/").push(
      {"time": date, "finance": this.finance, "happiness": this.happiness,
      "exercise": this.exercise, "nutrition": this.nutrition, "sleep": this.sleep, "alcohol": this.alcohol } 
    );
      } else{
        this.dialog.nativeElement.showModal();
      }
    }
  }
     getData(){
  var me = this;
  database.ref('data/' + this.userID ).limitToLast(1).on('value', function(snapshot:any) {
  me.updateData(snapshot.val());
  });
   }
    updateData(data:any){
        if(data){
          for(var d in data){
              this.lastData = data[d].time ? data[d].time : false;
          }
       
        }
    }
       closeDialog(){
          this.dialog.nativeElement.close();
        }
         dashboard(){
          this.dialog.nativeElement.close();
          window.location.pathname = "dashboard";
        }
}
