import { PostComponent } from './../post/post.component';
import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { ApicallService } from '../../service/apicall.service';
import { GlobleapiService } from '../../service/globleapi.service';
import { WpapiService } from '../../service/wpapi.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  searchQuery: string = '';
  items: any[];
  itemsOrig: any[];
  searchTextDisplay = true;
  loadingResults = false;
  public showInternal = true;
  public resText = "";

  public searchList: any[] = [];
  public subscription;
  public url = "";
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public apicall: ApicallService,
    public globleapi: GlobleapiService,
    public wpapi: WpapiService,
    public modalCtrl: ModalController

  ) {
    var savedArticleList = JSON.parse(this.globleapi.getStorage("savedArticles"));
    if (savedArticleList.length > 0) {
      this.items = savedArticleList;
      this.itemsOrig = savedArticleList;
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }
  getItems(ev: any) {
    this.searchList = [];
    let val = ev.target.value;
    this.resText = " for " + val;
    if (val.length != 0) {
      this.searchTextDisplay = false;
    } else {
      this.searchTextDisplay = true;
    }
    if (val.length >= 2) {
      this.searchForString(val.toLowerCase());
    }
  }
  async pushPage(item) {
    this.globleapi.pushPage(item, "simple");


  }

  async dismiss() {
    //this.viewCtrl.dismiss();
    this.globleapi.ModelPopupOpen = this.globleapi.ModelPopupOpen - 1;
    const onClosedData: string = "Wrapped Up!";
    await this.modalCtrl.dismiss(onClosedData);

  }
  searchForString(keyword) {
    this.loadingResults = true;
    this.wpapi.searchArtical(keyword).subscribe(data => {
      for (let x = 0; x < data['length']; x++) {
        var post = data[x];
        this.searchList.push({
          'author': post['author'],
          'id': post['id'],
          'title': post['title']['rendered'],
          'content': post['content']['rendered'],
          'date': post['date'],
          'featured_media': post['featured_media']
        });
      }
      this.loadingResults = false;
      this.showInternal = false;
    }), error => {
      this.globleapi.showAlerPop('Message', 'Unable to load search results');
      this.loadingResults = false;
      this.showInternal = true;
    }
  }
  ngOnInit() { }
}
