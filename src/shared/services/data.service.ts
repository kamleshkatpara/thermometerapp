import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Temperature } from './../../app/temperature';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiUrl = '/upload';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  uploadFile(formdata: any): Observable<Temperature> {
    return this.http.post<Temperature>(this.apiUrl, formdata);
  }
}
