import { Pipe, PipeTransform } from '@angular/core';
import {IPost} from '../../shared/interfaces';

@Pipe({
  name: 'searchPost'
})
export class SearchPipe implements PipeTransform {

  transform(posts: IPost[], search = ''): IPost[] {
    if (!search.trim()) {
      return posts;
    } else {
      return posts.filter(
        (post) => post.title.toLowerCase().includes(search.toLowerCase())
      )
    }
  }

}
