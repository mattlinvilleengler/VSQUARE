import { Component, OnInit, AfterViewInit } from '@angular/core';
declare var componentHandler: any;
declare var d3: any;
declare var database: any;
declare var firebase: any;

@Component({
    moduleId: module.id,
    selector: 'my-datavisualization',
    templateUrl: 'datavisualization.component.html',
    styleUrls: ['datavisualization.component.css']
})
export class DataVisualizationComponent implements OnInit, AfterViewInit {
    finance: number = 0;
    happiness: number = 0;
    exercise: number = 0;
    nutrition: number = 0;
    sleep: number = 0;
    alcohol: number = 0;
    loggedIn: boolean = false;
    userID: number;

    financeSet: boolean = false;
    happinessSet: boolean = false;
    exerciseSet: boolean = false;
    nutritionSet: boolean = false;
    sleepSet: boolean = false;
    alcoholSet: boolean = false;
    currentGraphTime: string = "week";

    ngAfterViewInit(): any {
        var me = this;
        componentHandler.upgradeDom();
        window.onresize = function(){ me.setTime(me.currentGraphTime);};
    }
    mapping: any[] = [1, 1, 1]
    currentMin: number = 1;
    currentMax: number = 7;
    data: any[] = [];
    group: any[] = [];
    gColor: any[] = [];
    firstMili: number = 0;
    dataForTime: any[] = [];

    changeSet(x: string, d?: number) {
        var min = 1,
            max = 7,
            step = 7,
            t = 0;
        this.currentGraphTime = x;

        x == 'week' ? (step = 7, t = 0) : false;
        x == 'month' ? (step = 30, t = 1) : false;
        x == 'year' ? (step = 365, t = 2) : false;
        d == 1 ? (this.mapping[t]-- , max = this.currentMax + step, min = this.currentMin + step) : false;
        d == 2 ? (this.mapping[t]++ , max = this.currentMax - step, min = this.currentMin - step) : false;
        this.currentMin = min;
        this.currentMax = max;
        d3.select("#visualisation").html(null);
        var maxData: number = this.dataForTime[max - 1] ? this.dataForTime[max - 1].time : this.dataForTime[(this.dataForTime.length - 1)].time;
        var minData: number = this.dataForTime[min - 1] ? this.dataForTime[min - 1].time : this.dataForTime[0].time;

        //var data = this.snagData(min, max);
        this.createGraph(this.data, minData, maxData);
    }
    setTime(x: string) {
        var step: number;
        var min: number;
        this.currentGraphTime = x;
        x == 'week' ? (step = 7) : false;
        x == 'month' ? (step = 30) : false;
        x == 'year' ? (step = 365) : false;
        var max = (this.currentMin + step);
        this.currentMax = max;
        min = this.currentMin;

        d3.select("#visualisation").html(null);
        // var data = this.snagData(min, max);
        var maxData: number = this.dataForTime[max - 1] ? this.dataForTime[max - 1].time : this.dataForTime[(this.dataForTime.length - 1)].time;
        var minData: number = this.dataForTime[min - 1] ? this.dataForTime[min - 1].time : this.dataForTime[0].time;
        this.createGraph(this.data, minData, maxData);
        this.selectTimeButton(x);
    }
    selectTimeButton(x: string) {
        d3.select("#weekButton").classed("selectedTime", false);
        d3.select("#monthButton").classed("selectedTime", false);
        d3.select("#yearButton").classed("selectedTime", false);
        d3.select("#" + x + "Button").classed("selectedTime", true);
    }

    snagData(x: number, y: number) {
        var newData: any[] = [];
        this.data ? this.data.forEach(function (d) {
            if (d.Day >= x && d.Day <= y) {
                newData.push(d);
            }
        }) : false;
        return newData;
    };

    toggleGraph(x: string) {
        var d = this.group.find(function (m) { return m.key == x });
        var active = d.active ? false : true;
        var opacity = active ? 0 : 1;
        d3.select("#line_" + x).style("opacity", opacity);
        d.active = active;
    }
    createGraph(dataX: any[], xMin: any, xMax: any) {
        var me = this;
        me.gColor = [];
        var width = window.innerWidth < 800 ? window.innerWidth * .9 : window.innerWidth * .75; 
        var height = window.innerHeight * .55;
        var svgLine = '<svg id="visualisation" height=' + height + ' width=' + width + ' ></svg>';
        d3.select("#graphBox").html(svgLine);
        var dataGroup = d3.nest()
            .key(function (d: any) {
                return d.Measurement;
            })
            .entries(dataX);

        this.group = dataGroup;

        var vis = d3.select("#visualisation"),
            WIDTH = width,
            HEIGHT = height,
            MARGINS = {
                top: 40,
                right: 40,
                bottom: 50,
                left: 40
            },
            xScale = d3.time.scale().range([MARGINS.left, WIDTH - MARGINS.right]).domain([xMin, xMax]),
            yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([0, 100]),

            xAxis = d3.svg.axis()
                .scale(xScale)
                .ticks(d3.time.days, 1)
                .tickFormat(d3.time.format('%m/%e')),

            yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left");

        vis.append("svg:g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
            .call(xAxis);

        vis.append("svg:g")
            .attr("class", "axis")
            .attr("transform", "translate(" + (MARGINS.left) + ",0)")
            .call(yAxis);

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
                    lineColor = "hsl(" + Math.random() * 360 + ",100%,50%)";
                    return lineColor;
                })
                .attr('stroke-width', 2)
                .attr('id', 'line_' + d.key)
                .attr('fill', 'none');
            d ? me.gColor.push({
                mes: d.key,
                col: lineColor,
                active: true
            }) : false;
        });
        setTimeout(function () { componentHandler.upgradeDom() }, 400);

    };
    ngOnInit() {
        //this.createData();
        //this.changeSet("week");
        var me = this;
        firebase.auth().onAuthStateChanged(function (user: any) {
            if (user) {
                me.loggedIn = true;
                me.userID = user.uid;
                me.getSettings();
                me.getData();
            } else {
                me.loggedIn = false;
            }
        });
    }
    getSettings() {
        var me = this;
        database.ref('settings/' + this.userID).on('value', function (snapshot: any) {
            me.updateSettings(snapshot.val());
        });
    }
    getData() {
        var me = this;
        database.ref('data/' + this.userID).on('value', function (snapshot: any) {
            me.updateData(snapshot.val());
        });
    }
    updateData(data: any) {
        if (data) {
            var day = 1;
            for (var d in data) {
                if (this.firstMili > data[d].time || this.firstMili == 0) {
                    this.firstMili = data[d].time;
                }
                this.dataForTime.push(data[d]);
                for (var x in data[d]) {
                    if (x != "time" && this[x + "Set"]) {
                        this.data.push({
                            Measurement: x,
                            Day: (new Date(data[d].time)),
                            Mili: data[d].time,
                            Value: data[d][x]
                        })
                    }
                }
                day++;
            }
            this.changeSet("week");
        }
    }
    updateSettings(settings: any) {
        if (settings) {
            this.financeSet = settings.finance;
            this.happinessSet = settings.happiness;
            this.exerciseSet = settings.exercise;
            this.nutritionSet = settings.nutrition;
            this.sleepSet = settings.sleep;
            this.alcoholSet = settings.alcohol;
        }
    }
}

