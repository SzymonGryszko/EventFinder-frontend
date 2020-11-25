import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { throwError } from 'rxjs';
import { CommentPayload } from '../shared/comments/comment.payload';
import { CommentService } from '../shared/comments/comment.service';
import { EventModel } from '../shared/event-model';
import { EventService } from '../shared/event.service';

@Component({
  selector: 'app-view-event',
  templateUrl: './view-event.component.html',
  styleUrls: ['./view-event.component.css']
})
export class ViewEventComponent implements OnInit {

  eventId: number;
  event: EventModel;
  commentForm: FormGroup;
  commentPayload: CommentPayload;
  comments: CommentPayload[];

  constructor(private activateRoute: ActivatedRoute, private eventService: EventService,
    private commentService: CommentService) { 
    this.eventId = this.activateRoute.snapshot.params.eventId;

    this.commentForm = new FormGroup({
      text: new FormControl('', Validators.required)
    });
    this.commentPayload = {
      text: '',
      eventId: this.eventId
    };
  }

  ngOnInit(): void {
    this.getEventById();
    this.getCommentsForEvent();
  }
  getCommentsForEvent() {
    this.commentService.getAllCommentsForEvent(this.eventId).subscribe(data => {
      this.comments = data;
    }, error => {
      throwError(error);
    });
  }
  getEventById() {
    return this.eventService.getEvent(this.eventId).subscribe(data => {
      this.event = data;
    }, error => {
        throwError(error);
    });
  }

  postComment() {
    this.commentPayload.text = this.commentForm.get('text').value;
    this.commentService.postComment(this.commentPayload).subscribe(data => {
      this.commentForm.get('text').setValue('');
      this.getCommentsForEvent();
    }, error => {
      throwError(error);
    });
  }

}
