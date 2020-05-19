import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

const endpoint = 'https://delivery-gt.com';
//const endpoint = 'http://localhost:3001';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private httpClient: HttpClient) { }

  private extractData(response: Response) {
    let body = response;
    return body || { };
  }

  http(){
    return this.httpClient;
  }

  getEndpoint(){
    return endpoint;
  }

  gethttp(url): Observable<any> {
    return this.httpClient.get(endpoint + url).pipe(
      map(this.extractData));
  }

  posthttp(url, data): Observable<any> {
    return this.httpClient.post(endpoint + url,JSON.stringify(data), httpOptions).pipe(
      tap(_ => console.log(`posted =${url}`)),
      catchError(this.handleError<any>('post'))
    );
  }

  puthttp(url, data): Observable<any> {
    return this.httpClient.put(endpoint + url, JSON.stringify(data), httpOptions).pipe(
      tap(_ => console.log(`updated =${url}`)),
      catchError(this.handleError<any>('put'))
    );
  }

  deletehttp(url): Observable<any> {
    return this.httpClient.delete(endpoint + url, httpOptions).pipe(
      tap(_ => console.log(`deleted =${url}`)),
      catchError(this.handleError<any>('delete'))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

}
