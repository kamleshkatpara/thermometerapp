import { Component } from '@angular/core';
import { StockChart } from 'angular-highcharts';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  stock: StockChart;
  show = false;

  constructor(private spinner: NgxSpinnerService) { }

  onFileChanged(event: { srcElement: { files: any[]; }; }) {
    const file = event.srcElement.files[0];
    if (file) {
      this.show = false;
      this.spinner.show();
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = e => {
        const data = JSON.parse(e.target['result'] as any);
        const output = data.map(obj => {
          return Object.keys(obj).sort().map(key => {
            return obj[key];
          });
        });
        this.loadChart(output);
        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
      };

      reader.onerror = e => {
        console.log('error reading file', e);
      };
    }
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
