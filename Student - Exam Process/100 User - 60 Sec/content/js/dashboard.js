/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 94.55555555555556, "KoPercent": 5.444444444444445};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.795, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.905, 500, 1500, "/api/getevents/ST001-73"], "isController": false}, {"data": [0.92, 500, 1500, "/api/studentAttendancebystudentid/ST001-70"], "isController": false}, {"data": [0.015, 500, 1500, "/api/examstatus/ST001-554"], "isController": false}, {"data": [0.935, 500, 1500, "/api/collegestudent/ST001-558"], "isController": false}, {"data": [0.95, 500, 1500, "/api/timetabledataa/ghj-78"], "isController": false}, {"data": [0.96, 500, 1500, "/api/collegeexambysectionid/ghj-555"], "isController": false}, {"data": [0.905, 500, 1500, "/api/collegestudent/ST001-63"], "isController": false}, {"data": [0.915, 500, 1500, "/api/collegestudent/ST001-556"], "isController": false}, {"data": [0.925, 500, 1500, "/api/collegebirthdaystudent/ghj-76"], "isController": false}, {"data": [0.925, 500, 1500, "/api/collegestudent/ST001-553"], "isController": false}, {"data": [1.0, 500, 1500, "/api/createstatus-559"], "isController": false}, {"data": [0.775, 500, 1500, "/api/auth/login-62"], "isController": false}, {"data": [0.945, 500, 1500, "/api/collegeexambyexamid/Exam%20-%202-562"], "isController": false}, {"data": [0.0, 500, 1500, "Exam Module"], "isController": true}, {"data": [0.9, 500, 1500, "/api/collegeannouncement-67"], "isController": false}, {"data": [0.955, 500, 1500, "/api/collegeexambyexamid/Exam%20-%202-557"], "isController": false}, {"data": [0.885, 500, 1500, "/api/event/ST001-68"], "isController": false}, {"data": [0.23, 500, 1500, "Login Module"], "isController": true}, {"data": [0.955, 500, 1500, "/api/getQuestionsbyexamid/Exam%20-%202-560"], "isController": false}, {"data": [0.9, 500, 1500, "/api/createstatus-561"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1800, 98, 5.444444444444445, 246.41833333333346, 11, 4454, 116.5, 593.0, 713.8999999999996, 1080.0, 28.21228174665371, 35.602515889000344, 13.228027481505283], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/api/getevents/ST001-73", 100, 0, 0.0, 245.09, 35, 1024, 134.0, 549.0, 673.4499999999996, 1023.9399999999999, 1.763108713283261, 0.7713600620614267, 0.8590678334038576], "isController": false}, {"data": ["/api/studentAttendancebystudentid/ST001-70", 100, 0, 0.0, 279.61, 35, 4454, 125.0, 604.5, 767.3999999999994, 4418.919999999982, 1.75703693291633, 1.1598159613627579, 0.8338032492005482], "isController": false}, {"data": ["/api/examstatus/ST001-554", 100, 98, 98.0, 249.75000000000009, 33, 1080, 171.0, 605.4000000000001, 707.3999999999996, 1077.8199999999988, 1.7831033130059557, 0.9027308784458471, 0.8148294573125067], "isController": false}, {"data": ["/api/collegestudent/ST001-558", 100, 0, 0.0, 218.8700000000001, 34, 1059, 114.5, 601.7000000000002, 707.75, 1058.1899999999996, 1.813762832372039, 2.5741970698661443, 0.8359250303805275], "isController": false}, {"data": ["/api/timetabledataa/ghj-78", 100, 0, 0.0, 202.58000000000004, 34, 869, 132.0, 500.9, 578.7999999999995, 867.4299999999992, 1.760656372695741, 0.7823228999771115, 0.2665056032889061], "isController": false}, {"data": ["/api/collegeexambysectionid/ghj-555", 100, 0, 0.0, 219.25000000000009, 35, 1154, 132.5, 481.8, 640.8499999999999, 1153.4799999999998, 1.7937219730941705, 1.9356081838565022, 0.8355521300448431], "isController": false}, {"data": ["/api/collegestudent/ST001-63", 100, 0, 0.0, 245.55999999999997, 35, 1066, 140.5, 558.3000000000001, 687.6999999999997, 1065.4299999999996, 1.7102787754403967, 2.427326513596716, 0.7882314114075595], "isController": false}, {"data": ["/api/collegestudent/ST001-556", 100, 0, 0.0, 237.53000000000017, 35, 3020, 76.5, 548.3000000000001, 728.4999999999999, 3001.5699999999906, 1.8041097620379225, 2.560496874379837, 0.8314761338829854], "isController": false}, {"data": ["/api/collegebirthdaystudent/ghj-76", 100, 0, 0.0, 229.44999999999996, 39, 1017, 99.0, 675.9000000000003, 798.5499999999995, 1016.4199999999997, 1.7687532058651856, 1.0087420627199888, 0.8239211710914977], "isController": false}, {"data": ["/api/collegestudent/ST001-553", 100, 0, 0.0, 248.54, 34, 1049, 141.0, 621.6000000000004, 724.0999999999998, 1048.4199999999996, 1.7731125217206283, 2.5165037988935777, 0.8171901596687825], "isController": false}, {"data": ["/api/createstatus-559", 100, 0, 0.0, 25.960000000000008, 11, 277, 15.0, 23.700000000000017, 65.34999999999962, 276.98, 1.838945181044153, 0.8332720351606319, 0.9284518150388937], "isController": false}, {"data": ["/api/auth/login-62", 100, 0, 0.0, 583.16, 281, 3301, 440.0, 962.7000000000002, 1171.0499999999981, 3299.459999999999, 1.6825952348902948, 1.5836441752759456, 0.9282536133732668], "isController": false}, {"data": ["/api/collegeexambyexamid/Exam%20-%202-562", 100, 0, 0.0, 224.98000000000005, 34, 2914, 101.5, 510.2000000000001, 707.8499999999997, 2893.2299999999896, 1.8718529472324654, 2.0235754029163466, 0.8993668457405986], "isController": false}, {"data": ["Exam Module", 100, 98, 98.0, 2088.590000000001, 553, 10222, 1619.0, 4963.1, 5562.65, 10182.09999999998, 1.6958350291683626, 16.960403841914257, 8.377524409425451], "isController": true}, {"data": ["/api/collegeannouncement-67", 100, 0, 0.0, 265.38000000000005, 37, 3462, 118.0, 621.9, 674.2499999999995, 3435.6299999999865, 1.7601915088361613, 13.620856949236078, 0.8027435885024291], "isController": false}, {"data": ["/api/collegeexambyexamid/Exam%20-%202-557", 100, 0, 0.0, 197.47, 35, 725, 88.5, 499.70000000000005, 624.699999999999, 724.93, 1.825450429893576, 1.9734117440353407, 0.8770718862379292], "isController": false}, {"data": ["/api/event/ST001-68", 100, 0, 0.0, 296.10999999999996, 34, 3733, 93.5, 682.5000000000001, 999.5999999999999, 3721.4099999999944, 1.7391606810553226, 0.8746755378354406, 0.7862568805544444], "isController": false}, {"data": ["Login Module", 100, 0, 0.0, 2346.94, 561, 9165, 1770.0, 4918.4000000000015, 6251.449999999993, 9155.899999999996, 1.634360801490537, 20.779110008825548, 5.7197520674664135], "isController": true}, {"data": ["/api/getQuestionsbyexamid/Exam%20-%202-560", 100, 0, 0.0, 183.8200000000001, 34, 826, 97.0, 491.70000000000005, 680.6499999999999, 825.2599999999996, 1.8373909049150208, 1.5090290537436841, 0.9886742076251723], "isController": false}, {"data": ["/api/createstatus-561", 100, 0, 0.0, 282.42000000000013, 39, 1540, 153.5, 626.9, 773.7499999999993, 1538.5699999999993, 1.8392495861688432, 1.3270976066764761, 1.160056384495126], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["404/Not Found", 98, 100.0, 5.444444444444445], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1800, 98, "404/Not Found", 98, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/examstatus/ST001-554", 100, 98, "404/Not Found", 98, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
