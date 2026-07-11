import { Route } from '@angular/router';
import { ReadmeComponent } from '@app/shared-ui';

export const appRoutes: Route[] = [
  {
    path: '',
    component: ReadmeComponent,
    pathMatch: 'full',
  },
];
