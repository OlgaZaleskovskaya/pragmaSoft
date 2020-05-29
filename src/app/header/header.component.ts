import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChartService } from '../chart.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {
  modes: string[];
  categoryFilter: string[];
  timeRange: number[];
  categoryFiltrSelectSubscription: Subscription;
  timeRangeSelectSubscription: Subscription;
  mode: string;

  constructor(private srv: ChartService) { }

  ngOnInit(): void {
    this.categoryFilter = this.srv.categoryFilterList;
    this.timeRange = this.srv.timeRange;
    this.timeRangeSelectSubscription = this.srv.timeRangeSelectSubj.subscribe(res => {
      this.timeRange = res;
    });
    this.categoryFiltrSelectSubscription = this.srv.categoryFilterSelectSubj.subscribe(res => {
      this.categoryFilter = res;
    });

    this.mode = 'margin';
    this.modes = ['markdown', 'revenues', 'margin'];
    this.srv.mode = this.mode;

    this.srv.getData();
  }

  onModeChange(value: string) {
    this.mode = value;
    this.srv.setMode(value);
  }

  onRemoveFilters() {
    this.srv.removeFilters();
  }

  ngOnDestroy(): void {
    this.categoryFiltrSelectSubscription.unsubscribe();
    this.timeRangeSelectSubscription.unsubscribe();
  }

}
