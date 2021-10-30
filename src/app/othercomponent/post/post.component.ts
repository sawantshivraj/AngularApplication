import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { ApicallService } from '../../service/apicall.service';
import { GlobleapiService } from '../../service/globleapi.service';
import { WpapiService } from '../../service/wpapi.service';

import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  @ViewChild('mainHeader') defaultContent: ElementRef;
  selectedItem: any;
  public contentLoaded = false;
  public stitle;
  public sid;
  public postDate;
  public articleContent;
  public notificationID;
  public articleError = false;
  public replaceVideoEmbed = "";

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
    public navCtrl: NavController,
    public navParams: NavParams,
    private sanitizer: DomSanitizer,
    public apicall: ApicallService,
    public globleapi: GlobleapiService,
    public wpapi: WpapiService,
    private modalController: ModalController,
    private iab: InAppBrowser,

  ) {

  }

  ngOnInit() { }

  ionViewDidLoad() {
  }
  ionViewDidLeave() {

  }
  ionViewWillEnter() {
    //this.globleapi.showLoading("Loading..");
    this.selectedItem = this.navParams.get('item');
    let type = this.navParams.get('type');
    if (type == "simple") {
      this.sid = this.selectedItem.id;
      this.contentLoaded = true;
      this.articleError = false;
      this.stitle = this.selectedItem.title;
      this.postDate = this.selectedItem.date;
      this.articleContent = this.selectedItem.content;
      //this.articleContent = this.sanitizer.bypassSecurityTrustHtml(this.articleContent); 
      this.parsingHtml(this.sanitizer.bypassSecurityTrustHtml(this.articleContent));

      this.postAvailable();
      //this.globleapi.hideLoading();
    } else {
      this.sid = this.selectedItem.sid;
      this.notificationID = this.selectedItem.notificationID;
      this.wpapi.getNotificationPost(this.sid).subscribe(notification => {
        this.contentLoaded = true;
        this.articleError = false;
        // Use different attributes to access the information
        this.postAvailable();
        this.stitle = notification["title"]["rendered"];
        this.postDate = notification["date"];
        this.articleContent = notification["content"]["rendered"]; 
        this.parsingHtml(this.articleContent);
        this.updateNotificationRead();
      }, error => {
        this.globleapi.showAlerPop("Oops!", "Unable to fetch article. " + error);
      });
      // this.globleapi.hideLoading();
    }
  }
  async postAvailable() {
    try {

      this.wpapi.checkarticle(this.sid).subscribe(data => {
        this.trackUserPostRead();
        //  this.globleapi.setStorage("launchPost", null);
      });
    } catch (error) {
      console.error("Error occured while fetching the post information.");
    }
  }
  trackUserPostRead() {
    this.wpapi.track(this.stitle, this.sid);
  }
  updateNotificationRead() {
    this.wpapi.updateNotificationRead(this.notificationID, this.sid);
  }

  checkContent(event) {

    if (event.target.localName == "img") {
      //alert(event.target.currentSrc);
      this.openLink(event.target.currentSrc);
    }
    if(event.target.localName == "a"){
      this.openLink(event.target.href);
    }
  }
  openLink(url) {
    if (this.globleapi.isIphone()) {
      this.iab.create(url, '_system', this.options);
    }
    else {
      window.open(url, '_blank');
    }
  }
  async closeModal() {
    const onClosedData: string = "Wrapped Up!";
    await this.modalController.dismiss(onClosedData);
    this.globleapi.ModelPopupOpen = this.globleapi.ModelPopupOpen - 1;
  }

  parsingHtml(html:any) {
    debugger
    var i_Html =document.createElement('div'); 
    i_Html.innerHTML =  html.changingThisBreaksApplicationSecurity;
    let codeEmbed:any = i_Html.getElementsByTagName('a'); 
    if (codeEmbed.length) {
      for (let anchor of codeEmbed) { 
        if(anchor.firstChild.textContent !== ""){  
        }else{
          anchor.removeAttribute('href');
        }
      }
    }  
    
    this.articleContent = i_Html.innerHTML;
  }

}
