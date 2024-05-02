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

    var data = {"OkPercent": 85.77777777777777, "KoPercent": 14.222222222222221};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.23333333333333334, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3325, 500, 1500, "/api/getevents/ST001-73"], "isController": false}, {"data": [0.4775, 500, 1500, "/api/collegebirthdaystudent/ghj-76"], "isController": false}, {"data": [0.285, 500, 1500, "/api/studentAttendancebystudentid/ST001-70"], "isController": false}, {"data": [0.1775, 500, 1500, "/api/auth/login-61"], "isController": false}, {"data": [0.1075, 500, 1500, "/api/auth/login-62"], "isController": false}, {"data": [0.215, 500, 1500, "/api/collegeannouncement-67"], "isController": false}, {"data": [0.3475, 500, 1500, "/api/timetabledataa/ghj-78"], "isController": false}, {"data": [0.0675, 500, 1500, "/api/event/ST001-68"], "isController": false}, {"data": [0.09, 500, 1500, "/api/collegestudent/ST001-63"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1800, 256, 14.222222222222221, 3035.5200000000027, 1, 21386, 1979.5, 7617.800000000002, 11063.95, 12264.0, 38.8064849948258, 680.2256999652359, 14.549400116419456], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/api/getevents/ST001-73", 200, 36, 18.0, 2095.9600000000005, 2, 12315, 701.0, 5017.9, 5445.7, 12311.99, 5.1852427989940635, 3.8686266074252678, 2.049917886819113], "isController": false}, {"data": ["/api/collegebirthdaystudent/ghj-76", 200, 22, 11.0, 1426.1800000000003, 2, 12315, 583.5, 4017.4, 6638.299999999985, 12220.5, 5.969614661373608, 4.03030605468167, 2.464069215816494], "isController": false}, {"data": ["/api/studentAttendancebystudentid/ST001-70", 200, 33, 16.5, 3183.264999999999, 2, 21386, 1559.0, 12166.6, 12216.75, 12493.78, 4.840974003969599, 4.132390616679576, 1.8971748756474802], "isController": false}, {"data": ["/api/auth/login-61", 200, 3, 1.5, 4191.915000000001, 60, 11443, 3658.0, 8787.400000000001, 10680.549999999997, 11288.93, 5.82631747603927, 2.6619556944970433, 2.9302280275002186], "isController": false}, {"data": ["/api/auth/login-62", 200, 57, 28.5, 3218.495, 2, 12526, 1966.0, 8103.700000000001, 10245.049999999997, 12006.840000000002, 5.648600559211455, 7.0393202174005145, 2.1950660356709126], "isController": false}, {"data": ["/api/collegeannouncement-67", 200, 35, 17.5, 2272.0950000000007, 1, 12469, 1288.0, 4450.1, 10888.09999999996, 12308.320000000002, 4.848955050186685, 32.70558622351258, 1.824395661094409], "isController": false}, {"data": ["/api/timetabledataa/ghj-78", 200, 8, 4.0, 2243.0600000000018, 2, 12225, 1507.5, 5332.2, 7792.95, 12140.97, 5.435668859053107, 2.759982096265696, 0.7788825114149047], "isController": false}, {"data": ["/api/event/ST001-68", 200, 40, 20.0, 3938.5600000000036, 1, 21383, 2995.5, 12167.9, 12224.95, 12290.84, 4.644681839294009, 18.022635566651182, 1.6607232277635855], "isController": false}, {"data": ["/api/collegestudent/ST001-63", 200, 22, 11.0, 4750.150000000001, 6, 12820, 4489.0, 9468.900000000001, 10499.449999999999, 12163.540000000003, 4.610206998294224, 657.6326794162902, 1.8702178106703242], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Proxy Error", 3, 1.171875, 0.16666666666666666], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 253, 98.828125, 14.055555555555555], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1800, 256, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 253, "502/Proxy Error", 3, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["/api/getevents/ST001-73", 200, 36, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 36, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegebirthdaystudent/ghj-76", 200, 22, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 22, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/studentAttendancebystudentid/ST001-70", 200, 33, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 33, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/auth/login-61", 200, 3, "502/Proxy Error", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/auth/login-62", 200, 57, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 57, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegeannouncement-67", 200, 35, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 35, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/timetabledataa/ghj-78", 200, 8, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/event/ST001-68", 200, 40, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 40, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegestudent/ST001-63", 200, 22, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 22, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
