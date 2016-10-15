import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { G } from '../G.service';
declare var firebase: any;

@Component({
  moduleId: module.id,
  selector: 'my-account',
  templateUrl: 'account.component.html',
  providers: [G]
})
export class AccountComponent implements AfterViewInit, OnInit {
  fullName: string = "";
  address1: string = "";
  address2: string = "";
  password: string = "";
  loginPassword: string = "";
  changeState: number = 0;
  email: string = "";
  city: string = "";
  state: string = "";
  country: string = "";
  postalCode: number;
  shareDataPub: boolean = true;
  shareDataPriv: boolean = true;
  newUser: boolean = false;
  G: G = new G;

  @ViewChild('newDialog') newDialog: any;
  @ViewChild('successDialog') successDialog: any;
  @ViewChild('emailDialog') emailDialog: any;
  @ViewChild('passwordDialog') passwordDialog: any;
  @ViewChild('loginDialog') loginDialog: any;

  ngAfterViewInit(): any {
    this.G.G.upgrade();
    var dialogs = [this.newDialog, this.successDialog, this.emailDialog, this.passwordDialog, this.loginDialog]
    this.G.G.registerDialogs(dialogs);
  }
  ngOnInit(): any {
    var me = this;
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        me.manageUser();
      }
    });
  }
  manageUser() {
    this.newUser = this.G.G.isNew("newAccount");
    this.fullName = this.G.G.user.Name;
    this.newUser ? this.G.G.showDelay(this.newDialog) : this.getAccount();
  }
  getAccount() {
    var account = this.G.G.getAccount();
    this.updateAccount(account);
  }
  updateAccount(account: any) {
    if (account) {
      this.fullName = account.fullName || "";
      this.address1 = account.address1 || "";
      this.address2 = account.address2 || "";
      this.city = account.city || "";
      this.state = account.state || "";
      this.country = account.country || "";
      this.postalCode = account.postalCode || "";
      this.shareDataPriv = account.shareDataPriv || true;
    }
    this.G.G.upgradeDelay();
  }
  saveAccount() {
    var data = {
      "fullName": this.fullName, "address1": this.address1, "address2": this.address2,
      "city": this.city, "state": this.state, "country": this.country, "postalCode": this.postalCode,
      "shareDataPriv": this.shareDataPriv
    };
    this.G.G.saveAccount(data);
    this.successDialog.nativeElement.showModal()
  }
  clearData() {
    this.G.G.deleteData();
  }
  updateEmail() {
    this.changeState = 1;
    var update = this.G.G.updateEmail(this.email);
    update ? this.G.G.close(this.emailDialog) : this.signInAgain();
  }
  updatePassword() {
    this.changeState = 2;
    var update = this.G.G.updatePassword(this.password);
    update ? this.G.G.close(this.passwordDialog) : this.signInAgain();
  }
  signInAgain() {
    this.changeState == 1 ? this.emailDialog.nativeElement.close() : this.passwordDialog.nativeElement.close();
    this.loginDialog.nativeElement.showModal();
  }
  reAuthenticate() {
    var me = this;
    var auth = this.G.G.reAuth(this.loginPassword);
    if (auth) {
      this.changeState == 1 ? this.updateEmail() : this.updatePassword();
    };
  }
  closeNewDialog() {
    this.G.G.close(this.newDialog);
    this.G.G.set('newAccount', "false");
    this.G.G.set('newSettings', "true");
    window.location.pathname = "my-app/settings";
  }
  dashboardSuccess() {
    this.G.G.close(this.successDialog);
    window.location.pathname = "my-app/dashboard";
  }
}
