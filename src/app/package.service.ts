import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  result!: string;

  constructor(private http: HttpClient) { }

  private apiUrl = 'https://localhost:7074/Packer';

  // Fetches the input data from the API
  public fetchInputData(): Observable<string> {
    const inputUrl = `${this.apiUrl}/inputData`;
    return this.http.get(inputUrl, { responseType: 'text' }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('An error occurred:', error.error);
        return throwError('An error occurred while fetching the input data.');
      })
    );
  }

  // Fetches the output data from the API
  public fetchOutputData(): Observable<string> {
    return this.http.get(this.apiUrl, { responseType: 'text' }).pipe(
      // Maps the response to process and transform the data
      map(response => {
        const result = response.split('(,)');
        return result.length === 0 ? '-' : result.join(',');
      }),
      catchError((error: HttpErrorResponse) => {
        console.log('An error occurred:', error.error);
        return throwError('An error occurred while fetching the output data.');
      })
    );
  }
}
