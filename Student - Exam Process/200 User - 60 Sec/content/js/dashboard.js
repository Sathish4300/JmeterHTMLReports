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

    var data = {"OkPercent": 97.22222222222223, "KoPercent": 2.7777777777777777};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.603625, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6825, 500, 1500, "/api/getevents/ST001-73"], "isController": false}, {"data": [0.685, 500, 1500, "/api/studentAttendancebystudentid/ST001-70"], "isController": false}, {"data": [0.3125, 500, 1500, "/api/examstatus/ST001-554"], "isController": false}, {"data": [0.68, 500, 1500, "/api/collegestudent/ST001-558"], "isController": false}, {"data": [0.67, 500, 1500, "/api/timetabledataa/ghj-78"], "isController": false}, {"data": [0.67, 500, 1500, "/api/collegeexambysectionid/ghj-555"], "isController": false}, {"data": [0.7375, 500, 1500, "/api/collegestudent/ST001-63"], "isController": false}, {"data": [0.7, 500, 1500, "/api/collegestudent/ST001-556"], "isController": false}, {"data": [0.7, 500, 1500, "/api/collegebirthdaystudent/ghj-76"], "isController": false}, {"data": [0.67, 500, 1500, "/api/collegestudent/ST001-553"], "isController": false}, {"data": [0.9475, 500, 1500, "/api/createstatus-559"], "isController": false}, {"data": [0.5075, 500, 1500, "/api/auth/login-62"], "isController": false}, {"data": [0.72, 500, 1500, "/api/collegeexambyexamid/Exam%20-%202-562"], "isController": false}, {"data": [0.0, 500, 1500, "Exam Module"], "isController": true}, {"data": [0.68, 500, 1500, "/api/collegeannouncement-67"], "isController": false}, {"data": [0.675, 500, 1500, "/api/collegeexambyexamid/Exam%20-%202-557"], "isController": false}, {"data": [0.6475, 500, 1500, "/api/event/ST001-68"], "isController": false}, {"data": [0.0, 500, 1500, "Login Module"], "isController": true}, {"data": [0.745, 500, 1500, "/api/getQuestionsbyexamid/Exam%20-%202-560"], "isController": false}, {"data": [0.6425, 500, 1500, "/api/createstatus-561"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3600, 100, 2.7777777777777777, 551.8549999999985, 12, 1984, 555.0, 935.6000000000004, 1081.0, 1505.9799999999996, 56.4042303172738, 75.09865844104974, 26.446077531335682], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/api/getevents/ST001-73", 200, 0, 0.0, 557.5400000000002, 68, 1764, 546.0, 935.1, 997.95, 1529.5500000000004, 3.3485693237564247, 1.464999079143436, 1.6315282713429438], "isController": false}, {"data": ["/api/studentAttendancebystudentid/ST001-70", 200, 0, 0.0, 573.2649999999999, 47, 1627, 553.0, 924.3000000000001, 1047.4999999999995, 1393.97, 3.3854122585777886, 2.2346531063273356, 1.606500441161535], "isController": false}, {"data": ["/api/examstatus/ST001-554", 200, 100, 50.0, 558.9799999999998, 65, 1599, 570.0, 937.3000000000002, 1047.6, 1417.7100000000003, 3.384323812102342, 5.9437847950791936, 1.5464938669706918], "isController": false}, {"data": ["/api/collegestudent/ST001-558", 200, 0, 0.0, 519.3650000000001, 52, 1586, 539.0, 845.6, 1054.699999999999, 1583.89, 3.4034442856170446, 4.831046245362807, 1.5685258246970935], "isController": false}, {"data": ["/api/timetabledataa/ghj-78", 200, 0, 0.0, 569.4750000000001, 62, 1603, 566.5, 939.9, 1064.6499999999994, 1430.6800000000003, 3.3587478587982402, 1.4924123786652337, 0.5084042169079367], "isController": false}, {"data": ["/api/collegeexambysectionid/ghj-555", 200, 0, 0.0, 549.6650000000002, 49, 1504, 562.0, 899.9000000000001, 1047.7999999999995, 1299.3900000000006, 3.3744453255496127, 3.6413692233714086, 1.571885176061685], "isController": false}, {"data": ["/api/collegestudent/ST001-63", 200, 0, 0.0, 539.6549999999999, 41, 1546, 532.5, 940.4000000000001, 1204.0999999999995, 1438.89, 3.308847859175435, 4.696770590339819, 1.5249297128333663], "isController": false}, {"data": ["/api/collegestudent/ST001-556", 200, 0, 0.0, 543.9649999999999, 63, 1600, 538.0, 946.8000000000001, 1138.1499999999994, 1549.7000000000003, 3.3821490174857103, 4.800818506485271, 1.558711596754828], "isController": false}, {"data": ["/api/collegebirthdaystudent/ghj-76", 200, 0, 0.0, 531.5349999999999, 67, 1767, 547.0, 892.1000000000001, 1079.8999999999996, 1493.5000000000014, 3.367513596336145, 1.9205350979104578, 1.568656235793302], "isController": false}, {"data": ["/api/collegestudent/ST001-553", 200, 0, 0.0, 552.1850000000001, 43, 1563, 561.5, 874.0000000000001, 987.8, 1419.8000000000002, 3.3764962098830043, 4.7927945834669865, 1.55610641977445], "isController": false}, {"data": ["/api/createstatus-559", 200, 0, 0.0, 203.1450000000001, 12, 800, 232.5, 501.9, 552.6999999999999, 797.5900000000004, 3.405124712692602, 1.5429471354388355, 1.7191889418574955], "isController": false}, {"data": ["/api/auth/login-62", 200, 0, 0.0, 871.5750000000003, 305, 1978, 837.5, 1161.5, 1427.95, 1932.3100000000006, 3.285097156748411, 3.09182501006061, 1.812305332328641], "isController": false}, {"data": ["/api/collegeexambyexamid/Exam%20-%202-562", 200, 0, 0.0, 502.61500000000035, 47, 1347, 538.0, 894.3000000000002, 1049.2499999999995, 1312.0, 3.4597886069161174, 3.7402206912657636, 1.6623203072292283], "isController": false}, {"data": ["Exam Module", 200, 100, 50.0, 5107.24, 1359, 8487, 5146.0, 7042.100000000001, 7606.799999999999, 8472.610000000002, 3.3052934274240195, 37.19047411851956, 16.3280849749624], "isController": true}, {"data": ["/api/collegeannouncement-67", 200, 0, 0.0, 557.4549999999997, 48, 1984, 566.0, 858.9, 942.9, 1631.810000000001, 3.3732501264968797, 26.103158205430933, 1.53838653229887], "isController": false}, {"data": ["/api/collegeexambyexamid/Exam%20-%202-557", 200, 0, 0.0, 556.5700000000003, 70, 1961, 566.0, 897.9000000000003, 1016.95, 1596.2200000000007, 3.3908650096639654, 3.6657105133769625, 1.6292046726119833], "isController": false}, {"data": ["/api/event/ST001-68", 200, 0, 0.0, 625.6500000000001, 44, 1662, 582.5, 1046.9, 1219.2499999999993, 1623.6000000000004, 3.352273679623204, 1.6859579541073733, 1.5154797784566132], "isController": false}, {"data": ["Login Module", 200, 0, 0.0, 4826.149999999998, 2193, 7762, 4764.0, 6264.7, 6759.9, 7619.890000000001, 3.195756035984213, 40.63105758053305, 11.183944596575747], "isController": true}, {"data": ["/api/getQuestionsbyexamid/Exam%20-%202-560", 200, 0, 0.0, 488.0050000000005, 55, 1635, 497.5, 833.9, 963.8, 1516.97, 3.4000306002754024, 2.7924079441714977, 1.8295086530778777], "isController": false}, {"data": ["/api/createstatus-561", 200, 0, 0.0, 632.7450000000006, 86, 1507, 587.0, 1000.7, 1378.1999999999985, 1505.8600000000001, 3.4151255912436183, 2.4640931560883153, 2.1539303826648224], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["404/Not Found", 100, 100.0, 2.7777777777777777], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3600, 100, "404/Not Found", 100, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/examstatus/ST001-554", 200, 100, "404/Not Found", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
