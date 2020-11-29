import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { EventService } from '../shared/event.service';
import { CreateEventPayload } from './add-event.payload';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {

  addForm: FormGroup;
  createEventPayload: CreateEventPayload;
  today: string;

  constructor(private eventService: EventService, private toastr: ToastrService, private router: Router) { 
    this.createEventPayload = {
      title: '',
      startingDate: '',
      endDate: '',
      description: '',
      city: '',
      address: ''
    }

    this.today = new Date().toISOString().slice(0, 10);

  }

  ngOnInit(): void {
    this.addForm = new FormGroup({
      title: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      startingDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required)
    })
  }

  saveEvent() {
    this.createEventPayload.title = this.addForm.get('title').value;
    this.createEventPayload.address = this.addForm.get('address').value;
    this.createEventPayload.city = this.addForm.get('city').value;
    this.createEventPayload.description = this.addForm.get('description').value;
    this.createEventPayload.startingDate = this.addForm.get('startingDate').value;
    this.createEventPayload.endDate = this.addForm.get('endDate').value;

    this.eventService.saveEvent(this.createEventPayload).subscribe(data => {
      this.toastr.success('Event added successfuly!')
      this.router.navigateByUrl('/my-events');
    }, error => {
      throwError(error);
      this.toastr.error('Oops, something went wrong :( Make sure the data is correct!')
    });

  }

}
