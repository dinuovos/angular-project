import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { modelData } from './modelData';
import {getData} from "./getData";
import {Observable} from "rxjs";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private http: HttpClient
  ) {}
  firstData = "";
  firstShowedData = "";
  lastItem = 0;
  lastDate = "";
  lastShowedDate = "";
  deltaNumber = 0;
  number = 10;
  firstItem = 0;
  dataLength = 0;
  json = [] as modelData[];
  data = this.getData();
  changeFirstDate(e: Event): void{
    const input = e.target as HTMLInputElement;
    (<any>window).performanceMeasurement = performance.now();
    // https://stackoverflow.com/questions/3224834/get-difference-between-2-dates-in-javascript
    let valueDate = input.value
    let lastItem = this.lastItem;
    let lastItemNumber = lastItem >= this.json.length ? this.json.length-1 : lastItem;
    let lastItemDate = this.json[lastItemNumber].data.split("T")[0];
    let d1 = new Date(valueDate);
    let d2 = new Date(lastItemDate);
    const diffTime = Math.abs(d2.valueOf() - d1.valueOf());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    this.firstItem= lastItemNumber - (diffDays);
    this.firstShowedData = valueDate;
    this.deltaNumber = diffDays+1;
    this.data = new Observable<modelData[]>(subscriber=>{
      subscriber.next(this.json.slice(this.firstItem,this.number));
    });
  }
  changeLastDate(e: Event){
    const input = e.target as HTMLInputElement;
    (<any>window).performanceMeasurement = performance.now();
    const firstData = this.json[this.firstItem].data;
    let d1 = new Date(firstData.split("T")[0]);
    let d2 = new Date(input.value);
    const diffTime = Math.abs(d2.valueOf() - d1.valueOf());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let number = this.firstItem + diffDays;
    this.number = number + 1;
    let lastItemNumber = number; //number >= this.state.data.length ? this.state.data.length-1 : number;
    this.lastShowedDate = getData(this.json[lastItemNumber].data);
    this.deltaNumber = diffDays+1;
    this.lastItem = lastItemNumber;
    this.data = new Observable<modelData[]>(subscriber=>{
      subscriber.next(this.json.slice(this.firstItem,this.number));
    });
  }
  changeNumber(e: Event): void{
    const input = e.target as HTMLInputElement;
    let delta = this.firstItem+(+input.value);
    let lastItemNumber = delta-1;//delta >= this.state.data.length ? this.state.data.length-1 : delta;
    this.lastShowedDate = getData(this.json[lastItemNumber].data);
    this.number = delta;
    this.deltaNumber = +input.value;
    this.lastItem = lastItemNumber;
    this.data = new Observable<modelData[]>(subscriber=>{
      subscriber.next(this.json.slice(this.firstItem,this.number));
    });
  }
  getData() {
    return new Observable<modelData[]>( subscriber => {
      fetch('https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json')
        .then(async res=>{
          let jsonRaw = await res.json();
          let json = jsonRaw.reverse();
          this.firstData = getData(json[this.firstItem].data);
          this.firstShowedData = this.firstData;
          this.lastItem = this.number-1;
          this.lastDate = getData(json[json.length-1].data);
          this.lastShowedDate = getData(json[this.number-1].data);
          this.deltaNumber = this.number;
          this.dataLength = json.length;
          this.json = json;
          document.getElementById("root")?.classList.remove("loading");
          subscriber.next(json.slice(this.firstItem,this.number));
        })
    });
    //return this.http.get<modelData[]>('https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json');
  }
}
