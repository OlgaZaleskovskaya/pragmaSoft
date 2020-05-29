import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChartService } from '../chart.service';
import * as d3 from 'd3';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss']
})
export class LineComponent implements OnInit, OnDestroy {
  lineChart: any;
  mode: string;

  fetchDataSubscription: Subscription;

  constructor(private srv: ChartService) {
  }

  ngOnInit(): void {
    this.mode = this.srv.mode;
    this.lineChart = this.srv.ds.lineChart('#line', "line");
    this.createLineChart();

    this.fetchDataSubscription = this.srv.onDataChangeSubj.subscribe(res => {
      this.mode = res;
      this.createLineChart();
    })
  }

  public createLineChart() {
    this.lineChart
      .width(800)
      .height(300)
      .margins({ top: 10, right: 50, bottom: 50, left: 70 })
      .x(d3.scaleLinear().domain([d3.min(this.srv.mainData, d => +d['week_ref']), d3.max(this.srv.mainData, d => +d['week_ref'] + 1)]))
      .curve(d3.curveLinear)
      .brushOn(true)
      .renderDataPoints(true)
      .clipPadding(20)
      .xAxisLabel("weeks")
      .yAxisLabel(this.mode)
      .dimension(this.srv.lineDimension)
      .group(this.srv.lineGroup)
      .colors('red')
      .elasticY(true)
      .on('renderlet', function (chart) {
        d3.selectAll('.line')
          .style('fill', 'none')
      });

    this.lineChart.on('filtered', (chart, filter) => {
      if (filter != null) {
        this.srv.setTimeRange(Math.floor(filter[0]), Math.ceil(filter[1]));
      }
    });

    this.srv.lineChart = this.lineChart;
    this.srv.ds.renderAll("line");
  }

  ngOnDestroy(): void {
    this.fetchDataSubscription.unsubscribe();
  }

}
