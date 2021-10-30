import { Component, OnInit } from '@angular/core';
import { WpapiService } from '../service/wpapi.service';
import { ApicallService } from '../service/apicall.service';
import { GlobleapiService } from '../service/globleapi.service';
import { ModalController, NavController } from '@ionic/angular';
import { SearchComponent } from '../othercomponent/search/search.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  public headingName = "Latest News";
  items: any = [];
  savedArticleList: any = [];
  public moreArticlesAlert;
  public loadingActive: boolean = true;
  public mrefresher;
  public active_loading = false;
  public articlesLoaded = 10;
  public articlesToLoad = 10;
  public infin;

  constructor(
    public navCtrl: NavController,
    public apicall: ApicallService,
    public globleapi: GlobleapiService,
    public modalCtrl: ModalController,
    public wpapi: WpapiService
  ) {
    this.globleapi.showLoading("Loading..");
    var savedList = this.globleapi.getStorage("savedArticles");
    this.savedArticleList = JSON.parse(savedList);
  }
  ngOnInit() {
  }
  ionViewWillEnter() {
    this.doRefresh(null);
    this.pollServer();
  }
  pollServer() {
    setInterval(() => {
      this.globleapi.checkUserStatus();
    }, 86400000);
  }
  doRefresh(refresher) {
    if (this.active_loading == false) {
      this.mrefresher = refresher;
      this.active_loading = true;
      setTimeout(() => {
        if (refresher) {
          if (refresher.state == "refreshing") {
            // this.globleapi.showToastMessage("");
            refresher.cancel();
          }
        }
      }, 10000);
      let amount_to_load = this.articlesLoaded + this.articlesToLoad;
      if (amount_to_load > 30) {
        amount_to_load = 30;
      }
      this.loadArtical("load", amount_to_load, 0);
    } else {
      try {
        refresher.cancel();
      } catch (e) {
      }
    }
  }
  doInfinite(infiniteScroll) {
    if (this.active_loading == false) {
      this.loadingActive = true;
      this.active_loading = true;
      if (this.articlesLoaded != this.items.length) {
        this.articlesLoaded = this.items.length;
      }
      this.loadArtical("infinite", this.articlesToLoad, this.articlesLoaded);
      this.infin = infiniteScroll;

    } else {
      //alert("Loading Occuring do infinite");
    }
  }
  loadArtical(type, total, offset) {

    this.wpapi.loadArtical(total, offset).subscribe(data => {
      console.log(data);
      if (type == "load") {
        this.items = [];
      }
      for (var i = 0; i < data["length"]; i++) {
        var post = data[i];
        let featured_image = this.globleapi.getFeaturedImage(post);
        let category = this.globleapi.getCategory(post);
        let savedStatevar = -1;
        if (this.checkIfSaved(post.id)) {
          savedStatevar = 1;
        }
        this.items.push({
          'author': post['author'],
          'id': post['id'],
          'title': post['title']['rendered'],
          'content': post['content']['rendered'],
          'category': category["category"],
          'date': post['date'],
          'featured_media': post['featured_media'],
          "post_image": featured_image,
          "savedState": savedStatevar
        });
      }
      this.active_loading = false;
      this.loadingActive = false;
      this.globleapi.hideLoading();
      this.globleapi.setStorage("articles", JSON.stringify(data));
      if (this.infin) {
        this.infin.target.complete();
        //this.infin.complete();
      }
      if (this.mrefresher) {
        this.mrefresher.target.complete();
        this.globleapi.showToastMessage(' Refresh Complete! ');
      }
    }), error => {
      // Cancel infin staff loader
      this.loadingActive = false;
      this.active_loading = false;

      if (this.infin) {
        this.infin.complete();
      }
      this.globleapi.hideLoading();
    };
  }
  async openModal(characterNum) {
    this.globleapi.ModelPopupOpen = this.globleapi.ModelPopupOpen + 1;
    let modal = await this.modalCtrl.create({
      component: SearchComponent,
      componentProps: {
        "item": characterNum,
        "type": "simple",
      }
    });
    modal.onDidDismiss().then((dataReturned) => {

      this.globleapi.ModelPopupOpen = this.globleapi.ModelPopupOpen - 1;
    });
    await modal.present();
  }
  async pushPage(item) {
    this.globleapi.pushPage(item, "simple");

  }
  
  checkCardSpecial(date) {
    return this.globleapi.checkCardSpecial(date, this.items);
  }
  saveArticle(item, event) {
    if (!this.checkIfSaved(item.id)) {
      this.savedArticleList.push(item);
      item["savedState"] = 1;
    }
    this.globleapi.setStorage("savedArticles", JSON.stringify(this.savedArticleList));
    this.globleapi.showToastMessage('Article saved to list');
  }
  removeArticle(item, event) {
    item["savedState"] = -1;
    const index = this.savedArticleList.findIndex(i => i.id === item.id);
    if (index != -1) {
      this.savedArticleList.splice(index, 1);
    }
    this.globleapi.setStorage("savedArticles", JSON.stringify(this.savedArticleList));
    this.globleapi.showToastMessage('Article removed from list');
  }
  checkIfSaved(id) {
    const index = this.savedArticleList.findIndex(i => i.id === id);
    if (index == -1) {
      return false
    }
    else {
      return true;
    }
  }

}
