
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { Badge } from '@ionic-native/badge/ngx';

import { PostComponent } from './othercomponent/post/post.component';
import { SearchComponent } from './othercomponent/search/search.component';
import { FavouriteComponent } from './othercomponent/favourite/favourite.component';
import { WelcomeComponent } from './othercomponent/welcome/welcome.component';

import { WpapiService } from '../app/service/wpapi.service';
import { GlobleapiService } from '../app/service/globleapi.service';
import { ApicallService } from '../app/service/apicall.service';

import { HttpBackend, HttpXhrBackend, HttpClientModule } from '@angular/common/http';
import { NativeHttpModule, NativeHttpBackend, NativeHttpFallback } from 'ionic-native-http-connection-backend';
import { IonicStorageModule } from '@ionic/storage';

import { AppVersion } from '@ionic-native/app-version/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { Toast } from '@ionic-native/toast/ngx';

@NgModule({
  declarations: [AppComponent, PostComponent, SearchComponent, FavouriteComponent, WelcomeComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    NativeHttpModule,
    IonicStorageModule.forRoot(),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HttpBackend,
      useClass: NativeHttpFallback, deps: [Platform, NativeHttpBackend, HttpXhrBackend]
    },
    Badge,
    HttpClientModule,
    WpapiService,
    GlobleapiService,
    ApicallService,
    PostComponent,
    SearchComponent,
    FavouriteComponent,
    WelcomeComponent,
    AppVersion,
    OneSignal,
    InAppBrowser,
    Clipboard,
    Toast


  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
