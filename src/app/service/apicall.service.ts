import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApicallService {
  private staff_verify_bypass_url = "http://portaladmin.luovalabs.com/dev/index.php/staff/autoverify/";
  private apiVerifyTelephone = "http://portaladmin.luovalabs.com/dev/index.php/sendText/";
  private articalPostURL = "https://www.simpsonmotors.com/wp-json/wp/v2/posts?_embed&offset=0&per_page=";
  private apiVerifyAgain = "http://portaladmin.luovalabs.com/dev/index.php/staff/verifyAgain/";
  private apiCheckUpdates = "http://portaladmin.luovalabs.com/dev/index.php/staff/checkversion/";
  private apiVerifyTelephoneText = "http://portaladmin.luovalabs.com/dev/index.php/verifyText/";

  constructor(public http: HttpClient, public platform: Platform,) {
  }

  checkStaffAutoVerification(tel) {
    console.log(this.staff_verify_bypass_url + tel + "/3243");
    return this.http.get(this.staff_verify_bypass_url + tel + "/3243").pipe();
  }
  verifyTheUserWithTextMessage(tel) {
    console.log(this.apiVerifyTelephone + tel);
    //    return this.http.get(this.apiVerifyTelephone + tel).pipe();
    return this.http.get(this.apiVerifyTelephone + tel).pipe(map(res => res));
  }
  verifyNumberAgain(number) {
    return this.http.get(this.apiVerifyAgain + number).pipe();
  }
  getUpdateInformation(version) {
    let type = "android";
    if (this.platform.is('ios')) {
      type = "ios"
    }
    let url = this.apiCheckUpdates + version + "/" + type;
    //alert(url);
    return this.http.get(url).pipe();
  }
  verifyNumberWithTextCode(telephone, verification) {
    return this.http.get(this.apiVerifyTelephoneText + telephone + "/" + verification).pipe(map(res => res));
  }
}
