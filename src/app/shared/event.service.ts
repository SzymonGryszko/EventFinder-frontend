import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateEventPayload } from '../add-event/add-event.payload';
import { EventModel } from './event-model';
import { SignupOrResignEventPayload } from './event/signupforevent.payload';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http:HttpClient) { }

  resignFromEvent(signupForEventRequestPayload: SignupOrResignEventPayload): Observable<any> {
    return this.http.put<any>('http://localhost:8080/api/events/resign', signupForEventRequestPayload);
  }

  updateEvent(eventId: number, event: CreateEventPayload): Observable<any> {
    return this.http.put('http://localhost:8080/api/events/update/' + eventId, event);
  }

  deleteEvente(eventId: number): Observable<any> {
    return this.http.delete('http://localhost:8080/api/events/' + eventId);
  }

  saveEvent(createEventPayload: CreateEventPayload): Observable<any> {
    return this.http.post<any>('http://localhost:8080/api/events', createEventPayload);
  }

  getAllEvents(...requestParams: string[]):Observable<Array<EventModel>>{
        let params = new HttpParams();
        params = params.append('city', requestParams[0]);
        params = params.append('keyWord', requestParams[1]);
        return this.http.get<Array<EventModel>>('http://localhost:8080/api/events', {params: params})
  }

  getEvent(eventId: number): Observable<EventModel> {
    return this.http.get<EventModel>('http://localhost:8080/api/events/' + eventId);
  }

  getAllCities():Observable<Array<String>> {
    return this.http.get<Array<String>>('http://localhost:8080/api/events/cities')
  }

  signupUserForEvent(signupForEventRequestPayload: SignupOrResignEventPayload): Observable<any> {
    return this.http.post<any>('http://localhost:8080/api/events/eventSignup', signupForEventRequestPayload);
  }

  getEventsForUser(name: string): Observable<Array<EventModel>> {
    return this.http.get<Array<EventModel>>('http://localhost:8080/api/events/my-events/' + name);
  }

  getAllEventsForOrganizer(name: string): Observable<Array<EventModel>> {
    return this.http.get<Array<EventModel>>('http://localhost:8080/api/events/by-organizer/' + name);
  }

}
