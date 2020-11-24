import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { throwError } from 'rxjs';
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

  constructor(private activateRoute: ActivatedRoute, private eventService: EventService) { 
    this.eventId = this.activateRoute.snapshot.params.eventId;
  }

  ngOnInit(): void {
    this.getEventById();
  }
  getEventById() {
    return this.eventService.getEvent(this.eventId).subscribe(data => {
      this.event = data;
    }, error => {
        throwError(error);
    });
  }

}
