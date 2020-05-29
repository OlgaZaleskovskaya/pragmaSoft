import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ChartService } from '../chart.service';
import * as d3 from 'd3';
import * as dc from 'dc';
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
  removeAllFilersSubscription: Subscription;


  constructor(private srv: ChartService) {
  }

  ngOnInit(): void {
    this.mode = this.srv.mode;
    this.pieChart = dc.pieChart('#pie', "pie");
    this.createPieChart();


    this.fetchDataSubscription = this.srv.onDataChangeSubj.subscribe(res => {
      this.mode = res;
      this.createPieChart();
    });

    this.removeAllFilersSubscription = this.srv.removeFilterSbj.subscribe(res => {
      this.createPieChart();
      this.srv.ds.filterAll();
      this.srv.ds.redrawAll();

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
      .legend(dc.legend())
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
    this.srv.pieChart = this.pieChart;
    this.srv.ds.renderAll("pie");
  }

  ngOnDestroy(): void {
    this.fetchDataSubscription.unsubscribe();
    this.removeAllFilersSubscription.unsubscribe();
  }

  removeFilters() {
    this.pieChart.filterAll();
    this.srv.lineChart.filterAll();
    this.srv.ds.redrawAll();
  }

}
