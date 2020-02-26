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
  public addImage (image : ImageData ): string {
    
    this.http.post<ImageData>('http://localhost:3000/database/Images/', image, httpOptions )
    .subscribe( data => { });
    return 'Ok';
  }
  public pupolatedBd () {
    this.http.get('http://localhost:3000/api/index/populateDB');
  }
}
