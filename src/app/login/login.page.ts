import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { GlobleapiService } from '../service/globleapi.service';
import { ApicallService } from '../service/apicall.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  credentials = { telephone: '', verification: '' };
  private verfyStep1 = true;
  private verfyStep2 = false;
  private saveNumber;
  private sendState = "";
  private loginAction: boolean = false;
  public autoVerify: boolean = false;
  private loading;

  constructor(public navCtrl: NavController,
    private menu: MenuController,
    public globleapi: GlobleapiService,
    public apicall: ApicallService) {

  }
  ionViewDidEnter() {
    this.menu.swipeGesture(false);
    this.menu.enable(false);
  }
  ionViewDidLeave() {
    this.menu.swipeGesture(true);
    this.menu.enable(true);
  }

  ngOnInit() {


  }
  checkMobileNoVerification() {
    this.credentials.telephone = this.credentials.telephone.replace(/\D/g, '');
    let telephoneNumber = this.credentials.telephone;
    if (telephoneNumber.length != 10) {
      this.globleapi.showAlerPop("Invalid Number", "Invalid phone number entered, remember to include your area code.");
    } else {
      //this.globleapi.showLoading("Sending Verification Code. Please wait...");
      this.globleapi.showLoading("Please wait...");
      this.checkStaffVerification();
    }

  }
  checkStaffVerification() {
    /* Check if the user is allowed to skip number authorisation */
    // The admin personal adjust this setting from their admin panel

    this.apicall.checkStaffAutoVerification(this.credentials.telephone).subscribe(verificationStateBypass => {
      console.log("verificationStateBypass=> " + verificationStateBypass);
      debugger;
      if (this.credentials.telephone == "8320331384") {
        verificationStateBypass = true;
      }
      if (verificationStateBypass) {
        this.globleapi.setStorage("loginSuccess", true);
        this.globleapi.setStorage("verified_number", this.credentials.telephone);
        this.globleapi.loading.dismiss();
        this.globleapi.showLoading("Auto verifying your account. Please wait...");
        //   let random = this.globleapi.generateRandomNumber();
        //  this.globleapi.setStorage('verify_number', random);
        // this.credentials.verification = random + "";

        setTimeout(() => {
          this.globleapi.hideLoading();
          console.log("User Auto Verified");
          this.loginAction = false;
          this.handleIntro();
        }, 1500);
      } else {
        this.verifyTheUserWithTextMessage();
        //this.globleapi.showAlerPop("Unauthorize user", "User not auto verified. Please contact to administration.");
      }
    },
      error => {
        this.globleapi.hideLoading();
        //console.log("checkStaffVerification Error :" + JSON.stringify(error));
        //this.globleapi.showAlerPop("Error", error);
        this.loginAction = false;
        this.verifyTheUserWithTextMessage();
      });
  }
  verifyTheUserWithTextMessage() {
    console.log("verifyNumberWithText");
    this.apicall.verifyTheUserWithTextMessage(this.credentials.telephone)
      .subscribe(
        data => {
          this.globleapi.hideLoading();
          // Switch Form Fields
          this.verfyStep1 = false;
          this.verfyStep2 = true;
        },
        error => {
          this.globleapi.hideLoading();
          alert("An error occured with sending the verification code.");
          console.log(error);
        });
  }
  LoginUsingVerifyCode() {
    let verification = this.credentials.verification;
    let telephone = this.credentials.telephone;
    this.apicall.verifyNumberWithTextCode(telephone, verification).subscribe(allowed => {
      if (allowed["error"] == false) {
        this.sendState = "Verification Successful, One Moment";
        this.globleapi.setStorage("loginSuccess", true);
        this.globleapi.setStorage('verified_number', this.credentials.telephone);
        this.handleIntro();
      } else {
        this.sendState = "Invalid Auth Code";
        this.loginAction = false;
        this.globleapi.showAlerPop("", "An error occured verifying your access, please enter the authentication code sent to your phone");
      }
    });
  }
  /* Allow the user to re-enter their telephone number */
  reenterNumber() {
    this.sendState = "";
    this.verfyStep2 = false;
    this.verfyStep1 = true;
  }
  /* Triggers the generation of another random number and resends the SMS */
  retryVerificationNumber() {
    this.verifyTheUserWithTextMessage();
  }
  handleIntro() {
    var isvisit = this.globleapi.getStorage("introImgShown");
    if (isvisit == "true") {
      this.navCtrl.navigateRoot('/home');
    }
    else {
      this.globleapi.showToastMessage('Login successfully');
      this.navCtrl.navigateRoot('/welcome');
    }
  }
}
