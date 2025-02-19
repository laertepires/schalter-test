import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  Observable,
  retry,
  throwError,
  tap,
} from 'rxjs';
import { Product } from '../models/dataModel';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private httpClient: HttpClient) {}

  private cartItems: Product[] = [];

  private cartCountSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  public cartCount$: Observable<number> = this.cartCountSubject.asObservable();
  
  private apiUrl = environment.apiUrl;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  getProducts(): Observable<Product[]> {
    return this.httpClient
      .get<Product[]>(this.apiUrl + '/products')
      .pipe(retry(2), catchError(this.handleError));
  }

  getCart(): Observable<Product[]> {
    return this.httpClient
      .get<Product[]>(this.apiUrl + '/cart')
      .pipe(
        retry(2),
        tap((cart: Product[]) => {
          this.cartItems = cart;
          this.cartCountSubject.next(cart.length);
        }),
        catchError(this.handleError)
      );
  }

  deleteItemCart(productId: number): Observable<Product> {
    return this.httpClient
      .delete<Product>(`${this.apiUrl}/cart/${productId}`, this.httpOptions)
      .pipe(
        retry(1),
        tap(() => {
          const index = this.cartItems.findIndex(item => item.id === productId);
          if (index > -1) {
            this.cartItems.splice(index, 1);
            this.cartCountSubject.next(this.cartItems.length);
          }
        }),
        catchError(this.handleError)
      );
  }

  addProductToCart(product: Product): Observable<Product> {
    return this.httpClient
      .post<Product>(this.apiUrl + '/cart', JSON.stringify(product), this.httpOptions)
      .pipe(
        retry(2),
        tap((addedProduct: Product) => {
          this.cartItems.push(addedProduct);
          this.cartCountSubject.next(this.cartItems.length);
        }),
        catchError(this.handleError)
      );
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage =
        `Código do erro: ${error.status}, mensagem: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
