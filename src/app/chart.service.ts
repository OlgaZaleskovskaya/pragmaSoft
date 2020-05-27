import { Injectable } from '@angular/core';

import * as crossfilter from 'crossfilter2/crossfilter';
import * as d3 from 'd3';
import * as dc from 'dc';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ChartService {
  mode: string;
  mainData: any;
  crossFilter: any;
  pieChart: any;
  pieDimension: any;
  pieGroup: any;

  lineChart: any;
  lineDimension: any;
  lineGroup: any;

  modeSbj: Subject<string> = new Subject<string>();

  timeRange: number[] = [];
  rangeSubj: Subject<number[]> = new Subject<number[]>();

  categoryFilter: string[] = [];
  categorySubj: Subject<string[]> = new Subject<string[]>();

  removeFilterSbj: Subject<boolean> = new Subject<boolean>();

  constructor() {
  }

  setMode(mode: string) {
    this.mode = mode;
    console.log
    this.getData();
  }

  setCategoryFilter(filters: string[]) {
    this.categoryFilter = [...filters];
    this.categorySubj.next(this.categoryFilter);
  }

  setTimeRange(...args) {
    if (arguments.length > 0) {
      this.timeRange = [arguments[0], arguments[1]];
    }
    this.rangeSubj.next(this.timeRange);
  }

  removeFilters() {
    this.pieChart.filterAll();
    this.lineChart.filterAll();
    this.timeRange = [];
    this.categoryFilter = [];
    this.getData();
    this.rangeSubj.next(this.timeRange);
    this.categorySubj.next(this.categoryFilter);
  }

  getData() {
    if (this.mainData == undefined) {
      d3.csv("/../assets/data.csv").then(data => {
        this.mainData = data;
        this.crossFilter = crossfilter(data);

        this.pieChart = dc.pieChart('#pie');
        this.pieDimension = this.crossFilter.dimension(function (data) {
          return data['item_category'];
        });

        this.pieGroup = this.pieDimension.group().reduceSum(d => d[this.mode]);
        this.createPieChart();

        this.lineChart = dc.lineChart('#line');
        this.lineDimension = this.crossFilter.dimension(function (data) {
          return data['week_ref'];
        });
        this.lineGroup = this.lineDimension.group().reduceSum(d => d[this.mode]);
        this.createLineChart();

        dc.renderAll();
      });
    } else {
      this.pieGroup = this.pieDimension.group().reduceSum(d => d[this.mode]);
      this.lineGroup = this.lineDimension.group().reduceSum(d => d[this.mode]);
      this.createPieChart();
      this.createLineChart();
      dc.renderAll();
    }
  }


  private createPieChart() {
    this.pieChart
      .width(500)
      .height(200)
      .slicesCap(10)
      .innerRadius(10)
      .externalLabels(15)
      .externalRadiusPadding(20)
      .dimension(this.pieDimension)
      .group(this.pieGroup)
      .legend(dc.legend())

      ;
    this.pieChart.label(function (data) {
      return data.key + ': ' + parseInt(data.value);
    });


    this.pieChart.on('filtered', (chart, filter) => {
      this.setCategoryFilter(chart['_filters']);
    });
  };


  private createLineChart() {
    this.lineChart
      .width(800)
      .height(300)
      .margins({ top: 10, right: 50, bottom: 50, left: 70 })

      .x(d3.scaleLinear().domain([d3.min(this.mainData, d => +d['week_ref']), d3.max(this.mainData, d => +d['week_ref'] + 1)]))
      //.x(d3.scaleLinear().domain([1, 40]))
      .curve(d3.curveLinear)
      .brushOn(true)
      .renderDataPoints(true)
      .clipPadding(20)
      .xAxisLabel("weeks")
      .yAxisLabel(this.mode)
      .dimension(this.lineDimension)
      .group(this.lineGroup)
      //.renderLabel(true)
      .colors('red')
      .elasticY(true)
      .on('renderlet', function (chart) {
        d3.selectAll('.line')
          .style('fill', 'none')
      })
      ;

    this.lineChart.on('filtered', (chart, filter) => {
      if (filter != null) {
        this.setTimeRange(Math.floor(filter[0]), Math.ceil(filter[1]));
      }
    });



  }



}

