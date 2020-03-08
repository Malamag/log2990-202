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
  private readonly BASE_URL: string = 'http://localhost:3000/database/Images/';
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
  getAllImages(): Observable<ImageData[]> {
    return this.http.get<ImageData[]>(this.BASE_URL);
  }
  getImageById(imageId: string): ImageData {
    let ret: ImageData = { id: '', name: '', tags: [], svgElement: "" };
    this.http.get<ImageData>(this.BASE_URL + imageId).subscribe((data) => {
      ret = { id: data.id, name: data.name, tags: data.tags, svgElement: data.svgElement };
    });

    return ret;
  }

  deleteImageById(imageId: string) {
    this.http.delete<ImageData>(this.BASE_URL + imageId, httpOptions).subscribe((data) => { });
  }
  modifyImage(imageData: ImageData) {
    httpOptions.headers = httpOptions.headers.set('Authorization', 'my-new-auth-token');
    this.http.patch<ImageData>(this.BASE_URL, imageData, httpOptions).subscribe((data) => { })
  }

  pupolatedBd() {
    this.http.get<any>('http://localhost:3000/database/populateDB').subscribe((data) => { });
  }

  saveImage(imageData: ImageData) {
    this.http.post('http://localhost:3000/database/saveImage', imageData, httpOptions).subscribe((data) => { });
  }
}
