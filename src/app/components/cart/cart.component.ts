import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { ApiService } from '../../shared/services/api.service';
import { Product } from '../../shared/models/dataModel';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, MatListModule, MatCardModule, MatIconModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  constructor(private apiService: ApiService) {}
  cartItems: Product[] = [];

  ngOnInit() {
    this.getItemsCart()
  }

  getItemsCart() {
    this.apiService.getCart().subscribe((products: Product[]) => {
      this.cartItems = products;
    });
  }

  removeFromCart(item: Product) {
    this.apiService.deleteItemCart(item.id).subscribe((products: any) => {
      this.getItemsCart()
    });
  }

  finishCart() {
    console.log('Compra finalizada!');
  }
}
