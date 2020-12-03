import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { CreateEventPayload } from '../add-event/add-event.payload';
import { EventModel } from './event-model';
import { SignupOrResignEventPayload } from './event/signupforevent.payload';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  baseUrl = environment.baseUrl;

  constructor(private http:HttpClient) { }

  resignFromEvent(signupForEventRequestPayload: SignupOrResignEventPayload): Observable<any> {
    return this.http.put<any>(this.baseUrl + 'api/events/resign', signupForEventRequestPayload);
  }

  updateEvent(eventId: number, event: CreateEventPayload): Observable<any> {
    return this.http.put(this.baseUrl + 'api/events/update/' + eventId, event);
  }

  deleteEvente(eventId: number): Observable<any> {
    return this.http.delete(this.baseUrl + 'api/events/' + eventId);
  }

  saveEvent(createEventPayload: CreateEventPayload): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'api/events', createEventPayload);
  }

  getAllEvents(...requestParams: string[]):Observable<Array<EventModel>>{
        let params = new HttpParams();
        params = params.append('city', requestParams[0]);
        params = params.append('keyWord', requestParams[1]);
        return this.http.get<Array<EventModel>>(this.baseUrl + 'api/events', {params: params})
  }

  getEvent(eventId: number): Observable<EventModel> {
    return this.http.get<EventModel>(this.baseUrl + 'api/events/' + eventId);
  }

  getAllCities():Observable<Array<String>> {
    return this.http.get<Array<String>>(this.baseUrl + 'api/events/cities')
  }

  signupUserForEvent(signupForEventRequestPayload: SignupOrResignEventPayload): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'api/events/eventSignup', signupForEventRequestPayload);
  }

  getEventsForUser(name: string): Observable<Array<EventModel>> {
    return this.http.get<Array<EventModel>>(this.baseUrl + 'api/events/my-events/' + name);
  }

  getAllEventsForOrganizer(name: string): Observable<Array<EventModel>> {
    return this.http.get<Array<EventModel>>(this.baseUrl + 'api/events/by-organizer/' + name);
  }

}
