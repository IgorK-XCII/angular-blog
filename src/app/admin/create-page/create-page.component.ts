import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {IPost} from '../../shared/interfaces';
import {PostsService} from '../../shared/posts.service';
import {AlertService} from '../shared/services/alert.service';
import {Subscription} from 'rxjs';

interface IFormValid {
  title: boolean,
  text: boolean,
  author: boolean
}

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.scss']
})
export class CreatePageComponent implements OnInit, OnDestroy {

  form: FormGroup;
  pSub: Subscription;
  formValid: IFormValid = {
    title: false,
    text: false,
    author: false
  };

  constructor(private postsService: PostsService,
              private alertService: AlertService
              ) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, Validators.required),
      text: new FormControl(null, Validators.required),
      author: new FormControl(null, Validators.required)
    })
  }
  submit() {
    if (this.form.invalid) {
      this.formValid = {
        title: this.form.get('title').invalid,
        text: this.form.get('text').invalid,
        author: this.form.get('author').invalid
<<<<<<< HEAD
      };
=======
      }
>>>>>>> 2948b80... Initial commit
      return
    }
    const {author, text, title} = this.form.value;
    const post: IPost = {
      author: author,
      date: new Date(),
      text: text,
      title: title
    };
    this.pSub = this.postsService.create(post).subscribe( () => {
      this.form.reset();
      this.alertService.success('Post has been created!')
    });
  }

  ngOnDestroy(): void {
    if (this.pSub) {
      this.pSub.unsubscribe();
    }
  }
}
