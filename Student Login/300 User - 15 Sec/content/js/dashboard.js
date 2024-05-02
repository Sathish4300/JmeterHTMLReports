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

    var data = {"OkPercent": 67.48148148148148, "KoPercent": 32.51851851851852};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.11555555555555555, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.15833333333333333, 500, 1500, "/api/getevents/ST001-73"], "isController": false}, {"data": [0.3566666666666667, 500, 1500, "/api/collegebirthdaystudent/ghj-76"], "isController": false}, {"data": [0.065, 500, 1500, "/api/studentAttendancebystudentid/ST001-70"], "isController": false}, {"data": [0.10833333333333334, 500, 1500, "/api/auth/login-61"], "isController": false}, {"data": [0.03333333333333333, 500, 1500, "/api/auth/login-62"], "isController": false}, {"data": [0.018333333333333333, 500, 1500, "/api/collegeannouncement-67"], "isController": false}, {"data": [0.27166666666666667, 500, 1500, "/api/timetabledataa/ghj-78"], "isController": false}, {"data": [0.013333333333333334, 500, 1500, "/api/event/ST001-68"], "isController": false}, {"data": [0.015, 500, 1500, "/api/collegestudent/ST001-63"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2700, 878, 32.51851851851852, 6222.104814814809, 1, 33219, 1995.5, 18944.9, 23451.54999999999, 28461.869999999995, 41.74397031539888, 1026.2195254522262, 12.922784525742113], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/api/getevents/ST001-73", 300, 110, 36.666666666666664, 3717.9466666666694, 1, 26259, 867.5, 15534.200000000003, 18373.949999999997, 24753.70000000001, 7.657358721731584, 8.024323679743734, 2.3368902828117823], "isController": false}, {"data": ["/api/collegebirthdaystudent/ghj-76", 300, 77, 25.666666666666668, 979.6866666666668, 1, 8756, 839.0, 1639.400000000001, 3138.2999999999993, 7539.99, 13.588802826470987, 12.277474506839697, 4.686986881143271], "isController": false}, {"data": ["/api/studentAttendancebystudentid/ST001-70", 300, 127, 42.333333333333336, 4930.6766666666645, 1, 27952, 1149.0, 19595.200000000044, 23625.149999999998, 25729.32, 5.842714135473065, 7.108045934688194, 1.5797580690316677], "isController": false}, {"data": ["/api/auth/login-61", 300, 37, 12.333333333333334, 11027.286666666667, 63, 19659, 13760.0, 18714.4, 19055.95, 19515.56, 9.205277692543724, 4.390785612918073, 4.629607433261736], "isController": false}, {"data": ["/api/auth/login-62", 300, 126, 42.0, 5025.300000000001, 1, 33219, 3366.5, 12411.500000000007, 15719.699999999997, 18604.390000000003, 6.592971891963167, 9.23256433641738, 2.078545988726018], "isController": false}, {"data": ["/api/collegeannouncement-67", 300, 106, 35.333333333333336, 7896.24666666667, 1, 28462, 4026.5, 21962.7, 23283.45, 26586.85, 5.22866703848299, 29.948518054151563, 1.5499627729799916], "isController": false}, {"data": ["/api/timetabledataa/ghj-78", 300, 114, 38.0, 1717.193333333333, 1, 23306, 547.0, 3742.800000000006, 8181.75, 22742.47, 11.040370956464137, 11.767986029330586, 1.024325042321422], "isController": false}, {"data": ["/api/event/ST001-68", 300, 123, 41.0, 6188.206666666667, 1, 32993, 4921.5, 18526.900000000005, 22948.8, 24655.480000000003, 5.195434944495436, 26.16023262559964, 1.4982031101172435], "isController": false}, {"data": ["/api/collegestudent/ST001-63", 300, 58, 19.333333333333332, 14516.400000000007, 9, 31467, 11499.0, 27799.300000000003, 29924.35, 30923.730000000003, 4.97223833595757, 1016.2195968343416, 1.8391940571393055], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 2, 0.22779043280182232, 0.07407407407407407], "isController": false}, {"data": ["502/Proxy Error", 57, 6.492027334851937, 2.111111111111111], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 819, 93.28018223234623, 30.333333333333332], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2700, 878, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 819, "502/Proxy Error", 57, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 2, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["/api/getevents/ST001-73", 300, 110, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 110, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegebirthdaystudent/ghj-76", 300, 77, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 77, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/studentAttendancebystudentid/ST001-70", 300, 127, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 127, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/auth/login-61", 300, 37, "502/Proxy Error", 37, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/auth/login-62", 300, 126, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 126, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegeannouncement-67", 300, 106, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 105, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/timetabledataa/ghj-78", 300, 114, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 112, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/event/ST001-68", 300, 123, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 106, "502/Proxy Error", 17, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegestudent/ST001-63", 300, 58, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 56, "502/Proxy Error", 2, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
