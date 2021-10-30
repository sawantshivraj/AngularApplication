import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, MenuController, NavController } from '@ionic/angular';
import { GlobleapiService } from '../../service/globleapi.service';
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;
  public appbuttontext = "Skip To App";
  public pagerOption = true;
  constructor(
    public navCtrl: NavController,
    public globleapi: GlobleapiService,
    private menu: MenuController
  ) { }

  ngOnInit() {
    this.menu.swipeGesture(false);
    this.menu.enable(false);
  }
  ionViewDidEnter() {
    this.introShow();
  }
  ionViewDidLeave() {
    this.menu.swipeGesture(true);
    this.menu.enable(true);
  }
  skipIntro() {
    this.globleapi.setStorage("introImgShown", true);
    this.navCtrl.navigateRoot('/home');
  }
  slideChanged() {
    var currentIndex = this.slides.getActiveIndex();
    this.pagerOption = true;
    if (Number(currentIndex) >= 2) {
      this.appbuttontext = "Start App!";
      this.pagerOption = false;
    } else {
      this.appbuttontext = "Skip Intro";
    }
  }
  introShow() {
    var isvisit = this.globleapi.getStorage("introImgShown");
    if (isvisit == "true") {
      this.navCtrl.navigateRoot('/home');
    }
  }
}
