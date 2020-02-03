import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ISubmit, IUser} from '../../shared/interfaces';
import {AuthService} from '../shared/services/auth.service';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  form: FormGroup;
  submitted = false;
  btnSubmit: ISubmit = {
    email: false,
    password: false
  };
  message: string;

  constructor(public auth: AuthService,
              private router: Router,
              private route: ActivatedRoute
              ) {}

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/admin', 'dashboard'])
    }
    this.route.queryParams.subscribe( (params: Params) => {
      if (params['sessionExpired'] || params['noAuthenticated']) {
        this.message = 'Login to proceed'
      }
    });

    this.form = new FormGroup({
      email: new FormControl(null, [
        Validators.email,
        Validators.required
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6)
      ])
    })
  }

  submit() {
    if (this.form.invalid) {
      this.btnSubmit = {
        email: !!this.form.get('email').errors,
        password: !!this.form.get('password').errors
      };
      return
    }
    this.submitted = true;
    const user: IUser = {
      email: this.form.value.email,
      password: this.form.value.password,
      returnSecureToken: true
    };
    this.auth.login(user).subscribe(() => {
      this.router.navigate(['/admin', 'dashboard']);
      this.btnSubmit = {
        email: false,
        password: false
      };
      this.submitted = false;
    }, () => {
      this.submitted = false;
    })
  }
}
