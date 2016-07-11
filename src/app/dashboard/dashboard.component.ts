import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataVisualizationComponent } from '../datavisualization/datavisualization.component';
import { DataDaysComponent } from '../datadays/datadays.component';
declare var componentHandler: any;

@Component({
  moduleId: module.id,
  selector: 'my-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css'],
  directives: [DataVisualizationComponent, DataDaysComponent]
})
export class DashboardComponent implements  AfterViewInit {
  ngAfterViewInit():any {
    componentHandler.upgradeDom();
  }
  gotoDetail() { /* not implemented yet */}
}
