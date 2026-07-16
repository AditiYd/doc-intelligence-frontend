import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'upload', pathMatch: 'full' },
  {
    path: 'upload',
    loadComponent: () =>
      import('./features/upload/upload.component').then(m => m.UploadComponent)
  },
  {
    path: 'documents',
    loadComponent: () =>
      import('./features/document-list/document-list.component').then(m => m.DocumentListComponent)
  },
  {
    path: 'documents/:id',
    loadComponent: () =>
      import('./features/document-detail/document-detail.component').then(m => m.DocumentDetailComponent)
  },
  {
    path: 'stats',
    loadComponent: () =>
      import('./features/stats/stats.component').then(m => m.StatsComponent)
  }
];
