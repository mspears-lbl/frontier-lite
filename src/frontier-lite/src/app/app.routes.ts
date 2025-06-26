import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'equipment',
    pathMatch: 'full',
    loadComponent: () =>
      import('./equipment/components/equipment-home/equipment-home.component').then((m) => m.EquipmentHomeComponent),
  },
  {
    path: 'equipment/create',
    loadComponent: () =>
      import('./equipment/components/create-equipment-home/create-equipment-home.component').then((m) => m.CreateEquipmentHomeComponent),
  },
  {
    path: 'analysis',
    pathMatch: 'full',
    loadComponent: () =>
      import('./analysis/components/analysis-home/analysis-home.component').then((m) => m.AnalysisHomeComponent),
  },
];
