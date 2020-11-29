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
import { SignupOrResignEventPayload } from '../shared/event/signupforevent.payload';

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
  signupOrResignEventPayload: SignupOrResignEventPayload;
  eventsForGivenUser: Array<EventModel> = [];
  isAlreadySignedUp: boolean;

  constructor(private activateRoute: ActivatedRoute, private eventService: EventService,
    private commentService: CommentService, private authService: AuthService,
    private toastr: ToastrService) { 
    this.currentEventId = this.activateRoute.snapshot.params.eventId;

    this.signupOrResignEventPayload = {
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
    if(this.isLoggedIn) {
      this.eventService.getEventsForUser(this.currentUsername).subscribe(data => {
        this.eventsForGivenUser = data;
        this.isAlreadySignedUp = this.checkIfUserIsAlreadySignedUp(data);
      });
    }
  }

  checkIfUserIsAlreadySignedUp(allUserEvents: Array<EventModel>): boolean{
    return allUserEvents.map(object => String(object.eventId)).includes(String(this.currentEventId));
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
    if(this.isLoggedIn && !this.isAlreadySignedUp) {

    this.signupOrResignEventPayload.username = this.authService.getUserName();
    this.signupOrResignEventPayload.eventId = this.currentEventId;

    this.eventService.signupUserForEvent(this.signupOrResignEventPayload)
      .subscribe(data => {
        this.isAlreadySignedUp = true;
        this.toastr.success("Signup successful");
        this.getEventById();
      }, error => {
        throwError(error);
        this.toastr.error("Oops! Something went wrong :(")
      });
    }
  }

  resignFromEvent() {
    if(this.isLoggedIn && this.isAlreadySignedUp) {
      this.signupOrResignEventPayload.username = this.authService.getUserName();
      this.signupOrResignEventPayload.eventId = this.currentEventId;

      this.eventService.resignFromEvent(this.signupOrResignEventPayload).subscribe(data => {
        this.isAlreadySignedUp = false;
        this.toastr.success('Sad to see you go :(')
        this.getEventById();
      }, error => {
        throwError(error);
        this.toastr.error("Oops! Something went wrong :(")
      });

    }
  }

}
