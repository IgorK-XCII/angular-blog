import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {PostsService} from '../../shared/posts.service';
import {switchMap} from 'rxjs/operators';
import {IPost} from '../../shared/interfaces';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {AlertService} from '../shared/services/alert.service';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit, OnDestroy {

  form: FormGroup;
  post: IPost;
  submitted = false;

  uSub: Subscription;

  constructor(private route: ActivatedRoute,
              private postsService: PostsService,
              private alertService: AlertService
  ) {
  }

  ngOnInit() {
    this.route.params.pipe(switchMap((params: Params) => {
      return this.postsService.getById(params['id']);
    })).subscribe((post: IPost) => {
      this.post = post;
      this.form = new FormGroup({
        title: new FormControl(post.title, Validators.required),
        text: new FormControl(post.text, Validators.required)
      });
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    } else {
      this.submitted = true;
      const {text, title} = this.form.value;
      this.uSub = this.postsService.update({
        ...this.post,
        text,
        title,
      }).subscribe( () => {
      this.submitted = false;
      this.alertService.warning('Post has been updated')
      })
    }
  }

  ngOnDestroy(): void {
    if (this.uSub) {
      this.uSub.unsubscribe();
    }

  }
}
