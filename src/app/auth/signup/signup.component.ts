import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../shared/auth.service';
import { SignupRequestPayload } from './signup-request.payload';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupRequestPayload: SignupRequestPayload;
  signupForm: FormGroup;

  constructor(private authService: AuthService, private router: Router,
    private toastr: ToastrService) { 
    this.signupRequestPayload = {
      username: '',
      email: '',
      password: '',
      accountRole: ''
    }
  }

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(30),
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,30}')]
        ),
      accountRole: new FormControl('', Validators.required)
    });
  }

  signup(){
    this.signupRequestPayload.username = this.signupForm.get('username').value;
    this.signupRequestPayload.email = this.signupForm.get('email').value;
    this.signupRequestPayload.password = this.signupForm.get('password').value;
    this.signupRequestPayload.accountRole = this.signupForm.get('accountRole').value;

    this.authService.signup(this.signupRequestPayload)
     .subscribe(data => {
        this.router.navigate(['/login'], 
        { queryParams: { registered: 'true' } });
     }, (error: HttpErrorResponse) => {
       if (error.status === 409) {
          this.toastr.error('Username already exists')
       } else {
        console.log(error);
        this.toastr.error('Registration Failed! Try again');
       }
     });

  }

}
