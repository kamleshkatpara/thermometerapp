import { Component } from '@angular/core';
import { StockChart } from 'angular-highcharts';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from './../shared/services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  formData = new FormData();
  stock: StockChart;
  show = false;
  temperatures: any;

  constructor(private spinner: NgxSpinnerService, private dateService: DataService) { }

  onFileChanged(file: File) {

    this.show = false;
    this.spinner.show();

    this.formData.append('datafile', file[0], file[0].name);

    this.dateService
      .uploadFile(this.formData)
      .subscribe(temperatures => {

        this.formData.delete('datafile');

        this.temperatures = temperatures;
        this.temperatures.sort((a, b) => a.ts - b.ts);

        const output = this.temperatures.map(obj => {
          return Object.keys(obj).sort().map(key => {
            return obj[key];
          });
        });

        this.loadChart(output);

        setTimeout(() => this.spinner.hide());

      }, err => console.warn(err));
  }

  loadChart(data: any) {
    this.stock = new StockChart({
      rangeSelector: {
        buttonTheme: {
          fill: 'none',
          stroke: 'none',
          'stroke-width': 0,
          r: 8,
          style: {
            color: '#039',
            fontWeight: 'bold'
          },
          states: {
            hover: {
            },
            select: {
              fill: '#039',
              style: {
                color: 'white'
              }
            }
          }
        },
        inputBoxBorderColor: 'gray',
        inputBoxWidth: 120,
        inputBoxHeight: 18,
        inputStyle: {
          color: '#039',
          fontWeight: 'bold'
        },
        labelStyle: {
          color: 'silver',
          fontWeight: 'bold'
        },
        selected: 4
      },
      title: {
        text: 'Thermometer Temperature'
      },
      series: [{
        tooltip: {
          valueDecimals: 1
        },
        name: 'value',
        data,
        type: 'line'
      }]
    });
    this.show = true;
  }

}
