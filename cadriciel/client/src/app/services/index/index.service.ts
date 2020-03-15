import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Message } from '../../../../../common/communication/message';
import { ImageData } from '../../imageData';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'my-auth-token',
    }),
};

@Injectable({
    providedIn: 'root',
})
export class IndexService {
    private readonly DATABASE_URL: string = 'http://localhost:3000/database/Images/';
    constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

    basicGet(): Observable<Message> {
        return this.http.get<Message>(this.DATABASE_URL).pipe(catchError(this.handleError<Message>('basicGet')));
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }

    getAllImages(): Observable<ImageData[]> {
        return this.http.get<ImageData[]>(this.DATABASE_URL);
    }
    getImagesByTags(tags: string[]): Observable<ImageData[]> {
        return this.http.get<ImageData[]>(this.DATABASE_URL + tags);
    }

    deleteImageById(imageId: string) {
        this.http.delete<ImageData>(this.DATABASE_URL + imageId, httpOptions).subscribe(
            (data) => this.displayFeedback('Image supprimée avec succès!'),
            (error) => {
                this.displayFeedback("Erreur lors de la suppression de l'image");
                console.log(error);
            }
        );
    }

    modifyImage(imageData: ImageData) {
        httpOptions.headers = httpOptions.headers.set('Authorization', 'my-new-auth-token');
        this.http.patch<ImageData>(this.DATABASE_URL, imageData, httpOptions).subscribe(data => { });
    }

    populatedBd() {
        this.http.get<any>('http://localhost:3000/database/populateDB').subscribe(data => { });
    }

    saveImage(imageData: ImageData) {
        this.http.post('http://localhost:3000/database/saveImage', imageData, httpOptions).subscribe(
            (data) => {
                this.displayFeedback('Image sauvegardée avec succès');
                console.log(data)
            },
            (error) => {
                this.displayFeedback('Erreur lors de la sauvegarde!');
                console.log(error);
            }
        );
    }

    displayFeedback(message: string) {
        const DURATION = 2500;
        const config = new MatSnackBarConfig();
        config.duration = DURATION;
        this.snackBar.open(message, undefined, config);
    }
}
