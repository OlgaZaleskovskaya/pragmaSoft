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
  ds = dc;
  crossFilter: any;
  pieDimension: any;
  pieGroup: any;
  lineDimension: any;
  lineGroup: any;
  timeRange: number[] = [];
  categoryFilterList: string[] = [];

  modeChangeSbj: Subject<string> = new Subject<string>();

  onDataChangeSubj: Subject<string> = new Subject<string>();

  categoryFilterSelectSubj: Subject<string[]> = new Subject<string[]>(); // header component is subscribed
  timeRangeSelectSubj: Subject<number[]> = new Subject<number[]>();// header component is subscribed

  removeFilterSbj: Subject<boolean> = new Subject<boolean>();// header component is subscribed

  constructor() {
  }

  setMode(mode: string) {
    this.mode = mode;
    this.getData();
  }

  setCategoryFilter(filters: string[]) {
    this.categoryFilterList = [...filters];
    this.categoryFilterSelectSubj.next(this.categoryFilterList);
  }

  setTimeRange(...args) {
    if (arguments.length > 0) {
      this.timeRange = [arguments[0], arguments[1]];
    }
    this.timeRangeSelectSubj.next(this.timeRange);
  }

  removeFilters() {
    this.mainData = undefined;
    this.getData();
    this.categoryFilterList = [];
    this.timeRange = [];
    this.categoryFilterSelectSubj.next(this.categoryFilterList);// header component is subscribed
    this.timeRangeSelectSubj.next(this.timeRange);// header component is subscribed
  }

  getData() {
    if (!this.mainData) {
      d3.csv("/../assets/data.csv").then(data => {
        this.mainData = data;
        this.crossFilter = crossfilter(data);

        this.pieDimension = this.crossFilter.dimension(function (data) {
          return data['item_category'];
        });
        this.pieGroup = this.pieDimension.group().reduceSum(d => d[this.mode]);

        this.lineDimension = this.crossFilter.dimension(function (data) {
          return data['week_ref'];
        });
        this.lineGroup = this.lineDimension.group().reduceSum(d => d[this.mode]);
        this.onDataChangeSubj.next(this.mode);
      });
    } else {
      this.pieGroup = this.pieDimension.group().reduceSum(d => d[this.mode]);
      this.lineGroup = this.lineDimension.group().reduceSum(d => d[this.mode]);
      this.onDataChangeSubj.next(this.mode);
    }
  }

}

