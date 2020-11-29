import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventModel } from '../shared/event-model';
import { EventService } from '../shared/event.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  event$: Array<EventModel> = [];
  cities: Array<String> = [];
  searchForm: FormGroup;

  constructor(private eventService: EventService, private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
   }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      city: new FormControl(''),
      keyWord: new FormControl(''),
    });
    this.fetchData();
  }

  fetchData() {
    this.eventService.getAllEvents().subscribe(event => {
      this.event$ = event;
    })
    this.eventService.getAllCities().subscribe(city => {
      this.cities = city;
    });
  }

  goToEvent(eventId:number): void {
    this.router.navigateByUrl('/view-event/' + eventId);
  }

  search(): void {
    let cityValue: string = this.searchForm.get('city').value;
    let keyWordValue: string = this.searchForm.get('keyWord').value;

    if(cityValue === 'City') {
      cityValue = '';
    }

    this.eventService.getAllEvents(cityValue, keyWordValue).subscribe(event => {
      this.event$ = event;
    });

    cityValue = null;
    keyWordValue = null;

  }

}
