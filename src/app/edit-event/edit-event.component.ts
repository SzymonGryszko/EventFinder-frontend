import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { CreateEventPayload } from '../add-event/add-event.payload';
import { EventModel } from '../shared/event-model';
import { EventService } from '../shared/event.service';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit {

  editForm: FormGroup;
  today: string;
  currentEventId: number;
  eventBeforeUpdates: EventModel;
  eventAfterUpdates: CreateEventPayload;

  constructor(private activateRoute: ActivatedRoute, private eventService: EventService,
    private toastr: ToastrService, private router: Router) { 
    this.today = new Date().toISOString().slice(0, 10);
    this.currentEventId = this.activateRoute.snapshot.params.eventId;

    this.eventAfterUpdates = {
      title: '',
      startingDate: '',
      endDate: '',
      description: '',
      city: '',
      address: ''
    }
  }

  ngOnInit(): void {
    this.editForm= new FormGroup({
      title: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      startingDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required)
    })

    this.getEventById();

  }

  updateEvent(){
    this.eventAfterUpdates.title = this.editForm.get('title').value;
    this.eventAfterUpdates.address = this.editForm.get('address').value;
    this.eventAfterUpdates.city = this.editForm.get('city').value;
    this.eventAfterUpdates.description = this.editForm.get('description').value;
    this.eventAfterUpdates.startingDate = this.editForm.get('startingDate').value;
    this.eventAfterUpdates.endDate = this.editForm.get('endDate').value;

    this.eventService.updateEvent(this.currentEventId, this.eventAfterUpdates).subscribe(data => {
      this.toastr.success('Event updated')
      this.router.navigateByUrl('/my-events');
    }, error => {
      throwError(error);
      this.toastr.error('Unable to update the event');
    })

  }

  getEventById() {
    return this.eventService.getEvent(this.currentEventId).subscribe(data => {
      this.eventBeforeUpdates = data;
    }, error => {
        throwError(error);
    });
  }

}
