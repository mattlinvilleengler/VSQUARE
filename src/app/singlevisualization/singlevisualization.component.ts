import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
declare var componentHandler: any;

@Component({
  moduleId: module.id,
  selector: 'my-singlevisualization',
  templateUrl: 'singlevisualization.component.html'
})
export class SingleVisualizationComponent implements AfterViewInit {
  // exercisePct: number = 330;
  ngAfterViewInit(): any {
    componentHandler.upgradeDom();
    console.log(this.range);
  }
  @Input('measurement') measurement: string;
  @Input('percent') exercisePct: number;
  @Input('percentV') exercisePctV: number;
  @Input('height') height: number;
  @Input('avg') avg: number;
  @Input('high') high: number;
  @Input('low') low: number;
  @Input('isRange') range: boolean;
  
  
}

