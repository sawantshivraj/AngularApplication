import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import * as moment from 'moment';
import { ApicallService } from '../../service/apicall.service';
import { GlobleapiService } from '../../service/globleapi.service';
import { PostComponent } from '../post/post.component';

@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.component.html',
  styleUrls: ['./favourite.component.scss'],
})
export class FavouriteComponent implements OnInit {
  selectedItem: any;
  icons: string[];
  items: Array<{ title: string, note: string, icon: string }>;
  public noarticles: boolean = false;
  public articleList: any[] = [];
  public removedArticleList: any[] = [];
  public editAvailable = false;
  savedArticleList: any = [];
  constructor(
    public navCtrl: NavController,
    public apicall: ApicallService,
    public globleapi: GlobleapiService,
    public modalCtrl: ModalController,

  ) {

    this.favouriteArticlesList();
  }

  ngOnInit() { }
  ionViewDidLoad() {
  }
  favouriteArticlesList() {
    this.savedArticleList = JSON.parse(this.globleapi.getStorage("savedArticles"));
    if (this.savedArticleList.length > 0) {
      this.noarticles = false;
      this.articleList = this.savedArticleList;
    } else {
      this.noarticles = true;
    }
  }
  removeArticle(item, event) {
    const index = this.savedArticleList.findIndex(i => i.id === item.id);
    if (index != -1) {
      this.savedArticleList.splice(index, 1);
    }
    this.globleapi.setStorage("savedArticles", JSON.stringify(this.savedArticleList));
    this.globleapi.showToastMessage('Article removed from list');
  }

  convertDate(date) {
    if (date != "0000-00-00 00:00:00") {
      return moment(date).format('LLLL');
    }
  }

  editItems(event) {
    if (this.editAvailable == false) {
      event.target.innerText = "Done";
    } else {
      event.target.innerText = "Edit";
    }
    this.editAvailable = !this.editAvailable;
  }
  async pushPage(item) {
    this.globleapi.pushPage(item, "simple");
 
  }

}
