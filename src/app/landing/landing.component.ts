import { Component, OnInit, AfterViewInit, Input, ViewChild } from '@angular/core';
import { G } from '../G.service'; 

@Component({
  moduleId: module.id,
  selector: 'my-landing',
  styleUrls: ['landing.component.css'],
  templateUrl: 'landing.component.html',
  providers: [ G ]
})
export class LandingComponent implements AfterViewInit {
  email: string;
  emailReset: string;
  password: string;
  emailRegister: string;
  passwordRegister: string;
  one: boolean = true;
  two: boolean = false;
  three: boolean = false;
  bc: string = "";
  G:G = new G;

  @ViewChild('loginDialog') loginDialog: any;
  @ViewChild('resetDialog') resetDialog: any;
  @ViewChild('registerDialog') registerDialog: any;
  @ViewChild('text') text: any;

  ngAfterViewInit(): any {
    var me = this;
    this.color();
    this.G.G.upgrade();
    var dialogs = [this.loginDialog, this.resetDialog, this.registerDialog]
    this.G.G.registerDialogs(dialogs);
  }
  color() {
    var me = this;
    var colors = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
    setInterval(function () {
      me.bc = colors[Math.floor(Math.random() * (colors.length - 1))];
    }, 5000)
  }
  signIn() {
    this.G.G.set('loginMethod', 'current');
    this.G.G.set('loggingIn', 'true');
    this.G.G.close(this.loginDialog);
    this.G.G.signIn(this.email, this.password);
  }
  register() {
    this.G.G.set('loginMethod', 'new');
    this.G.G.set('loggingIn', 'true');
    this.G.G.close(this.registerDialog);
    this.G.G.register(this.emailRegister, this.passwordRegister);
  }
  resetPassword() {
    this.G.G.reset(this.emailReset);
  }
  reset() {
    this.G.G.close(this.loginDialog);
    this.resetDialog.nativeElement.showModal();
  }
  resetSend() {
    this.resetPassword();
    this.G.G.close(this.resetDialog);
  }
}