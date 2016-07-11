import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
declare var componentHandler: any;

@Component({
  moduleId: module.id,
  selector: 'my-singlevisualization',
  templateUrl: 'singlevisualization.component.html'
})
export class SingleVisualizationComponent implements AfterViewInit {
 // exercisePct: number = 330;
  ngAfterViewInit():any {
    componentHandler.upgradeDom();
  }
  @Input('measurement') measurement: string;
  @Input('percent') exercisePct: number;
  @Input('percentV') exercisePctV: number;


    }

