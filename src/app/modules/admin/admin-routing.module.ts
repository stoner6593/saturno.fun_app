import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NopagefoundComponent } from '../../pages/nopagefound/nopagefound.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TablesComponent } from './tables/tables.component';
import { WaitersComponent } from './waiters/waiters.component';
import { CompaniesComponent } from './companies/companies.component';
import { TicketsComponent } from './tickets/tickets.component';
import { SectionsComponent } from './sections/sections.component';
import { WizardComponent } from './wizard/wizard.component';
import { PollComponent } from './poll/poll.component';
import { AboutComponent } from './about/about.component';

const userRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'wizard', component: WizardComponent },
  { path: 'companies', component: CompaniesComponent },
  { path: 'sections', component: SectionsComponent },
  { path: 'tables', component: TablesComponent },
  { path: 'waiters', component: WaitersComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'tickets', component: TicketsComponent },
  { path: 'poll', component: PollComponent },
  { path: 'about', component: AboutComponent },


	{ path: '', redirectTo: '/admin/home', pathMatch: 'full' },
  { path: '**', component: NopagefoundComponent}

];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(userRoutes)], 
  exports: [RouterModule]
})
export class AdminRoutingModule { }
