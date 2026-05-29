import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Resume } from './resume/resume';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'resume', component: Resume },
  { path: '**', redirectTo: '' }
];
