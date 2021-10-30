import { Component, OnInit, ViewChild } from '@angular/core';

import { Platform, NavController, LoadingController, AlertController, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HomePage } from './home/home.page';
import { GlobleapiService } from './service/globleapi.service';
import { ApicallService } from './service/apicall.service';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { environment } from '../environments/environment';
import { PostComponent } from './othercomponent/post/post.component';
import { OneSignal, OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { Router } from '@angular/router';
import { Badge } from '@ionic-native/badge/ngx';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { Toast } from '@ionic-native/toast/ngx';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  loading: any;
  public playerID;
  public version_code = "";
  public new_version_link = null;
  public progressStatus;
  isUpdateAvailable: boolean = false;
  private notHandlerCheck;
  ModelPopupOpen: boolean = false;

  options: InAppBrowserOptions = {
    location: 'yes',//Or 'no' 
    hidden: 'no', //Or  'yes'
    clearcache: 'yes',
    clearsessioncache: 'yes',
    zoom: 'yes',//Android only ,shows browser zoom controls 
    hardwareback: 'yes',
    mediaPlaybackRequiresUserAction: 'no',
    shouldPauseOnSuspend: 'no', //Android only 
    closebuttoncaption: 'Close', //iOS only
    disallowoverscroll: 'no', //iOS only 
    toolbar: 'yes', //iOS only 
    enableViewportScale: 'no', //iOS only 
    allowInlineMediaPlayback: 'no',//iOS only 
    presentationstyle: 'pagesheet',//iOS only 
    fullscreen: 'yes',//Windows only    
  };

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public globleapi: GlobleapiService,
    public apicall: ApicallService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public appVersion: AppVersion,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    private oneSignal: OneSignal,
    private router: Router,
    private badge: Badge,
    private iab: InAppBrowser,
    private clipboard: Clipboard,
    private toast: Toast

  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.exitWithBack();
      if (this.globleapi.isMobile()) {
        this.loadOneSignalNew();
        this.checkForUpdate();
      }
      if (this.globleapi.isLogin()) {
        var isvisit = this.globleapi.getStorage("introImgShown");
        if (isvisit == "true") {
          this.navCtrl.navigateRoot('/home');
        }
        else {
          this.navCtrl.navigateRoot('/welcome');
        }
      }
      else {
        this.navCtrl.navigateRoot('/login');
      }
    });
  }

  // loadOneSignal() {
  //   if (this.globleapi.isMobile()) {
  //     window["plugins"].OneSignal.startInit(environment.ONE_SIGNAL_APP_ID, environment.ONE_SIGNAL_SENDER_ID)
  //       .handleNotificationReceived(this.onPushReceived)
  //       .handleNotificationOpened(this.onPushOpened)
  //       .endInit();
  //     window["plugins"].OneSignal.clearOneSignalNotifications();
  //     window["plugins"].OneSignal.inFocusDisplaying(1);
  //     window["plugins"].OneSignal.setSubscription(true);
  //     window['plugins'].OneSignal.getIds((ids) => this.globleapi.setStorage("playerID", ids.userId));
  //     var userid = this.globleapi.getStorage("playerID")
  //     console.log(userid);
  //   }
  // }
  // onPushReceived(data) {
  //   if (this.globleapi.isLogin()) {
  //     console.log("Notification received:\n" + JSON.stringify(data));
  //     alert(JSON.stringify(data));
  //     this.globleapi.setBadge(1);
  //     this.globleapi.increaseBadge();
  //     let sid = data.notification.payload.additionalData.postID;
  //     data["sid"] = sid;
  //     this.globleapi.setStorage('launchPost', data);
  //     if (data) {
  //       this.showNotification(data);
  //     }
  //   }
  // }
  // onPushOpened(data) {
  //   if (this.globleapi.isLogin()) {
  //     this.globleapi.decreaseBadge();
  //     console.log("Notification open:\n" + JSON.stringify(data));
  //   }
  // }
  loadOneSignalNew() {
    this.oneSignal.startInit(environment.ONE_SIGNAL_APP_ID, environment.ONE_SIGNAL_SENDER_ID);
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
    this.oneSignal.setSubscription(true);
    this.oneSignal.handleNotificationReceived().subscribe(data => this.onPushReceivednNew(data, data.payload));
    this.oneSignal.handleNotificationOpened().subscribe(data => this.onPushOpenedNew(data, data.notification.payload));
    this.oneSignal.endInit();
    this.oneSignal.getIds().then((ids) => {
      let playerID = ids.userId;
      this.playerID = playerID;
      console.log(playerID)
      this.globleapi.setStorage("playerID", playerID);
    });
    window["plugins"].OneSignal.clearOneSignalNotifications();
    this.badge.clear();
  }
  // Code to handle the notifications
  private onPushReceivednNew(data, payload: OSNotificationPayload) {
    if (this.notHandlerCheck != true) {
      this.notHandlerCheck = true;
      this.notificationHandling(data);
    }
    var totalbadge = this.badge.get();
    if (Number(totalbadge) > 0) {
      this.badge.increase(1);
    } else {
      this.badge.set(1);
    }
  }

  private onPushOpenedNew(data, payload: OSNotificationPayload) {
    debugger;
    //alert('Push opened: ' + payload.body);
    if (this.notHandlerCheck != true) {
      //alert("Running notificationHandling from handleNotificationOpened ");
      this.notHandlerCheck = true;
      this.notificationHandling(data);
    }
    var totalbadge = this.badge.get();
    if (Number(totalbadge) > 0) {
      this.badge.decrease(1);
    } else {
      this.badge.clear();
    }

  }
  // Custom behavious to handle how the app should behave with a new notification
  private notificationHandling(data) {
    this.notHandlerCheck = false;
    var payload;
    if (data.notification == undefined) {
      payload = data.payload;
    } else {
      payload = data.notification.payload;
    }
    data = payload;
    let sid = payload.additionalData.postID;
    data["sid"] = sid;
    this.globleapi.setStorage('launchPost', data);
    if (data) {
      this.showNotification(data);
    }
  }
  async showNotification(data) {
    this.globleapi.pushPage(data, "notification");
  }
  ngOnInit() {

  }
  checkForUpdate() {
    this.appVersion.getVersionNumber().then(version_code => {

      this.version_code = version_code;
      this.apicall.getUpdateInformation(this.version_code).subscribe(data => {
        console.log(data);

        if (data["link"] != null) {
          this.isUpdateAvailable = true;
          this.new_version_link = data["link"];
          this.showDownloadAlert(data)
        } else {
          // this.globleapi.showToastMessage("Your app is up to date");
        }
      });
    }).catch(err => {
    });
  }
  async showDownloadAlert(data) {
    const alert = await this.alertCtrl.create({
      subHeader: 'Portal Update',
      message: "A new version of the Staff Portal is available.",
      buttons: [
        {
          text: 'Download Update',
          role: 'ok',
          handler: () => {
            if (this.globleapi.isIphone()) {
              this.iab.create(data["link"], '_system', this.options);
            }
            else {
              window.open(data["link"], '_system', 'location=yes');
            }

          }
        },
      ]
    });
    await alert.present();
  }

  goToUpdate() {

    if (this.globleapi.isIphone()) {
      this.iab.create(this.new_version_link, '_system', this.options);
    } else {
      window.open(this.new_version_link, '_system', 'location=yes');
    }
  }
  logout() {
    this.oneSignal.setSubscription(false);
    this.globleapi.logout();
    this.navCtrl.navigateRoot('/login');
  }
  Exit() {
    this.globleapi.showExitConfirm();
  }
  exitWithBack() {
    var lastTimeBackPress = 0;
    var timePeriodToExit = 2000;
    this.platform.backButton.subscribe(() => {
      if (
        this.router.url === "/welcome" ||
        this.router.url === "/login") {
        if (new Date().getTime() - lastTimeBackPress < timePeriodToExit) {
          navigator['app'].exitApp();
        }
        else {
          // if (this.globleapi.ModelPopupOpen == 0) {
          this.globleapi.showToastMessage('Press back again to exit App?');
          lastTimeBackPress = new Date().getTime();
          // }
        }
      }
      else {
        this.navCtrl.pop()
      }
    });
  }
  copytoclipboard() {
    this.clipboard.copy(this.playerID);
    this.toast.show(`Copy succesfully`, '2000', 'center').subscribe(toast => {
      console.log(toast);
    });
  }
}
