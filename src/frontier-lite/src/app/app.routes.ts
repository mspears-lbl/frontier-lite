import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'equipment',
    loadComponent: () =>
      import('./components/equipment-def-home/equipment-def-home.component').then((m) => m.EquipmentDefHomeComponent),
  },
];
