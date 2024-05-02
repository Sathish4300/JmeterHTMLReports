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

    var data = {"OkPercent": 90.74074074074075, "KoPercent": 9.25925925925926};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.18925925925925927, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.25833333333333336, 500, 1500, "/api/getevents/ST001-73"], "isController": false}, {"data": [0.31333333333333335, 500, 1500, "/api/collegebirthdaystudent/ghj-76"], "isController": false}, {"data": [0.215, 500, 1500, "/api/studentAttendancebystudentid/ST001-70"], "isController": false}, {"data": [0.15, 500, 1500, "/api/auth/login-61"], "isController": false}, {"data": [0.11333333333333333, 500, 1500, "/api/auth/login-62"], "isController": false}, {"data": [0.175, 500, 1500, "/api/collegeannouncement-67"], "isController": false}, {"data": [0.285, 500, 1500, "/api/timetabledataa/ghj-78"], "isController": false}, {"data": [0.10166666666666667, 500, 1500, "/api/event/ST001-68"], "isController": false}, {"data": [0.09166666666666666, 500, 1500, "/api/collegestudent/ST001-63"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2700, 250, 9.25925925925926, 2817.7933333333317, 1, 21758, 2665.0, 5859.5, 6773.849999999999, 8070.659999999993, 37.92454420316319, 448.52989992573106, 15.214274223424725], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/api/getevents/ST001-73", 300, 30, 10.0, 2628.933333333335, 3, 16481, 1857.5, 5708.0, 6800.0, 8468.980000000001, 4.482830758196108, 2.737226383887212, 1.9486013101072892], "isController": false}, {"data": ["/api/collegebirthdaystudent/ghj-76", 300, 25, 8.333333333333334, 2330.4700000000003, 4, 8371, 1479.5, 5599.300000000005, 6519.249999999996, 7023.530000000001, 4.572961602365745, 2.896238786717071, 1.9433151637501336], "isController": false}, {"data": ["/api/studentAttendancebystudentid/ST001-70", 300, 33, 11.0, 2700.0133333333347, 3, 13511, 2651.0, 5622.1, 6592.699999999999, 7772.350000000007, 4.4022480813535445, 3.511065119337608, 1.8425815699884072], "isController": false}, {"data": ["/api/auth/login-61", 300, 3, 1.0, 2738.919999999999, 101, 7912, 2626.0, 4856.100000000002, 5319.45, 7512.980000000005, 4.822143281950718, 2.1986901351003807, 2.425199013871699], "isController": false}, {"data": ["/api/auth/login-62", 300, 55, 18.333333333333332, 2547.1366666666668, 2, 7969, 2404.0, 5407.100000000001, 5982.799999999999, 7738.750000000002, 4.481692287007574, 5.0722632032522155, 1.9898305266735388], "isController": false}, {"data": ["/api/collegeannouncement-67", 300, 24, 8.0, 3226.169999999999, 3, 21758, 3203.5, 6697.300000000006, 6981.15, 8471.610000000004, 4.446816079686943, 32.39092967638296, 1.865752012184276], "isController": false}, {"data": ["/api/timetabledataa/ghj-78", 300, 32, 10.666666666666666, 2286.586666666666, 2, 7023, 1499.5, 5563.6, 6189.849999999999, 6913.860000000001, 4.570871360443679, 2.8176029493547454, 0.60904777798516], "isController": false}, {"data": ["/api/event/ST001-68", 300, 39, 13.0, 2947.206666666667, 1, 16485, 2927.5, 5478.500000000003, 6130.2, 7907.860000000001, 4.387761071783771, 11.564878417883051, 1.7096271134382495], "isController": false}, {"data": ["/api/collegestudent/ST001-63", 300, 9, 3.0, 3954.7033333333325, 4, 21758, 3515.0, 7467.600000000002, 8092.849999999999, 10179.84, 4.388274530454625, 404.9354032275759, 1.9439399071514245], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Proxy Error", 3, 1.2, 0.1111111111111111], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 247, 98.8, 9.148148148148149], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2700, 250, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 247, "502/Proxy Error", 3, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["/api/getevents/ST001-73", 300, 30, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegebirthdaystudent/ghj-76", 300, 25, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 25, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/studentAttendancebystudentid/ST001-70", 300, 33, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 33, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/auth/login-61", 300, 3, "502/Proxy Error", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/auth/login-62", 300, 55, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 55, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegeannouncement-67", 300, 24, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 24, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/timetabledataa/ghj-78", 300, 32, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 32, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/event/ST001-68", 300, 39, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 39, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegestudent/ST001-63", 300, 9, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 9, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
