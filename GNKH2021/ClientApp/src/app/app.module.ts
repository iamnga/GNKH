import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';


import {
  OKTA_CONFIG,
  OktaAuthModule
} from '@okta/okta-angular';
import { OktaCallbackComponent } from '@okta/okta-angular';
import { OktaAuthGuard } from '@okta/okta-angular';
import { AuthInterceptor } from './auth.interceptor';


const CALLBACK_PATH = 'implicit/callback';
const OKTA_DOMAIN = 'dev-7318036.okta.com';
const CLIENT_ID = "0oa2b9qb6llx6dYv85d6";
const ISSUER = `https://${OKTA_DOMAIN}/oauth2/default`;
const HOST = window.location.host;
const REDIRECT_URI = `https://${HOST}/${CALLBACK_PATH}`;
const SCOPES = 'openid profile email';
const config = {
  issuer: ISSUER,
  clientId: CLIENT_ID,
  redirectUri: REDIRECT_URI,
  scope: SCOPES.split(/\s+/),
  pkce: true
};

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent
  ],
  imports: [
    OktaAuthModule,
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, canActivate: [OktaAuthGuard] },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent},
      {
        path: CALLBACK_PATH,
        component: OktaCallbackComponent,
      },
    ])
  ],
  providers: [{ provide: OKTA_CONFIG, useValue: config }],
  //, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  bootstrap: [AppComponent]
})
export class AppModule { }
