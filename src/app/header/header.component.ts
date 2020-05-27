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
  categoryFilterSubscription: Subscription;
  timeRangeSubscription: Subscription;
  mode: string;


  visibility: boolean;
  constructor(private srv: ChartService) { }


  ngOnInit(): void {
    this.visibility = true;
    this.categoryFilter = this.srv.categoryFilter;
    this.timeRange = this.srv.timeRange;
    this.timeRangeSubscription = this.srv.rangeSubj.subscribe(res => {
      this.timeRange = res;
    });
    this.categoryFilterSubscription = this.srv.categorySubj.subscribe(res => {
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
    this.categoryFilterSubscription.unsubscribe();
    this.timeRangeSubscription.unsubscribe();
  }

}
