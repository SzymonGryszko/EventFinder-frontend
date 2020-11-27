import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { AuthService } from '../auth/shared/auth.service';
import { CommentPayload } from '../shared/comments/comment.payload';
import { CommentService } from '../shared/comments/comment.service';
import { EventModel } from '../shared/event-model';
import { EventService } from '../shared/event.service';
import { SignupForEventPayload } from '../shared/event/signupforevent.payload';

@Component({
  selector: 'app-view-event',
  templateUrl: './view-event.component.html',
  styleUrls: ['./view-event.component.css']
})
export class ViewEventComponent implements OnInit {

  isLoggedIn: boolean;
  currentUsername: string;
  currentEventId: number;
  event: EventModel;
  commentForm: FormGroup;
  commentPayload: CommentPayload;
  comments: CommentPayload[];
  placeHolder: string;
  signupForEventPayload: SignupForEventPayload;

  constructor(private activateRoute: ActivatedRoute, private eventService: EventService,
    private commentService: CommentService, private authService: AuthService,
    private toastr: ToastrService) { 
    this.currentEventId = this.activateRoute.snapshot.params.eventId;

    this.signupForEventPayload = {
      username: '',
      eventId: null
    }

    this.commentForm = new FormGroup({
      text: new FormControl('', Validators.required)
    });
    this.commentPayload = {
      text: '',
      eventId: this.currentEventId
    };
    
    this.isLoggedIn = this.authService.isLoggedIn();
    this.currentUsername = this.authService.getUserName();
    this.authService.loggedIn.subscribe((data: boolean) => this.isLoggedIn = data);
    this.authService.username.subscribe((data: string) => this.currentUsername = data);
    if(this.isLoggedIn === false || this.isLoggedIn === undefined) {
      this.commentForm.disable();
      this.placeHolder = 'You need to log in to comment'
    } else {
      this.commentForm.enable();
      this.placeHolder = 'Comments?'
    }

  }

  ngOnInit(): void {
    this.getEventById();
    this.getCommentsForEvent();
    this.getEventsForUser();
  }

  getEventsForUser() {
    
  }

  getCommentsForEvent() {
    this.commentService.getAllCommentsForEvent(this.currentEventId).subscribe(data => {
      this.comments = data;
    }, error => {
      throwError(error);
    });
  }
  getEventById() {
    return this.eventService.getEvent(this.currentEventId).subscribe(data => {
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
      this.toastr.success("Comment posted!")
    }, error => {
      throwError(error);
      this.toastr.error("Oops! Something went wrong :(")
    });
  }

  signUpForEvent() {
    this.signupForEventPayload.username = this.authService.getUserName();
    this.signupForEventPayload.eventId = this.currentEventId;
    this.eventService.signupUserForEvent(this.signupForEventPayload)
      .subscribe(data => {
        this.toastr.success("Signup successful");
        
      }, error => {
        throwError(error);
        this.toastr.error("Oops! Something went wrong :(")
      });
  }

}
