import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { OktaAuthService } from '@okta/okta-angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent {
  public isAuthenticated: boolean;
  constructor(public oktaAuth: OktaAuthService, private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    // get authentication state for immediate use
    this.oktaAuth.isAuthenticated().then(result => {
      this.isAuthenticated = result;
    });
    // subscribe to authentication state changes
    this.oktaAuth.$authenticationState.subscribe(
      (isAuthenticated: boolean) => this.isAuthenticated = isAuthenticated
    );

    const accessToken = this.oktaAuth.getAccessToken();

    http.get<Person[]>(this.baseUrl + 'api/People', { headers: { Authorization: 'Bearer ' + accessToken } }).subscribe(result => { console.log(result); }, err => { });


  }

  signOutAdmin() {
    this.oktaAuth.signOut()
  }
}

class Person {
  firstName: string;
  lastName: string;
}
