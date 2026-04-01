import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private firebaseUrl = environment.firebaseUrl;
  constructor(private http: HttpClient) {}
  getLocation(jobCardId: string): Observable<{ latitude: number; longitude: number } | null> {
    const customerType = localStorage.getItem('customerType');
    // if (customerType === 'I' || localStorage.getItem('skipLocationCheck') === 'true') {
    //   return new Observable((observer) => {
    //     observer.next({ latitude: 28.6139, longitude: 77.209 }); // Delhi
    //     observer.complete();
    //   });
    // }
    return this.http
      .get<any>(`${this.firebaseUrl}/${jobCardId}/location.json`)
      .pipe(map((loc) => (loc ? { latitude: loc.latitude, longitude: loc.longitude } : null)));
  }
}
