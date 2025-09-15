import { Routes } from '@angular/router';
import { ProjectAnalysisHomeComponent } from './analysis/components/project-analysis-home/project-analysis-home.component';
import { AddEquipmentStrategyComponent } from './analysis/components/add-equipment-strategy/add-equipment-strategy.component';
import { AddThreatEquipmentComponent } from './analysis/components/add-threat-equipment/add-threat-equipment.component';
import { AddThreatStrategyComponent } from './analysis/components/add-threat-strategy/add-threat-strategy.component';
import { EditThreatStrategyComponent } from './analysis/components/edit-threat-strategy/edit-threat-strategy.component';

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
    {
        path: 'analysis/:id',
        pathMatch: 'full',
        loadComponent: () =>
            import('./analysis/components/project-analysis-home/project-analysis-home.component').then((m) => m.ProjectAnalysisHomeComponent),
    },
    {
        path: 'analysis/:projectId/strategy/:threatId/:strategyId',
        component: EditThreatStrategyComponent,
    },
    {
        path: 'analysis/:id/equipment-strategy/:threatId',
        component: AddEquipmentStrategyComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'threat-equipment'
            },
            {
                path: 'threat-equipment',
                component: AddThreatEquipmentComponent
            },
            {
                path: 'threat-strategy/:equipmentId',
                component: AddThreatStrategyComponent
            },
        ],
    }
];
