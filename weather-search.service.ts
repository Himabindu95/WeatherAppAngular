import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

import { WeatherSearch } from './weather-search';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class WeatherSearchService {

    constructor(private http: HttpClient) {
    }

    getAutoCompleteValues(cityValue: any): Observable<WeatherSearch[]> {
      return this.http.get<WeatherSearch[]>('/api/cityAutoComplete', {params: cityValue});
    }

    getCurrentLocation(): Observable<WeatherSearch[]> {
      return this.http.get<WeatherSearch[]>('http://ip-api.com/json');
    }

    getSearchResultsService(formValues: any): Observable<WeatherSearch[]> {
      return this.http.get<WeatherSearch[]>('/api/searchResults', {params: formValues});
    }

    getCurrentWeather(latlongval: any): Observable<WeatherSearch[]> {
      return this.http.get<WeatherSearch[]>('/api/currentWeather', {params: latlongval});
    }

    getStateSeal(state: any): Observable<WeatherSearch[]> {
      return this.http.get<WeatherSearch[]>('/api/stateSeal', {params: state});
    }

    getWeeklyWeather(latlongtime: any): Observable<WeatherSearch[]> {
      return this.http.get<WeatherSearch[]>('/api/weeklyWeather', {params: latlongtime});
    }
}
