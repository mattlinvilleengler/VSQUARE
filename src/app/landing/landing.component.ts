import { Component, OnInit, AfterViewInit, Input, ViewChild } from '@angular/core';
declare var vsquare: any;

@Component({
  moduleId: module.id,
  selector: 'my-landing',
  styleUrls: ['landing.component.css'],
  templateUrl: 'landing.component.html'
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
  vsquare: any = vsquare;

  @ViewChild('loginDialog') loginDialog: any;
  @ViewChild('resetDialog') resetDialog: any;
  @ViewChild('registerDialog') registerDialog: any;
  @ViewChild('text') text: any;

  ngAfterViewInit(): any {
    var me = this;
    this.color();
    vsquare.upgrade();
    var dialogs = [this.loginDialog, this.resetDialog, this.registerDialog]
    vsquare.registerDialogs(dialogs);
  }
  color() {
    var me = this;
    var colors = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
    setInterval(function () {
      me.bc = colors[Math.floor(Math.random() * (colors.length - 1))];
    }, 5000)
  }
  signIn() {
    vsquare.set('loginMethod', 'current');
    vsquare.set('loggingIn', 'true');
    vsquare.close(this.loginDialog);
    vsquare.signIn(this.email, this.password);
  }
  register() {
    vsquare.set('loginMethod', 'new');
    vsquare.set('loggingIn', 'true');
    vsquare.close(this.registerDialog);
    vsquare.register(this.emailRegister, this.passwordRegister);
  }
  resetPassword() {
    vsquare.reset(this.emailReset);
  }
  reset() {
    vsquare.close(this.loginDialog);
    this.resetDialog.nativeElement.showModal();
  }
  resetSend() {
    this.resetPassword();
    vsquare.close(this.resetDialog);
  }
}