import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { Badge } from '@ionic-native/badge/ngx';
import * as moment from 'moment';
import { ApicallService } from './apicall.service';
import { Storage } from '@ionic/storage';
import { PostComponent } from '../othercomponent/post/post.component';

@Injectable({
  providedIn: 'root'
})
export class GlobleapiService {
  loading: any;
  public nowDate: any = new Date();
  ModelPopupOpen: number = 0;

  constructor(
    public badge: Badge,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public storage: Storage,
    public apicall: ApicallService,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
  ) { }
  isMobile() {
    if (this.platform.is('android') || this.platform.is('ios')) {
      return true;
    }
    return false;
  }
  isIphone() {
    if (this.platform.is('ios')) {
      return true;
    }
    return false;
  }
  async showLoading(Message) {
    this.loading = await this.loadingCtrl.create({
      message: Message
    });
    await this.loading.present();
  }
  async hideLoading() {
    setTimeout(async () => {
      await this.loading.dismiss();
    }, 1500);
  }
  async showAlerPop(title, message) {
    const alert = await this.alertCtrl.create({
      message: message,
      subHeader: 'alert',
      buttons: ['Okay']
    });
    await alert.present();
  }
  async showToastMessage(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }
  setStorage(key, data) {
    window.localStorage.setItem(key, data);
  }
  getStorage(key) {
    var data = window.localStorage.getItem(key);
    data = data == null ? "[]" : data;
    return data;
  }
  deleteStorage(key) {
    window.localStorage.removeItem(key);
  }
  setBadge(No) {
    this.badge.set(No);
  }
  getBadge() {
    return this.badge.get();
  }
  increaseBadge() {
    this.badge.increase(1);
  }
  decreaseBadge() {
    this.badge.decrease(1);
  }
  generateRandomNumber() {
    return Math.floor(Math.random() * (999999 - 100000)) + 100000;
  }
  isLogin() {
    var loginSuccess = this.getStorage("loginSuccess");
    return loginSuccess == "true"
  }
  checkCardSpecial(date, items) {

    let lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth(), 0);

    let article = new Date(date);
    let stateMonth = article.getTime() >= lastMonth.getTime();

    if (stateMonth) {
      //alert( "Article " + article );
      //alert( "Last Month " + lastMonth );
      return "card-special";
    }
  }
  checkUserStatus() {
    var result = this.getStorage("verified_number");
    if (result != "[]") {
      this.apicall.verifyNumberAgain(result).subscribe(data => {
        if (data["error"] == true) {
          this.showAlerPop("Unauthorised", data["message"])
          this.logout();
        } else {
          /* Set time last verified */
          this.storage.set('last_verified', this.nowDate);
        }
      });
    }
    else {
      this.logout();
    }
  }
  logout() {
    this.deleteStorage("loginSuccess");
    this.deleteStorage("verified_number");
    this.deleteStorage("introImgShown");
    this.deleteStorage("articles");
    this.deleteStorage("last_verified");
    this.deleteStorage("launchPost");
  }

  getFeaturedImage(post) {

    /* Determine if the post has any featured image attached to it */
    let featured_image = null;
    /* Grab the image from the actual post */
    let str = post['excerpt']['rendered'] + "";
    var elem = document.createElement("div");
    elem.innerHTML = str;
    var images = elem.getElementsByTagName("img");
    let src = "";
    /* Loop through all images found in the html content */
    for (var i = 0; i < images.length; i++) {
      //console.log(images[i].src);
      src = images[i].src;
    }
    if (post['_embedded']) {
      if (post['_embedded']['wp:featuredmedia']) {
        let fmedia = post['_embedded']['wp:featuredmedia'][0];
        if (fmedia['source_url']) {
          featured_image = fmedia['source_url'];
        }
      }
    }
    /* If no featured image is found then use an image from the src */
    if (featured_image == null) {
      if (src != null && src != "") {
        featured_image = src;
      }
      else {
        featured_image = "assets/noimage.png";
      }
    }
    //console.log("featured_image");
    //console.log(featured_image);
    return featured_image;

  }

  getCategory(post) {

    let featured_category;
    let featured_category_plain;
    let info = [];

    if (post['_embedded']['wp:term']) {
      let pCategory = post['_embedded']['wp:term'][0][0];
      if (pCategory['name']) {
        featured_category = pCategory['name'];
        if (featured_category == "Automakers") {
          featured_category = "<span class = 'color_blue'>" + featured_category + "</span>";
          featured_category_plain = "automakers";
        } else if (featured_category == "News") {
          featured_category = "<span class = 'color_red'>" + featured_category + "</span>";
          featured_category_plain = "news";
        } else if (featured_category == "Staff") {
          featured_category = "<span class = 'color_green'>" + featured_category + "</span>";
          featured_category_plain = "staff";
        } else if (featured_category == "Uncategorized") {
          featured_category = "";
          featured_category_plain = "";
        }
      }
    }

    info["category"] = featured_category;
    info["plain"] = featured_category_plain;

    return info;
  }

  convertDate(date) {
    if (date != "0000-00-00 00:00:00") {
      return moment(date).format('LL');
      //return this.datePipe.transform(date, 'fullDate');
    }
  }

  async pushPage(item, type) {
    this.ModelPopupOpen = this.ModelPopupOpen + 1;
    const modal = await this.modalCtrl.create({
      component: PostComponent,
      componentProps: {
        "item": item,
        "type": type
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      this.ModelPopupOpen = this.ModelPopupOpen - 1;
    });
    await modal.present();
  }

  showExitConfirm() {
    this.alertCtrl.create({
      header: 'App termination',
      message: 'Do you want to close the app?',
      backdropDismiss: false,
      buttons: [{
        text: 'Stay',
        role: 'cancel',
        handler: () => {
          console.log('Application exit prevented!');
        }
      }, {
        text: 'Exit',
        handler: () => {
          navigator['app'].exitApp();
        }
      }]

    })
      .then(alert => {
        alert.present();
      });
  }
}
