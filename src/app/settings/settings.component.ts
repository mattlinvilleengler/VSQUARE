import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
declare var componentHandler: any;
declare var database: any;
declare var firebase: any;

@Component({
  moduleId: module.id,
  selector: 'my-settings',
  templateUrl: 'settings.component.html',
  styleUrls: ['settings.component.css']
})
export class SettingsComponent implements AfterViewInit, OnInit {
  finance: boolean = false;
  happiness: boolean = false;
  exercise: boolean = false;
  nutrition: boolean = false;
  sleep: boolean = false;
  alcohol: boolean = false;
  loggedIn: boolean = false;
  userID: number;

 // settings: Settings = new Settings();
  //settings: Settings = this.getSettingsX();


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
      //me.settings = new Settings();
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
    if(settings){
  this.finance = settings.finance;
  this.happiness = settings.happiness;
this.exercise = settings.exercise;
  this.nutrition = settings.nutrition;
  this.sleep = settings.sleep;
  this.alcohol = settings.alcohol;
    }
  }
  saveSettings(){
    if(this.loggedIn){
    database.ref("settings/" + this.userID + "/").set(
      { "finance": this.finance, "happiness": this.happiness,
      "exercise": this.exercise, "nutrition": this.nutrition, "sleep": this.sleep, "alcohol": this.alcohol  
      }
    );
    }
  }
}
