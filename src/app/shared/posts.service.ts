import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IFbCreateResponse, IPost} from './interfaces';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private http: HttpClient) {
  }

  create = (post: IPost): Observable<IPost> => {
    return this.http.post<IPost | IFbCreateResponse>(`${environment.fbDbUrl}/posts.json`, post)
      .pipe(map((response: IFbCreateResponse) => {
        return {
          ...post,
          id: response.name,
          date: new Date(post.date)
        };
      }));
  };
  getAll = (): Observable<IPost[]> => {
    return this.http.get(`${environment.fbDbUrl}/posts.json`)
      .pipe(map((res: { [key: string]: any }) => {
        return Object.keys(res).map(key => ({
          ...res[key],
          id: key,
          date: new Date(res[key].date)
        }));
      }));
  };
  remove = (id: string): Observable<void> => {
    return this.http.delete<void>(`${environment.fbDbUrl}/posts/${id}.json`);
  };

  getById = (id: string): Observable<IPost> => {
    return this.http.get<IPost>(`${environment.fbDbUrl}/posts/${id}.json`)
      .pipe(map((post: IPost) => {
        return {
          ...post,
          id,
          date: new Date(post.date)
        };
      }));
  };

  update = (post: IPost): Observable<IPost> => {
    return this.http.patch<IPost>(`${environment.fbDbUrl}/posts/${post.id}.json`, post)
  }

}
