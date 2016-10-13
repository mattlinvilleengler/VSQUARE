import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
declare var vsquare: any;

@Component({
  moduleId: module.id,
  selector: 'my-account',
  templateUrl: 'account.component.html'
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
  vsquare: any = vsquare;

  @ViewChild('newDialog') newDialog: any;
  @ViewChild('successDialog') successDialog: any;
  @ViewChild('emailDialog') emailDialog: any;
  @ViewChild('passwordDialog') passwordDialog: any;
  @ViewChild('loginDialog') loginDialog: any;

  ngAfterViewInit(): any {
    vsquare.upgrade();
    var dialogs = [this.newDialog, this.successDialog, this.emailDialog, this.passwordDialog, this.loginDialog]
    vsquare.registerDialogs(dialogs);
    this.newUser = vsquare.isNew("newAccount");
    this.fullName = vsquare.user.Name;
    this.newUser ? vsquare.showDelay(this.newDialog) : this.getAccount();
  }
  ngOnInit(): any {
  }
  getAccount() {
    var account = vsquare.getAccount();
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
    vsquare.upgradeDelay();
  }
  saveAccount() {
    var data = {
      "fullName": this.fullName, "address1": this.address1, "address2": this.address2,
      "city": this.city, "state": this.state, "country": this.country, "postalCode": this.postalCode,
      "shareDataPriv": this.shareDataPriv
    };
    vsquare.saveAccount(data);
    this.successDialog.nativeElement.showModal()
  }
  clearData() {
    vsquare.deleteData();
  }
  updateEmail() {
    this.changeState = 1;
    var update = vsquare.updateEmail(this.email);
    update ? vsquare.close(this.emailDialog) : this.signInAgain();
  }
  updatePassword() {
    this.changeState = 2;
    var update = vsquare.updatePassword(this.password);
    update ? vsquare.close(this.passwordDialog) : this.signInAgain();
  }
  signInAgain() {
    this.changeState == 1 ? this.emailDialog.nativeElement.close() : this.passwordDialog.nativeElement.close();
    this.loginDialog.nativeElement.showModal();
  }
  reAuthenticate() {
    var me = this;
    var auth = vsquare.reAuth(this.loginPassword);
    if (auth){
      this.changeState == 1 ? this.updateEmail() : this.updatePassword();
    };
  }
  closeNewDialog() {
    vsquare.close(this.newDialog);
    vsquare.set('newAccount', "false");
    vsquare.set('newSettings', "true");
    window.location.pathname = "my-app/settings";
  }
  dashboardSuccess() {
    vsquare.close(this.successDialog);
    window.location.pathname = "my-app/dashboard";
  }
}
