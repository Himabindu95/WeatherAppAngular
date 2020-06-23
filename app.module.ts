import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatAutocompleteModule, MatInputModule, MatSelectModule} from '@angular/material';
import { ChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WeatherSearchComponent } from './weather-search/weather-search.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {WeatherSearchService} from './weather-search/weather-search.service';
import { TabsComponent } from './tabs/tabs.component';
import {MatTooltipModule} from '@angular/material/tooltip';
@NgModule({
  declarations: [
    AppComponent,
    WeatherSearchComponent,
    TabsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule,
    ChartsModule,
    MatTooltipModule
  ],
  providers: [WeatherSearchService],
  bootstrap: [AppComponent]
})
export class AppModule { }
