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

    var data = {"OkPercent": 99.88888888888889, "KoPercent": 0.1111111111111111};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6405, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.7, 500, 1500, "/api/getevents/ST001-73"], "isController": false}, {"data": [0.71, 500, 1500, "/api/studentAttendancebystudentid/ST001-70"], "isController": false}, {"data": [0.69, 500, 1500, "/api/examstatus/ST001-554"], "isController": false}, {"data": [0.715, 500, 1500, "/api/collegestudent/ST001-558"], "isController": false}, {"data": [0.71, 500, 1500, "/api/timetabledataa/ghj-78"], "isController": false}, {"data": [0.725, 500, 1500, "/api/collegeexambysectionid/ghj-555"], "isController": false}, {"data": [0.695, 500, 1500, "/api/collegestudent/ST001-63"], "isController": false}, {"data": [0.735, 500, 1500, "/api/collegestudent/ST001-556"], "isController": false}, {"data": [0.685, 500, 1500, "/api/collegebirthdaystudent/ghj-76"], "isController": false}, {"data": [0.695, 500, 1500, "/api/collegestudent/ST001-553"], "isController": false}, {"data": [0.94, 500, 1500, "/api/createstatus-559"], "isController": false}, {"data": [0.545, 500, 1500, "/api/auth/login-62"], "isController": false}, {"data": [0.745, 500, 1500, "/api/collegeexambyexamid/Exam%20-%202-562"], "isController": false}, {"data": [0.0, 500, 1500, "Exam Module"], "isController": true}, {"data": [0.715, 500, 1500, "/api/collegeannouncement-67"], "isController": false}, {"data": [0.705, 500, 1500, "/api/collegeexambyexamid/Exam%20-%202-557"], "isController": false}, {"data": [0.725, 500, 1500, "/api/event/ST001-68"], "isController": false}, {"data": [0.0, 500, 1500, "Login Module"], "isController": true}, {"data": [0.74, 500, 1500, "/api/getQuestionsbyexamid/Exam%20-%202-560"], "isController": false}, {"data": [0.635, 500, 1500, "/api/createstatus-561"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1800, 2, 0.1111111111111111, 652.7905555555577, 11, 5583, 527.5, 1218.0, 1441.3999999999978, 2325.7200000000003, 45.51431172246384, 139.94897715276372, 21.33564849202235], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/api/getevents/ST001-73", 100, 0, 0.0, 639.0000000000001, 13, 2177, 545.5, 1071.5, 1451.4999999999977, 2176.4599999999996, 3.064382680109092, 1.3424928848864646, 1.4928391601293167], "isController": false}, {"data": ["/api/studentAttendancebystudentid/ST001-70", 100, 0, 0.0, 697.5000000000002, 13, 2117, 597.0, 1265.5, 1418.1999999999998, 2115.139999999999, 3.154872700886519, 2.0773789219011265, 1.496870021216519], "isController": false}, {"data": ["/api/examstatus/ST001-554", 100, 0, 0.0, 692.4300000000001, 16, 5583, 580.5, 1207.1000000000004, 1655.0499999999975, 5550.589999999984, 2.9201343261790043, 7.523110125565776, 1.3341648872098117], "isController": false}, {"data": ["/api/collegestudent/ST001-558", 100, 0, 0.0, 626.2799999999999, 42, 3821, 522.0, 1051.6, 1350.2499999999995, 3806.099999999992, 2.857877739990283, 25.829967884598897, 1.3168843863422024], "isController": false}, {"data": ["/api/timetabledataa/ghj-78", 100, 0, 0.0, 659.81, 65, 4697, 527.0, 1145.6000000000004, 1454.4999999999995, 4669.189999999986, 3.030211205721039, 1.3464317369170633, 0.45870413964728346], "isController": false}, {"data": ["/api/collegeexambysectionid/ghj-555", 100, 1, 1.0, 615.98, 57, 4501, 505.5, 1091.0, 1309.2999999999997, 4473.149999999985, 2.925858739540055, 3.1384406635847624, 1.362953005222658], "isController": false}, {"data": ["/api/collegestudent/ST001-63", 100, 0, 0.0, 681.3500000000004, 51, 4082, 526.5, 1268.5, 1554.7499999999998, 4059.8599999999888, 3.143962020938787, 28.415644551513818, 1.4487094527148112], "isController": false}, {"data": ["/api/collegestudent/ST001-556", 100, 0, 0.0, 619.2299999999999, 44, 2296, 554.0, 1157.2000000000003, 1208.6, 2289.6999999999966, 2.86409852498926, 25.88524138980381, 1.3197508681798653], "isController": false}, {"data": ["/api/collegebirthdaystudent/ghj-76", 100, 0, 0.0, 701.6699999999998, 56, 3656, 574.5, 1299.9, 1811.4999999999973, 3642.419999999993, 2.9814257177782415, 1.6983936171402165, 1.3888377750365226], "isController": false}, {"data": ["/api/collegestudent/ST001-553", 100, 0, 0.0, 726.76, 61, 4133, 519.5, 1332.4, 1831.249999999999, 4122.169999999995, 2.9382382323558796, 26.556279198742434, 1.3539137792354705], "isController": false}, {"data": ["/api/createstatus-559", 100, 0, 0.0, 151.75, 11, 1304, 22.0, 547.5000000000001, 691.399999999999, 1298.6499999999974, 2.906723250879284, 1.3171373590239224, 1.4675546100630759], "isController": false}, {"data": ["/api/auth/login-62", 100, 1, 1.0, 938.22, 285, 2129, 924.0, 1458.5000000000002, 1641.9499999999996, 2128.2999999999997, 3.1655587211142766, 2.96984434354226, 1.746374446027224], "isController": false}, {"data": ["/api/collegeexambyexamid/Exam%20-%202-562", 100, 0, 0.0, 549.99, 16, 1911, 419.5, 1053.4, 1303.9499999999996, 1910.2199999999996, 2.9277432954678533, 3.147953049976578, 1.4060029716594449], "isController": false}, {"data": ["Exam Module", 100, 1, 1.0, 6080.020000000001, 2336, 13999, 5909.0, 9721.5, 10199.75, 13980.62999999999, 2.7592296230892335, 96.31193392679765, 13.6263638785801], "isController": true}, {"data": ["/api/collegeannouncement-67", 100, 0, 0.0, 697.1599999999996, 60, 5492, 552.0, 1190.7000000000005, 1364.3499999999995, 5459.069999999983, 3.128519584532599, 24.209364441246404, 1.4267760214616445], "isController": false}, {"data": ["/api/collegeexambyexamid/Exam%20-%202-557", 100, 0, 0.0, 645.8, 16, 2879, 565.0, 1102.9, 1449.5999999999992, 2873.469999999997, 2.8850869853726087, 3.1011022384668645, 1.3855179452410489], "isController": false}, {"data": ["/api/event/ST001-68", 100, 0, 0.0, 655.4999999999998, 52, 1825, 517.5, 1221.7000000000003, 1456.5499999999993, 1824.3299999999997, 3.1503008537315313, 1.9420804882178748, 1.4239421388180071], "isController": false}, {"data": ["Login Module", 100, 1, 1.0, 5670.210000000001, 2010, 11184, 6649.0, 8351.2, 8894.999999999998, 11176.539999999995, 2.725166916473634, 55.70690936265159, 9.536327752418586], "isController": true}, {"data": ["/api/getQuestionsbyexamid/Exam%20-%202-560", 100, 0, 0.0, 646.9599999999999, 15, 4313, 480.0, 1292.0000000000005, 1497.7999999999988, 4296.599999999991, 2.8781119585551878, 2.354430493596201, 1.547997013958843], "isController": false}, {"data": ["/api/createstatus-561", 100, 0, 0.0, 804.8400000000001, 47, 5171, 657.5, 1415.8000000000002, 1819.6999999999985, 5161.189999999995, 2.898298698663884, 2.089662040257369, 1.8264376467263717], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Proxy Error", 1, 50.0, 0.05555555555555555], "isController": false}, {"data": ["404/Not Found", 1, 50.0, 0.05555555555555555], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1800, 2, "502/Proxy Error", 1, "404/Not Found", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/collegeexambysectionid/ghj-555", 100, 1, "404/Not Found", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/auth/login-62", 100, 1, "502/Proxy Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
