import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventModel } from './event-model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http:HttpClient) { }

  getAllPost():Observable<Array<EventModel>>{
    return this.http.get<Array<EventModel>>('http://localhost:8080/api/events')
  }

  getEventCities():Observable<Array<String>> {
    return
  }

}
