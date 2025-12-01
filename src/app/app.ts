import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LocalStorageService } from './shared/services/local-storage.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('sistema-inventario-ab-front');
  private readonly localStorageService = inject(LocalStorageService);

  ngOnInit() {
    // Inicializar datos de localStorage
    this.localStorageService.initialize();
  }
}
