import { Component, Inject, ViewEncapsulation, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OktaAuthService } from '@okta/okta-angular';
import * as faceapi from 'face-api.js';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainComponent implements AfterViewInit {

  @ViewChild('video', { static: false }) videoEl: ElementRef;



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


  ngAfterViewInit() {
    this.startVideo();
    this.videoEl.nativeElement.addEventListener('play', () => {
      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(this.videoEl.nativeElement, new faceapi.TinyFaceDetectorOptions())
        if (detections.length > 0) {
          console.log(2);
        }
      }, 100)
    })
  }

  signOutAdmin() {
    this.oktaAuth.signOut()
  }

  isFaceDetectionModelLoaded() {
    return !!this.getCurrentFaceDetectionNet().params
  }

  getCurrentFaceDetectionNet() {
    return faceapi.nets.tinyFaceDetector;
  }


  async startVideo() {
    if (!this.isFaceDetectionModelLoaded()) {
      await faceapi.nets.tinyFaceDetector.loadFromUri('assets/models'),
        await faceapi.nets.faceRecognitionNet.loadFromUri('assets/models')
    }

    navigator.getUserMedia(
      { video: {} },
      stream => this.videoEl.nativeElement.srcObject = stream,
      err => console.error(err)
    )

  }

}

class Person {
  firstName: string;
  lastName: string;
}
