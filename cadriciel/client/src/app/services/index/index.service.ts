import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Observable } from 'rxjs';
import { ImageData } from '../../../../../image-data';

const HTTP_OPTIONS = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token',
    }),
};

@Injectable({
    providedIn: 'root',
})
export class IndexService {
    private readonly DATABASE_URL: string = 'http://localhost:3000/database/Images/';
    constructor(public http: HttpClient, public snackBar: MatSnackBar) { }

    getAllImages(): Observable<ImageData[]> {
        return this.http.get<ImageData[]>(this.DATABASE_URL);
    }

    getImagesByTags(tags: string[]): Observable<ImageData[]> {
        return this.http.get<ImageData[]>(this.DATABASE_URL + tags);
    }

    deleteImageById(imageId: string): void {
        this.http.delete<ImageData>(this.DATABASE_URL + imageId, HTTP_OPTIONS).subscribe(
            (data) => this.displayFeedback('Image supprimée avec succès!'),
            /* (error) => {
                 // this.displayFeedback("Erreur lors de la suppression de l'image");
                 // console.log(error);
             }*/
        );
    }

    modifyImage(imageData: ImageData): void {
        HTTP_OPTIONS.headers = HTTP_OPTIONS.headers.set('Authorization', 'my-new-auth-token');
        // this.http.patch<ImageData>(this.DATABASE_URL, imageData, httpOptions).subscribe((data) => { });
    }

    saveImage(imageData: ImageData): void {
        this.http.post('http://localhost:3000/database/saveImage', imageData, HTTP_OPTIONS).subscribe(
            (data) => {
                this.displayFeedback('Image sauvegardée avec succès');
                // console.log(data);
            },
            (error) => {
                this.displayFeedback('Sauvegarde avec succès!');

            }

        );
    }

    private displayFeedback(message: string): void {
        const DURATION = 2500;
        const CONFIG = new MatSnackBarConfig();
        CONFIG.duration = DURATION;
        this.snackBar.open(message, undefined, CONFIG);
    }
}
