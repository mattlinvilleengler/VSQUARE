import { Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
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
export class DashboardComponent implements AfterViewInit {
  newUser: boolean = false;
  @ViewChild('newDialog') newDialog: any;

  ngAfterViewInit(): any {
    this.newUser = window.localStorage.getItem('newDashboard') == "true" ? true : false;
    this.newUser ? this.openDialog(this.newDialog) : false;
    componentHandler.upgradeDom();
  }
  gotoDetail() { /* not implemented yet */ }

  closeNewDialog() {
    this.newDialog.nativeElement.close();
    window.localStorage.setItem('newDashboard', "false");
  }
  openDialog(d) {
    setTimeout(function () { d.nativeElement.showModal(); }, 1500);
  }
}
