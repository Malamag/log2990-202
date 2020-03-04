import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Message } from '../../../../../common/communication/message';
import { ImageData } from '../../imageData';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
}

@Injectable({
  providedIn: 'root'
})
export class IndexService {
 private readonly BASE_URL: string = 'http://localhost:3000/api/index';
  constructor(private http: HttpClient) {
  }
  basicGet(): Observable<Message> {
      return this.http.get<Message>(this.BASE_URL).pipe(catchError(this.handleError<Message>('basicGet')));
  }
  private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
      return (error: Error): Observable<T> => {
          return of(result as T);
      };
  }
  getAllImages(): Observable<ImageData[]>{
    return this.http.get<ImageData[]>('http://localhost:3000/database/Images/')
  }
  getImageById(imageId: string): ImageData {
    let ret: ImageData = {id: '', name: '', tags: []};
    this.http.get<ImageData>('http://localhost:3000/database/Images/' + imageId).subscribe( (data) => {
       ret = {id: data.id, name: data.name, tags: data.tags}
    });
    return ret;
  }
  addImage(imageData: ImageData ): string {

    this.http.post<ImageData>('http://localhost:3000/database/Images/', imageData, httpOptions )
    .subscribe( (data) => { });
    return 'Ok';
  }

  deleteImageById(imageId: string) {
    this.http.delete<ImageData>('http://localhost:3000/database/Images/' + imageId, httpOptions).subscribe( (data) => {});
  }
  modifyImage(imageData: ImageData) {
    httpOptions.headers = httpOptions.headers.set('Authorization', 'my-new-auth-token');
    this.http.patch<ImageData>('http://localhost:3000/database/Images/', imageData, httpOptions).subscribe( (data) => {})
  }

  pupolatedBd() {
    this.http.get<any>('http://localhost:3000/database/populateDB').subscribe( (data) => { });
  }
}
