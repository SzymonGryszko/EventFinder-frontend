import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { CommentPayload } from './comment.payload';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }

  getAllCommentsForEvent(eventId: number): Observable<CommentPayload[]> {
    return this.httpClient.get<CommentPayload[]>(this.baseUrl + 'api/comments/by-event/' + eventId);
  }

  postComment(commentPayload: CommentPayload): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + 'api/comments/', commentPayload);
  }

}
