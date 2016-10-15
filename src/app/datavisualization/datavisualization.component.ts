import { Component, OnInit, AfterViewInit } from '@angular/core';
declare var d3: any;
import { G } from '../G.service';
declare var firebase: any;

@Component({
    moduleId: module.id,
    selector: 'my-datavisualization',
    templateUrl: 'datavisualization.component.html',
    styleUrls: ['datavisualization.component.css'],
    providers: [G]
})
export class DataVisualizationComponent implements OnInit, AfterViewInit {
    loggedIn: boolean = false;
    currentGraphTime: string = "week";
    mtGraph: number = 0;
    G: G = new G;
    mapping: any[] = [1, 1, 1]
    currentMin: number = 1;
    currentMax: number = 7;
    data: any[] = [];
    dataNumbers: any[] = [];
    group: any[] = [];
    groupNumbers: any[] = [];
    gColor: any[] = [];
    firstMili: number = 0;
    dataForTime: any[] = [];
    settingsOrganized: any[] = [];
    settingsSelected: any[] = [];
    mainWidth: number = 200;
    hasData: boolean = false;

    ngAfterViewInit(): any {
        var me = this;
        this.G.G.upgrade();
        window.onresize = function () { me.hasData ? me.changeSet(me.currentGraphTime) : false; };
    }
    ngOnInit() {
        var me = this;
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                me.manageUser();
            }
        });
    }
    manageUser() {
        this.loggedIn = this.G.G.user.LoggedIn;
        this.getSettings();
        this.getData();
    }
    getSettings() {
        var response = this.G.G.getSettings();
        this.updateSettings(response);
    }
    updateSettings(settings: any) {
        var response = this.G.G.organizeSettingsX(settings, this.settingsSelected);
        this.settingsOrganized = response[0];
        this.settingsSelected = response[1];
        this.G.G.upgradeDelay();
    }
    getData() {
        var response = this.G.G.getAllData();
        this.updateData(response);
    }
    updateData(data: any) {
        this.hasData = true;
        var response = this.G.G.organizeDataGraph(data, this.settingsSelected, this.firstMili);
        this.data = response[0];
        this.dataNumbers = response[1];
        this.dataForTime = response[2];
        this.firstMili = response[3];
        this.currentMin = this.dataForTime.length - 8;
        this.data.length > 0 ? this.changeSet("week") : false;
    }
    changeSet(x: string, d?: number) {
        if (this.dataForTime.length > 0) {
            var min = 1, max = 7, step = 7, t = 0, xS = 1;
            this.currentGraphTime = x;
            x == 'week' ? (step = 7, t = 0, xS = 1) : false;
            x == 'month' ? (step = 30, t = 1, xS = 5) : false;
            x == 'year' ? (step = 365, t = 2, xS = 20) : false;
            !d ? (max = this.currentMin + step, min = this.currentMin) : false;
            d == 1 ? (this.mapping[t]-- , max = this.currentMax + step, min = this.currentMin + step) : false;
            d == 2 ? (this.mapping[t]++ , max = this.currentMax - step, min = this.currentMin - step) : false;
            this.currentMin = min;
            this.currentMax = max;
            d3.select("#visualisation").html(null);
            var maxData: number = this.dataForTime[max - 1] ? this.dataForTime[max - 1].time : this.dataForTime[(this.dataForTime.length - 1)].time;
            var minData: number = this.dataForTime[min - 1] ? this.dataForTime[min - 1].time : this.dataForTime[0].time;
            this.createGraph(this.data, minData, maxData, xS);
            var dataArray = [];
            this.dataNumbers.forEach(function (x) { dataArray.push(x.Value) });
            var yMax = Math.max.apply(Math, dataArray);
            this.createGraph(this.dataNumbers, minData, maxData, xS, yMax);
            this.selectTimeButton(x);
        }
    }
    selectTimeButton(x: string) {
        d3.select("#weekButton").classed("selectedTime", false);
        d3.select("#monthButton").classed("selectedTime", false);
        d3.select("#yearButton").classed("selectedTime", false);
        d3.select("#" + x + "Button").classed("selectedTime", true);
    }
    toggleGraph(x: string) {
        var d = this.group.find(function (m) { return m.key == x });
        var d = d ? d : this.groupNumbers.find(function (m) { return m.key == x });
        var active = d.active ? false : true;
        var opacity = active ? 0 : 1;
        d3.select("#line_" + x.replace(" ", "")).transition().style("opacity", opacity);
        d.active = active;
    }
    createGraph(dataX: any[], xMin: any, xMax: any, xS: any, yMax?: any) {
        var me = this;
        if (!yMax) {
            me.gColor = [];
        } else {
            var mt = window.innerWidth < 800 ? 5 : 35;
            var xT = window.innerWidth < 900 ? -10 : 5;
        }
        var width = window.innerWidth < 800 ? window.innerWidth * .9 : (window.innerWidth * .55);
        var height = window.innerWidth < 800 ? window.innerHeight * .55 : (window.innerHeight * .50);
        this.mainWidth = width + 5;
        me.mtGraph = -10 - height;
        if (!yMax) {
            var svgLine = '<svg id="visualisation" height=' + height + ' width=' + width + ' ></svg>';
            d3.select("#graphBox").html(svgLine);
        } else {
            var svgLine = '<svg id="visualisationNumbers" height=' + height + ' width=' + width + ' ></svg>'
                + '<svg id="visualisationAxis" height=' + height + ' width=' + 45 + ' style="position:absolute;right:' + xT + 'px;' + 'top:' + mt + 'px;" ></svg>';
            d3.select("#graphBox2").html(svgLine);
        }
        var dataGroup = d3.nest()
            .key(function (d: any) {
                return d.Measurement;
            })
            .entries(dataX);
        this.group = dataGroup;
        var vis = d3.select("#visualisation");
        var WIDTH = width;
        var HEIGHT = height;
        var MARGINS = {
            top: 40,
            right: 10,
            bottom: yMax ? 50 : 40,
            left: 40
        };
        var yNum = yMax || 100;
        var xScale = d3.time.scale().range([MARGINS.left, WIDTH - MARGINS.right]).domain([xMin, xMax]);
        var yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([0, yNum]);

        if (!yMax) {
            var xAxis = d3.svg.axis()
                .scale(xScale)
                .ticks(d3.time.days, xS)
                .outerTickSize(0)
                .innerTickSize(-HEIGHT + 75)
                .tickFormat(d3.time.format('%b %e'));
            var yAxis = d3.svg.axis()
                .scale(yScale)
                .outerTickSize(0)
                .innerTickSize(-WIDTH)
                .orient("left");

            vis.append("svg:g")
                .attr("class", "axis")
                .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
                .call(xAxis);
            vis.append("svg:g")
                .attr("class", "axis")
                .attr("transform", "translate(" + (MARGINS.left) + ",0)")
                .call(yAxis);

        } else {
            var xAxis = d3.svg.axis()
                .scale(xScale)
                .ticks(d3.time.days, xS)
                .outerTickSize(0)
                .innerTickSize(-HEIGHT)
                .tickFormat(d3.time.format('%b %e'));

            var yAxis = d3.svg.axis()
                .scale(yScale)
                .ticks(4)
                .innerTickSize(-WIDTH)
                .outerTickSize(0)
                .orient("right");

            d3.select("#visualisationAxis").html("svg:g")
                .attr("class", "axis")
                .call(yAxis);
        }
        var lineGen = d3.svg.line()
            .x(function (d: any) {
                return xScale(d.Day);
            })
            .y(function (d: any) {
                return yScale(d.Value);
            })
            .interpolate("basis");

        var lSpace = HEIGHT / dataGroup.length;
        var lineColor = "";

        dataGroup.forEach(function (d: any, i: any) {
            vis.append('svg:path')
                .attr('d', lineGen(d.values))
                .attr('stroke', function (d: any, j: any) {
                    lineColor = "hsl(" + Math.random() * 360 + (yMax ? ",75%,35%)" : ",85%,50%)");
                    return lineColor;
                })
                .attr('stroke-width', 2)
                .attr('id', 'line_' + d.key.replace(" ", ""))
                .attr('fill', 'none');
            d ? me.gColor.push({
                mes: d.key,
                col: lineColor,
                active: true
            }) : false;
        });
        this.G.G.upgradeDelay();
    };
}


