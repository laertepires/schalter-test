import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../shared/models/dataModel';
import { ApiService } from '../../shared/services/api.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-products',
  imports: [MatCardModule, CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  constructor(private apiService: ApiService) {}
  private _snackBar = inject(MatSnackBar);

  products: Product[] = [];

  ngOnInit() {
    this.getProducts()
  }

  getProducts() {
    this.apiService.getProducts().subscribe((products: Product[]) => {
      this.products = products
    });
  }

  addToCart(product: Product) {
    this.apiService.addProductToCart(product).subscribe((data: any) => {
      this._snackBar.open("Produto adicionado com sucesso", '', {
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
      console.log('Produto adicionado ao carrinho:', data);
    });
    
  }
}
