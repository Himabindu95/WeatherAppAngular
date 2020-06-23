import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import {TooltipPosition} from '@angular/material/tooltip';

import { WeatherSearchService } from './weather-search.service';
import { HttpErrorResponse } from '@angular/common/http';
import * as CanvasJS from '../canvasjs.min';
import { WeatherSearch } from './weather-search';

@Component({
  selector: 'app-weather-search',
  templateUrl: './weather-search.component.html',
  styleUrls: ['./weather-search.component.css']
})
export class WeatherSearchComponent implements OnInit {
  constructor(private weatherSearchService: WeatherSearchService) { }

// Tooltip variables
  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  positionBottom = this.positionOptions[0];
  positionTop = this.positionOptions[1];
// Tooltip variables

// globally used variables
  stateValue: { state: any; };
  cityValue: any;
// globally used variables

// Error Variable
  errorDiv: string;
  isDisabled = true;
// Error Variable

// Search Variables
  latValue: any;
  longValue: any;
  streetValue: any;
  latitude: any;
  longitude: any;
// Search Variables

// Auto Complete Variables
  cityValueObject: { city: string; };
  autoCompleteValues: any;
  showAutocomplete: boolean;
// Auto Complete Variables

// Form Variables
  formvalues: any;
  currentLocationJson: any;
// Form Variables

// Conditions
  displayCondition: string;
  favoritesClicked = false;
// Conditions

// Changing Data
  message: any;
  simpleObservable: Observable<any>;
// Changing Data

// Results tab
// Current tab variables
  stateSeal: any;
  timezone: any;
  summary: any;
  temperature: any;
  humidity: any;
  pressure: any;
  windSpeed: any;
  visibility: any;
  cloudCover: any;
  ozone: any;
  currentWeather: any;
  formCurrentvalues: any;
// Current tab variables

// Hourly tab variables
  hourlyTempeature = [];
  hourlyPressure = [];
  hourlyHumidity = [];
  hourlyOzone = [];
  hourlyVisibility = [];
  hourlyWindSpeed = [];
  barChartOptions: any;
  barChartLabels: any;
  barChartLegend: any;
  barChartData: any;
  barChartType: any;
  graph = false;
// Hourly tab variables

// Weekly tab variables
  modalid = false;
  dateOfTheWeek: any;
  week: any[];
  interval: any[];
  utctimestamp: any;
  comedy: any;
  anon: any;
// Weekly tab variables

// Modal Window variables
  modalTemp: any;
  modalSummary: any;
  modalIcon: any;
  modalPrecipitation: any;
  modalRain: any;
  modalWindSpeed: any;
  modalHumidity: any;
  modalVisibility: any;
  modalUTCDate: any;
  modalDate: any;
  modalImgsrc: string;
// Modal Window variables

// Favorites and Local Storage Variables
  storedNames: any;
  localStorageValue: string;
  localStorageFormValues: any;
  localStorageForm: any;
  favCity: any;
  favState: any;
  favArray: any;
  favEachArray = [];
  favCityFormValues: any;
  star = 'star_border';
// Favorites and Local Storage Variables

  ngOnInit() {}

// Auto complete functionality begins
  inputCity(cityInputValue: string) {
    if (cityInputValue.length === 0) {
      this.showAutocomplete = false;
    }
    const pattern = /^[A-Za-z\s]+$/;
    if (pattern.test(cityInputValue) && cityInputValue !== '') {
      this.showAutocomplete = true;
      this.cityValueObject = { city : cityInputValue };
      this.weatherSearchService.getAutoCompleteValues(this.cityValueObject).subscribe((autocompleteData) => {
        const autoCompleteJson = JSON.parse(autocompleteData.toString());
        if (autoCompleteJson.status  !== 'ZERO_RESULTS' || autoCompleteJson.predictions.length !== 0) {
        this.autoCompleteValues = [];
        for (let i = 0; i < 5 ; i++) {
          this.autoCompleteValues.push(autoCompleteJson.predictions[i].structured_formatting.main_text);
        }
      }
      });
  }
}
// Auto complete functionality ends

// Current Location begins
  currentLocation() {
    const element = document.getElementById('currentloc') as HTMLInputElement;
    const isChecked = element.checked;
    if (isChecked) {
      this.isDisabled = false;
      this.weatherSearchService.getCurrentLocation().subscribe((currentLocationData) => {
        this.currentLocationJson = currentLocationData;
        this.formCurrentvalues = { q1: this.currentLocationJson.lat,
                            q2: this.currentLocationJson.lon,
                            q3: this.currentLocationJson.city,
                            q4: this.currentLocationJson.region
                        };
      });
    } else {
      this.isDisabled = true;
    }
  }
// Current Location ends

// On Search functionality begins
  onSearchResults(form: NgForm) {
    if (form.value.city in localStorage || this.formCurrentvalues.q3 in localStorage) {
       this.star = 'star_filled';
     } else {
       this.star = 'star_border';
     }

    const favElement = document.getElementById('fav') as HTMLButtonElement;
    favElement.style.backgroundColor = 'white';
    favElement.style.color = 'black';
    const resultElement = document.getElementById('res') as HTMLButtonElement;
    resultElement.style.backgroundColor = '#6D91A9';
    resultElement.style.color = 'white';
    this.displayCondition = 'displayprogressbar';
    this.favoritesClicked = false;
    const currentLocElement = document.getElementById('currentloc') as HTMLInputElement;
    const isChecked = currentLocElement.checked;

    if (isChecked) {
      this.latValue = this.formCurrentvalues.q1;
      this.longValue = this.formCurrentvalues.q2;
      this.cityValue = this.formCurrentvalues.q3;
      this.stateValue = {state: this.formCurrentvalues.q4};
      this.simpleObservable = new Observable((observer) => {
        observer.next(this.formCurrentvalues);
        observer.complete();
    });
      this.getSeal(this.stateValue);
      this.retrieveResults();

    } else {
      if (form.value.street === '' || form.value.city === '' || form.value.state === '' ||
      form.value.street === null || form.value.city === null || form.value.state === null ) {
        this.displayCondition = 'emptyForm';
        this.errorDiv = 'Please enter a valid address.';
      } else {
          this.formvalues = {q1: form.value.street, q2 : form.value.city, q3: form.value.state};
          this.streetValue = this.formvalues.q1;
          this.cityValue = this.formvalues.q2;
          this.stateValue = {state: this.formvalues.q3};
          this.simpleObservable = new Observable((observer) => {
            observer.next(this.formvalues);
            observer.complete();
          });
          this.getSeal(this.stateValue);
          this.retrieveResults();
      }
    }
  }
// On Search functionality begins

// State Seal functionality
  getSeal(stateSealValue) {
    this.weatherSearchService.getStateSeal(stateSealValue).subscribe((stateSeal) => {
      const stateSealJson = JSON.parse(stateSeal.toString());
      this.stateSeal = stateSealJson.items[0].link;
    });
  }
// State Seal functionality

// Retrieve results functionality
  retrieveResults() {
    this.simpleObservable.subscribe(message => {
      this.formvalues = message;
    });
    this.weatherSearchService.getSearchResultsService(this.formvalues).subscribe((currentLocationData) => {
      const geoCodingJson = JSON.parse(currentLocationData.toString());
      if (geoCodingJson.status !== 'ZERO_RESULTS' || geoCodingJson.results.length !== 0 ) {
      this.message = geoCodingJson.results[0].geometry.location;
      this.simpleObservable = new Observable((observer) => {
          observer.next(this.message);
          observer.complete();
      });
      this.simpleObservable.subscribe(message => {
        this.message = message;
      });
      this.results();
      } else {
        this.displayCondition = 'displayError';
        this.errorDiv = 'Invalid Address';
      }
    },
    (err: HttpErrorResponse) => {
      if (err.error instanceof Error) {
          // A client-side or network error occurred.
          console.log('An error occurred:', err.error.message);
      } else {
          // Backend returns unsuccessful response codes such as 404, 500 etc.
          console.log('Backend returned status code: ', err.status);
          console.log('Response body:', err.error);
      }
    });
  }
// Retrieve results functionality

// Results Tabs Functionality
  results() {
    this.weatherSearchService.getCurrentWeather(this.message).subscribe((currentWeatherJson) => {
      const currentWeatherDetails = JSON.parse(currentWeatherJson.toString());
      this.message = currentWeatherDetails;
      this.currentWeather = currentWeatherDetails;
      this.simpleObservable = new Observable((observer) => {
        observer.next(this.message);
        observer.complete();
    });
      this.simpleObservable.subscribe(message => {
      this.message = message;
    });
      this.current();
  });
}
// Results Tabs Functionality

// Results Button Functionality
resultsBtnFunc(form: NgForm) {
  this.favoritesClicked = false;
  const ele = document.getElementById('fav') as HTMLButtonElement;
  ele.style.backgroundColor = 'white';
  ele.style.color = 'black';
  const ele1 = document.getElementById('res') as HTMLButtonElement;
  ele1.style.backgroundColor = '#6D91A9';
  ele1.style.color = 'white';
  if (!form.valid) {
    this.displayCondition = 'displayError';
    this.errorDiv = 'Please enter an address to retrieve results';
  } else {
    this.displayCondition = 'displayresults';
  }
}
// Results Button Functionality ends

// Current Weather Functionality
  current() {
    this.displayCondition = 'displayresults';
    this.timezone = this.currentWeather.timezone;
    this.summary = this.currentWeather.currently.summary;
    this.temperature = Math.round(this.currentWeather.currently.temperature);
    this.humidity = this.currentWeather.currently.humidity;
    this.pressure = this.currentWeather.currently.pressure;
    this.windSpeed = this.currentWeather.currently.windSpeed;
    this.visibility = this.currentWeather.currently.visibility;
    this.cloudCover = this.currentWeather.currently.cloudCover;
    this.ozone = this.currentWeather.currently.ozone;

    this.hourlyTempeature = [];
    this.hourlyTempeature = [];
    this.hourlyPressure = [];
    this.hourlyHumidity = [];
    this.hourlyOzone = [];
    this.hourlyVisibility = [];
    this.hourlyWindSpeed = [];
    for (let i = 0; i < 24; i++) {
      this.hourlyTempeature.push(this.currentWeather.hourly.data[i].temperature);
      this.hourlyPressure.push(this.currentWeather.hourly.data[i].pressure);
      this.hourlyHumidity.push((this.currentWeather.hourly.data[i].humidity) * 100);
      this.hourlyOzone.push(this.currentWeather.hourly.data[i].ozone);
      this.hourlyVisibility.push(this.currentWeather.hourly.data[i].visibility);
      this.hourlyWindSpeed.push(this.currentWeather.hourly.data[i].windSpeed);
    }
    this.comedy = this.currentWeather;
    this.simpleObservable = new Observable((observer) => {
          observer.next(this.message);
          observer.complete();
      });
    this.simpleObservable.subscribe(message => {
        this.message = message;
      });
  }

  // Hourly Functionality
  bar(hourly: any) {
    this.graph = true;
    this.barChartLabels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14',
                            '15', '16', '17', '18', '19', '20', '21', '22', '23'];
    this.barChartType = 'bar';
    this.barChartLegend = true;
    if (hourly === '') {
      this.barChartOptions = {
        scaleShowVerticalLines: false,
        legend: {
          onClick: (e) => e.stopPropagation()
      },
        responsive: true,
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Time difference from current hour'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Farenheit'
            },
            ticks: {
              max: Math.floor(Math.round(Math.max.apply(Math, this.hourlyTempeature)) / 10) * 10 + 10,
                userCallback(label, index, labels) {
                  if (Math.floor(label) === label) {
                      return label;
                  }
              },
          }
          }]
        }
      };
      this.barChartData = [
      {data: this.hourlyTempeature, label: 'temperature', backgroundColor: '#A5D0F0', hoverBackgroundColor: '#4b87a8', borderColor: '#A5D0F0'},
      ];
    }
    if (hourly === 'Pressure') {
      this.barChartOptions = {
        scaleShowVerticalLines: false,
        legend: {
          onClick: (e) => e.stopPropagation()
      },
        responsive: true,
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Time difference from current hour'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Millibars'
            },
            ticks: {
              max: (Math.floor(Math.max.apply(Math, this.hourlyPressure)) + 1),
              userCallback(label, index, labels) {
                  if (Math.floor(label) === label) {
                      return label;
                  }

              },
          }
          }]
        }
      };
      this.barChartData = [
      {data: this.hourlyPressure, label: 'pressure', backgroundColor: '#A5D0F0', hoverBackgroundColor: '#4b87a8', borderColor: '#A5D0F0'},
      ];
    }
    if (hourly === 'Humidity') {
      this.barChartOptions = {
        scaleShowVerticalLines: false,
        legend: {
          onClick: (e) => e.stopPropagation()
      },
        responsive: true,
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Time difference from current hour'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: '% Humidity'
            },
            ticks: {
              max: 100,
              userCallback(label, index, labels) {
                  // when the floored value is the same as the value we have a whole number
                  if (Math.floor(label) === label) {
                      return label;
                  }

              },
          }
          }]
        }
      };
      this.barChartData = [
      {data: this.hourlyHumidity, label: 'humidity', backgroundColor: '#A5D0F0', hoverBackgroundColor: '#4b87a8', borderColor: '#A5D0F0'},
      ];
    }
    if (hourly === 'Ozone') {
      this.barChartOptions = {
        scaleShowVerticalLines: false,
        legend: {
          onClick: (e) => e.stopPropagation()
      },
        responsive: true,
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Time difference from current hour'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Dobson Units'
            },
            ticks: {
              max: Math.floor(Math.max.apply(Math, this.hourlyOzone)) + 2,
              userCallback(label, index, labels) {
                if (Math.floor(label) === label) {
                    return label;
                }
              },
          }
          }]
        }
      };
      this.barChartData = [
      {data: this.hourlyOzone, label: 'ozone', backgroundColor: '#A5D0F0', hoverBackgroundColor: '#4b87a8', borderColor: '#A5D0F0'},
      ];
    }
    if (hourly === 'Visibility') {
      this.barChartOptions = {
        scaleShowVerticalLines: false,
        legend: {
          onClick: (e) => e.stopPropagation()
      },
        responsive: true,
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Time difference from current hour'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Miles (Maximum 10)'
            },
            ticks: {
              userCallback(label, index, labels) {
                  // when the floored value is the same as the value we have a whole number
                  if (Math.floor(label) === label) {
                      return label;
                  }

              },
          }
          }]
        }
      };
      this.barChartData = [
      {data: this.hourlyVisibility, label: 'visibility', backgroundColor: '#A5D0F0', hoverBackgroundColor: '#4b87a8', borderColor: '#A5D0F0'},
      ];
    }
    if (hourly === 'Wind Speed') {
      this.barChartOptions = {
        scaleShowVerticalLines: false,
        legend: {
          onClick: (e) => e.stopPropagation()
      },
        responsive: true,
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Time difference from current hour'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Miles per Hour'
            },
            ticks: {
               max: Math.ceil(Math.max.apply(Math, this.hourlyWindSpeed) + 1),
                userCallback(label, index, labels) {
                  if (Math.floor(label) === label) {
                      return label;
                  }

              },
          }
          }]
        }
      };
      this.barChartData = [
      {data: this.hourlyWindSpeed, label: 'windspeed', backgroundColor: '#A5D0F0', hoverBackgroundColor: '#4b87a8', borderColor: '#A5D0F0'},
      ];
    }
  }
  // Hourly tab functionality ends

  // Weekly tab functionality begins
  weekly() {
    this.modalid = true;
    const weeklyDetails = this.comedy;
    this.dateOfTheWeek = [];
    this.week = [];
    this.interval = [];
    this.utctimestamp = [];
    // tslint:disable-next-line: prefer-for-of
    for (let j = 0; j < 8; j++) {
      const dateObj = new Date((weeklyDetails.daily.data[j].time) * 1000);
      const month = dateObj.getMonth() + 1;
      const day = dateObj.getDate();
      const year = dateObj.getFullYear();
      const newdate = day + '/' + month + '/' + year;
      this.utctimestamp.push(weeklyDetails.daily.data[j].time);
      this.dateOfTheWeek.push(newdate);
      this.week.push({
        x: this.interval.push(10 * j),
        y: [weeklyDetails.daily.data[j].temperatureLow, weeklyDetails.daily.data[j].temperatureHigh],
        label: newdate
      });
    }
    this.anon = (i: number) => {
      const latlongtime = {lat: weeklyDetails.latitude, lng: weeklyDetails.longitude, time: this.utctimestamp[i]};
      this.weatherSearchService.getWeeklyWeather(latlongtime).subscribe((datewiseWeather) => {
      const weekWeather = JSON.parse(datewiseWeather.toString());
      this.message = latlongtime;
      const modalUTCDate = new Date((weekWeather.daily.data[0].time) * 1000);
      const month = modalUTCDate.getMonth() + 1; // months from 1-12
      const day = modalUTCDate.getDate();
      const year = modalUTCDate.getFullYear();

      this.modalDate = day + '/' + month + '/' + year;
      this.modalTemp = Math.round(weekWeather.currently.temperature);
      this.modalSummary = weekWeather.currently.summary;
      this.modalIcon = weekWeather.currently.icon;
      if ( this.modalIcon === 'clear-day' ||  this.modalIcon === 'clear-night') {
        this.modalImgsrc = 'https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png';
      }
      if ( this.modalIcon === 'rain') {
        this.modalImgsrc = 'https://cdn3.iconfinder.com/data/icons/weather-344/142/rain-512.png';
      }
      if ( this.modalIcon === 'snow') {
        this.modalImgsrc = 'https://cdn3.iconfinder.com/data/icons/weather-344/142/snow-512.png';
      }
      if ( this.modalIcon === 'sleet') {
        this.modalImgsrc = 'https://cdn3.iconfinder.com/data/icons/weather-344/142/lightning-512.png';
      }
      if ( this.modalIcon === 'wind') {
        this.modalImgsrc = 'https://cdn4.iconfinder.com/data/icons/the-weather-is-nice-today/64/weather_10-512.png';
      }
      if ( this.modalIcon === 'fog') {
        this.modalImgsrc = 'https://cdn3.iconfinder.com/data/icons/weather-344/142/cloudy-512.png';
      }
      if ( this.modalIcon === 'cloudy') {
        this.modalImgsrc = 'https://cdn3.iconfinder.com/data/icons/weather-344/142/cloud-512.png';
      }
      if ( this.modalIcon === 'partly-cloudy-day' ||  this.modalIcon == 'partly-cloudy-night') {
        this.modalImgsrc = 'https://cdn3.iconfinder.com/data/icons/weather-344/142/sunny-512.png';
      }
      if (weekWeather.currently.precipIntensity === 0) {
        this.modalPrecipitation = weekWeather.currently.precipIntensity;
      } else if (weekWeather.currently.precipIntensity === '' || weekWeather.currently.precipIntensity == null) {
        this.modalPrecipitation = 'N/A';
      } else {
        if ((weekWeather.currently.precipIntensity).toFixed(2) === '0.00') {
          this.modalPrecipitation = '0';
        } else {
          this.modalPrecipitation = weekWeather.currently.precipIntensity.toFixed(2);
        }
      }
      this.modalRain = weekWeather.currently.precipProbability;
      if (weekWeather.currently.windSpeed === 0) {
        this.modalWindSpeed = weekWeather.currently.windSpeed;
      } else if (weekWeather.currently.windSpeed === '' || weekWeather.currently.windSpeed == null) {
        this.modalWindSpeed  = 'N/A';
      } else {
        if ((weekWeather.currently.windSpeed).toFixed(2) === '0.00') {
          this.modalWindSpeed = '0';
        } else {
          this.modalWindSpeed = weekWeather.currently.windSpeed.toFixed(2);
        }
      }

      this.modalHumidity = Math.round((weekWeather.currently.humidity) * 100);
      this.modalVisibility = (weekWeather.currently.visibility).toFixed(2);
      });
    };
    const chart = new CanvasJS.Chart('chartContainer', {
      animationEnabled: true,
      dataPointWidth: 12,
      title: {
        text: 'Weekly Weather'
      },
      axisX: {
        title: 'Days',
        reversed: true
      },
      axisY: {
        includeZero: false,
        title: 'Temperature in Farenheit',
        interval: 10,
        gridThickness: 0
      },
      legend: {
        verticalAlign: 'top'
      },
      data: [{
        color: '#A5D0F0',

        type: 'rangeBar',
        showInLegend: true,
        yValueFormatString: '#0#',
        indexLabel: '{y[#index]}',
        legendText: 'Day wise temperature range',
        toolTipContent: '<b>{label}</b>: {y[0]} to {y[1]}',
        dataPoints: [
          { x: this.week[0].x, y: [this.week[0].y[0], this.week[0].y[1]],
            label: this.week[0].label, click: () => {this.modalid = true; onClick(); this.anon(0); }},
          { x: this.week[1].x, y: [this.week[1].y[0], this.week[1].y[1]],
            label: this.week[1].label, click: () => {this.modalid = true; onClick(); this.anon(1); }},
          { x: this.week[2].x, y: [this.week[2].y[0], this.week[2].y[1]],
            label: this.week[2].label, click: () => {this.modalid = true; onClick(); this.anon(2); } },
          { x: this.week[3].x, y: [this.week[3].y[0], this.week[3].y[1]],
            label: this.week[3].label, click: () => {this.modalid = true; onClick(); this.anon(3); } },
          { x: this.week[4].x, y: [this.week[4].y[0], this.week[4].y[1]],
            label: this.week[4].label, click: () => {this.modalid = true; onClick(); this.anon(4); } },
          { x: this.week[5].x, y: [this.week[5].y[0], this.week[5].y[1]],
            label: this.week[5].label, click: () => {this.modalid = true; onClick(); this.anon(5); } },
          { x: this.week[6].x, y: [this.week[6].y[0], this.week[6].y[1]],
            label: this.week[6].label, click: () => {this.modalid = true; onClick(); this.anon(6); } },
          { x: this.week[7].x, y: [this.week[7].y[0], this.week[7].y[1]],
            label: this.week[7].label, click: () => {this.modalid = true; onClick(); this.anon(7); } },
        ]
      }]
    });
    setTimeout(function() {chart.render(); }, 300);
    function onClick()  {
      const element = document.getElementById('modal-id-html') as HTMLInputElement;
      element.click();
    }

  }

  favorites() {
    const favBtn = document.getElementById('fav') as HTMLButtonElement;
    favBtn.style.backgroundColor = '#6D91A9';
    favBtn.style.color = 'white';
    const resBtn = document.getElementById('res') as HTMLButtonElement;
    resBtn.style.backgroundColor = 'white';
    resBtn.style.color = 'black';
    this.storedNames = [];
    if (localStorage.length !== 0) {
      this.displayCondition = 'displayFavorites';
      this.favoritesClicked = true;
      for (let i = 0; i < localStorage.length; i++) {
        this.storedNames.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
      }
    } else {
      this.displayCondition = 'displayError';
      this.errorDiv = 'No Records.';
    }
  }

  favoriteItem(form: NgForm) {
    if (this.star === 'star_border') {
      this.star = 'star_filled';
      this.addToFav();
    } else {
      this.star = 'star_border';
      this.removeFromFav(this.cityValue);
    }
  }
  // Adding to favorites functionality begins
    addToFav() {
    this.localStorageValue = 'Has Values';
    const element = document.getElementById('currentloc') as HTMLInputElement;
    const isChecked = element.checked;
    if (isChecked) {
      this.favArray =  {favcity: this.cityValue , favstate: this.stateValue.state, favseal: this.stateSeal, favlat: this.latValue,
                      favlong: this.longValue, q1: this.latValue,
                      q2: this.longValue, q3: this.cityValue };
    } else {
    this.favArray =  {favcity: this.cityValue , favstate: this.stateValue.state, favseal: this.stateSeal, favstreet: this.streetValue,
                      q1: this.streetValue, q2: this.cityValue, q3: this.stateValue.state };
    }
    this.favEachArray = this.favArray;
    localStorage.setItem(this.favArray.favcity, JSON.stringify(this.favEachArray));
    this.storedNames = JSON.parse(localStorage.getItem(this.favArray.favcity));
  }
  // Adding to favorites functionality begins

  // Favorite city click functionality begins
  favCityClicked(i) {
    this.displayCondition = 'displayprogressbar';
    this.favoritesClicked = false;
    const resBtn = document.getElementById('res') as HTMLButtonElement;
    resBtn.style.backgroundColor = '#6D91A9';
    resBtn.style.color = 'white';
    const favBtn = document.getElementById('fav') as HTMLButtonElement;
    favBtn.style.backgroundColor = 'white';
    favBtn.style.color = 'black';
    this.star = 'star_filled';
    this.simpleObservable = new Observable((observer) => {
      observer.next(this.storedNames);
      observer.complete();
    });
    this.simpleObservable.subscribe(message => {
      this.localStorageFormValues = message;
    });
     // tslint:disable-next-line: prefer-for-of
    for (let j = 0; j < this.localStorageFormValues.length; j++) {
      if (this.localStorageFormValues[j].favcity === i) {
        this.formvalues = {q1: this.localStorageFormValues[j].q1,
          q2: this.localStorageFormValues[j].q2, q3: this.localStorageFormValues[j].q3};
        this.stateValue = {state: this.localStorageFormValues[j].favstate};
        this.cityValue = this.localStorageFormValues[j].favcity;
      }
    }
    this.favCityFormValues = this.formvalues;
    this.simpleObservable = new Observable((observer) => {
      observer.next(this.favCityFormValues);
      observer.complete();
    });
    this.retrieveResults();
    this.getSeal(this.stateValue);
  }
  // Favorite city click functionality ends

  // Remove Favorites Functionality begins
  removeFromFav(cityName: any) {
    this.simpleObservable = new Observable((observer) => {
        observer.next(this.storedNames);
        observer.complete();
    });
    this.simpleObservable.subscribe(message => {
      this.localStorageFormValues = message;
    });
    // tslint:disable-next-line: prefer-for-of
    if (this.localStorageFormValues.length !== 0) {
      for (let j = 0; j < this.localStorageFormValues.length; j++) {
        if (this.localStorageFormValues[j].favcity === cityName) {
            delete this.localStorageFormValues[j];
            this.storedNames.splice(j, 1);
        }
      }
    }

    this.star = 'star_border';
    localStorage.removeItem(localStorage.key(cityName));
    if (this.displayCondition === 'displayresults') {
      this.displayCondition = 'displayresults';
    }
    if (this.favoritesClicked === true && this.storedNames.length === 0) {
        this.displayCondition = 'displayError';
        this.errorDiv = 'No Records.';
        this.favoritesClicked = false;
      }
  }
  // Remove Favorites Functionality ends

  // Clear button Functionality begins
  clearAll(form: NgForm) {
    const favBtn = document.getElementById('fav') as HTMLButtonElement;
    favBtn.style.backgroundColor = 'white';
    favBtn.style.color = 'black';
    const resultBtn = document.getElementById('res') as HTMLButtonElement;
    resultBtn.style.backgroundColor = '#6D91A9';
    resultBtn.style.color = 'white';
    form.reset();
    form.value.street = '';
    form.value.city = '';
    form.value.state = '';
    const stateDropDown = document.getElementById('states') as HTMLSelectElement;
    stateDropDown.value = '';
    this.displayCondition = 'clearAll';
    this.isDisabled = true;
    this.favoritesClicked = false;
  }
  // Clear button Functionality ends

  // Twitter Functionality begins
  twitter() {
    const twitterLink = 'https://twitter.com/intent/tweet?hashtags=CSCI571WeatherSearch&text=The current temperature at '
                            + this.cityValue + ' is ' + this.temperature + '\xB0F. The weather conditions are ' + this.summary + '.';
    window.open(twitterLink, '_blank');
  }
  // Twitter Functionality ends
}
