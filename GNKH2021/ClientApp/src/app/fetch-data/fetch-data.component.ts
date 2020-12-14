import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OktaAuthService } from '@okta/okta-angular';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'
})
export class FetchDataComponent implements OnInit {
  public forecasts: WeatherForecast[];
  public isAuthenticated: boolean;

  constructor(public oktaAuth: OktaAuthService, private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    this.oktaAuth.isAuthenticated().then(result => {
      this.isAuthenticated = result;
    });

    // subscribe to authentication state changes
    this.oktaAuth.$authenticationState.subscribe(
      (isAuthenticated: boolean) => this.isAuthenticated = isAuthenticated
    );

  }

  async ngOnInit() {
    const accessToken = this.oktaAuth.getAccessToken();
    this.http.get<WeatherForecast[]>(this.baseUrl + 'weatherforecast', { headers: { Authorization: 'Bearer ' + accessToken } }).subscribe(result => {
      this.forecasts = result;
    }, error => console.error(error));
  }
}

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}
