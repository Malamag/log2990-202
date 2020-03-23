import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Observable } from 'rxjs';
import { ImageData } from '../../../../../image-data';

const httpOptions = {
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
        this.http.delete<ImageData>(this.DATABASE_URL + imageId, httpOptions).subscribe(
            (data) => this.displayFeedback('Image supprimée avec succès!'),
            (error) => {
                this.displayFeedback("Erreur lors de la suppression de l'image");
                console.log(error);
            }
        );
    }

    modifyImage(imageData: ImageData): void {
        httpOptions.headers = httpOptions.headers.set('Authorization', 'my-new-auth-token');
        // this.http.patch<ImageData>(this.DATABASE_URL, imageData, httpOptions).subscribe((data) => { });
    }

    populatedBd(): void {
        // this.http.get<ImageData[]>('http://localhost:3000/database/populateDB').subscribe((data) => { });
    }

    saveImage(imageData: ImageData): void {
        this.http.post('http://localhost:3000/database/saveImage', imageData, httpOptions).subscribe(
            (data) => {
                this.displayFeedback('Image sauvegardée avec succès');
                console.log(data);
            },
            (error) => {
                this.displayFeedback('Erreur lors de la sauvegarde!');
                console.log(error);
            }
        );
    }

    private displayFeedback(message: string): void {
        const DURATION = 2500;
        const config = new MatSnackBarConfig();
        config.duration = DURATION;
        this.snackBar.open(message, undefined, config);
    }
}
