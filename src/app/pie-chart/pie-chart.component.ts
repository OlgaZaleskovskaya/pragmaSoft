import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChartService } from '../chart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})

export class PieChartComponent implements OnInit, OnDestroy {
  pieChart: any;
  mode: string;
  fetchDataSubscription: Subscription;

  constructor(private srv: ChartService) {
  }

  ngOnInit(): void {
    this.mode = this.srv.mode;
    this.pieChart = this.srv.ds.pieChart('#pie', "pie");
    this.createPieChart();

    this.fetchDataSubscription = this.srv.onDataChangeSubj.subscribe(res => {
      this.mode = res;
      this.createPieChart();
    });
  }

  private createPieChart() {
    this.pieChart
      .width(500)
      .height(200)
      .slicesCap(10)
      .innerRadius(10)
      .externalLabels(15)
      .externalRadiusPadding(20)
      .dimension(this.srv.pieDimension)
      .group(this.srv.pieGroup)
      .legend(this.srv.ds.legend())
      ;
    this.pieChart.label(function (data) {
      return data.key + ': ' + parseInt(data.value);
    });

    this.pieChart.label(function (data) {
      return data.key + ': ' + parseInt(data.value);
    });

    this.pieChart.on('filtered', (chart, filter) => {
      this.srv.setCategoryFilter(chart['_filters']);
    });

    this.srv.ds.renderAll("pie");
  }

  ngOnDestroy(): void {
    this.fetchDataSubscription.unsubscribe();
  }

}
