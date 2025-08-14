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
    path: 'equipment/groups',
    loadComponent: () =>
      import('./equipment/components/equipment-collection-list/equipment-collection-list.component').then((m) => m.EquipmentCollectionListComponent),
  },
  {
    path: 'equipment/edit/:id',
    loadComponent: () =>
      import('./equipment/components/edit-equipment-info/edit-equipment-info.component').then((m) => m.EditEquipmentInfoComponent),
  },
  {
    path: 'analysis',
    pathMatch: 'full',
    loadComponent: () =>
      import('./analysis/components/analysis-home/analysis-home.component').then((m) => m.AnalysisHomeComponent),
  },
];
