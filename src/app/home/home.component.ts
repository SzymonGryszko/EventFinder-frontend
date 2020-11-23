import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EventModel } from '../shared/event-model';
import { PostService } from '../shared/event.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  event$: Array<EventModel> = [];
  searchForm: FormGroup;

  constructor(private postService: PostService) {
    this.postService.getAllPost().subscribe(event => {
      this.event$ = event;
      console.log(event);
    })
   }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      city: new FormControl(''),
      keyWord: new FormControl(''),
    });
  }

  goToPost(postId:number) {

  }

  search() {
    
  }

}
