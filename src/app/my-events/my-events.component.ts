import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { AuthService } from '../auth/shared/auth.service';
import { EventModel } from '../shared/event-model';
import { EventService } from '../shared/event.service';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css']
})
export class MyEventsComponent implements OnInit {

  username: string;
  role: string;
  myEvents = Array<EventModel>();

  constructor(private authService: AuthService, private eventService: EventService,
    private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.authService.username.subscribe((data: string) => this.username = data);
    this.authService.role.subscribe((data: string) => this.role = data);
    this.username = this.authService.getUserName();
    this.role = this.authService.getRole();
    this.getAllEventsForCurrentUser()
  }

  getAllEventsForCurrentUser() {
    if(this.role === 'ROLE_USER') {
      this.eventService.getEventsForUser(this.username).subscribe(data => {
        this.myEvents = data;
      }, error => {
        throwError(error);
      });
    } else if(this.role === 'ROLE_ORGANIZER'){
      this.eventService.getAllEventsForOrganizer(this.username).subscribe(data => {
        this.myEvents = data;
      }, error => {
        throwError(error);
      });
    }
  }

  goToEvent(eventId:number) {
    this.router.navigateByUrl('/view-event/' + eventId);
  }

  updateEvent(eventId:number) {
    this.router.navigateByUrl('edit-event/' + eventId);
  }

  deleteEvent(eventId: number) {
    let wantsToDelete: boolean = confirm("Are you sure you want to delete this event?");
    if (wantsToDelete) {
      this.eventService.deleteEvente(eventId).subscribe(data => {
        this.toastr.success('Event deleted successfully')
        this.getAllEventsForCurrentUser();
      }, error => {
        throwError(error);
        this.toastr.error('Oops, something went wrong :(')
      });
    }
  
  }

}
