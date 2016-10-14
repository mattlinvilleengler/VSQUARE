import { Component, OnInit, AfterViewInit } from '@angular/core';
import { G } from '../G.service'; 
@Component({
  moduleId: module.id,
  selector: 'my-datacard',
  templateUrl: 'datacard.component.html',
  providers: [ G ]
})
export class DataCardComponent implements AfterViewInit {
 G: G = new G;
  ngAfterViewInit(): any {
    this.G.G.upgrade();
  }
}
