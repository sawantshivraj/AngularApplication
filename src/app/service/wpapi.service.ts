import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpBackend, HttpXhrBackend, HttpClientModule, HttpClient } from '@angular/common/http';
import { GlobleapiService } from './globleapi.service';

@Injectable({
  providedIn: 'root'
})
export class WpapiService {
  private apiTrackNotification = "http://portaladmin.luovalabs.com/dev/index.php/tracking/notification/";
  constructor(public http: HttpClient, public globleapi: GlobleapiService,) { }


  loadArtical(pageNo, offset) {
    var url = 'https://www.simpsonmotors.com/wp-json/wp/v2/posts?_embed&offset=' + offset + '&per_page=' + pageNo;
    return this.http.get(url).pipe(map(res => res));
  }
  getNotificationPost(id) {
    return this.http.get("https://www.simpsonmotors.com/wp-json/wp/v2/posts/" + id).pipe(map(res => res));
  }
  checkarticle(postID) {
    var articleAvailable = "https://www.simpsonmotors.com/wp-json/wp/v2/posts/" + postID;
    return this.http.get(articleAvailable).pipe(map(res => res));;
  }
  track(title, postid) {
    var playerID = this.globleapi.getStorage("playerID");
    try {
      this.http.get("http://portaladmin.luovalabs.com/dev/index.php/tracking/post/" + postid + "/" + encodeURIComponent(title) + "/" + playerID + "")
        .pipe(map(res => res));
    } catch (error) {
    }
  }
  searchArtical(keyword) {
    var url = 'https://www.simpsonmotors.com/index.php/wp-json/wp/v2/posts?_embed&search=' + keyword;
    return this.http.get(url).pipe(map(res => res));
  }
  updateNotificationRead(notificationID, sid) {
    var playerID = this.globleapi.getStorage("playerID");
    return this.http.get(this.apiTrackNotification + playerID + "/" + notificationID + "/" + sid).pipe(map(res => res));
  }
}
