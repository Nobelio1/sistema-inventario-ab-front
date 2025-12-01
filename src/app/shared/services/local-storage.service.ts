import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private getItem<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private setItem<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  get<T>(key: string): T[] {
    return this.getItem<T>(key);
  }

  set<T>(key: string, data: T[]): void {
    this.setItem(key, data);
  }

  add<T>(key: string, item: Omit<T, 'id'>): T {
    const items = this.getItem<T & { id: number }>(key);
    const newId = items.length > 0
      ? Math.max(...items.map(i => i.id || 0)) + 1
      : 1;
    const newItem = {...item, id: newId} as T;
    items.push(newItem as T & { id: number });
    this.setItem(key, items);
    return newItem;
  }

  update<T extends { id: number }>(key: string, item: T): T {
    const items = this.getItem<T>(key);
    const index = items.findIndex(i => (i as any).id === item.id);
    if (index !== -1) {
      items[index] = item;
      this.setItem(key, items);
    }
    return item;
  }

  delete<T>(key: string, id: number): void {
    const items = this.getItem<T & { id: number }>(key);
    const filtered = items.filter(i => i.id !== id);
    this.setItem(key, filtered);
  }

  getById<T>(key: string, id: number): T | undefined {
    const items = this.getItem<T & { id: number }>(key);
    return items.find(i => i.id === id) as T | undefined;
  }

  initialize(): void {
    if (!localStorage.getItem('initialized')) {
      this.initializeData();
      localStorage.setItem('initialized', 'true');
    }
  }

  private initializeData(): void {
    // Productos iniciales
    const productos = [
      {
        id: 1,
        codigo: 'P001',
        nombre: 'Arroz Superior',
        categoria: 'Granos',
        precio: 3.50,
        stock: 100,
        stockMinimo: 20,
        ubicacion: 'A-01-01',
        estado: 'Activo'
      },
      {
        id: 2,
        codigo: 'P002',
        nombre: 'Aceite Vegetal',
        categoria: 'Aceites',
        precio: 5.80,
        stock: 50,
        stockMinimo: 15,
        ubicacion: 'A-01-02',
        estado: 'Activo'
      },
      {
        id: 3,
        codigo: 'P003',
        nombre: 'Azúcar Blanca',
        categoria: 'Endulzantes',
        precio: 2.50,
        stock: 80,
        stockMinimo: 25,
        ubicacion: 'A-02-01',
        estado: 'Activo'
      },
      {
        id: 4,
        codigo: 'P004',
        nombre: 'Fideos Espagueti',
        categoria: 'Pastas',
        precio: 2.00,
        stock: 120,
        stockMinimo: 30,
        ubicacion: 'A-02-02',
        estado: 'Activo'
      },
      {
        id: 5,
        codigo: 'P005',
        nombre: 'Leche Evaporada',
        categoria: 'Lácteos',
        precio: 3.20,
        stock: 60,
        stockMinimo: 20,
        ubicacion: 'B-01-01',
        estado: 'Activo'
      },
    ];
    this.set('productos', productos);

    // Proveedores iniciales
    const proveedores = [
      {
        id: 1,
        nombre: 'Distribuidora Norte SAC',
        ruc: '20123456789',
        telefono: '987654321',
        email: 'ventas@norte.com',
        direccion: 'Av. Norte 123',
        estado: 'Activo'
      },
      {
        id: 2,
        nombre: 'Alimentos del Sur EIRL',
        ruc: '20987654321',
        telefono: '912345678',
        email: 'contacto@sur.com',
        direccion: 'Jr. Sur 456',
        estado: 'Activo'
      },
      {
        id: 3,
        nombre: 'Mayorista Central SAC',
        ruc: '20456789123',
        telefono: '998877665',
        email: 'ventas@central.com',
        direccion: 'Av. Central 789',
        estado: 'Activo'
      },
    ];
    this.set('proveedores', proveedores);

    // Usuarios iniciales
    const usuarios = [
      {
        id: 1,
        nombre: 'Juan Pérez',
        email: 'admin@tienda.com',
        rol: 'Administrador',
        usuario: 'admin',
        estado: 'Activo'
      },
      {
        id: 2,
        nombre: 'María García',
        email: 'almacen@tienda.com',
        rol: 'Almacenero',
        usuario: 'almacen',
        estado: 'Activo'
      },
      {id: 3, nombre: 'Carlos López', email: 'cajero@tienda.com', rol: 'Cajero', usuario: 'cajero', estado: 'Activo'},
      {
        id: 4,
        nombre: 'Ana Torres',
        email: 'vendedor@tienda.com',
        rol: 'Vendedor',
        usuario: 'vendedor',
        estado: 'Activo'
      },
    ];
    this.set('usuarios', usuarios);

    // Categorías
    const categorias = [
      {id: 1, nombre: 'Granos', descripcion: 'Arroz, quinua, etc.'},
      {id: 2, nombre: 'Aceites', descripcion: 'Aceites vegetales'},
      {id: 3, nombre: 'Endulzantes', descripcion: 'Azúcar, miel, etc.'},
      {id: 4, nombre: 'Pastas', descripcion: 'Fideos y pastas'},
      {id: 5, nombre: 'Lácteos', descripcion: 'Leche, queso, yogurt'},
    ];
    this.set('categorias', categorias);

    // Órdenes, movimientos y salidas vacíos
    this.set('ordenes', []);
    this.set('movimientos', []);
    this.set('salidas', []);
    this.set('ajustes', []);
    this.set('recepciones', []);
  }
}
