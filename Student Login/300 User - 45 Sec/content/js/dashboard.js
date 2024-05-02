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

    var data = {"OkPercent": 77.07407407407408, "KoPercent": 22.925925925925927};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.13703703703703704, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.22166666666666668, 500, 1500, "/api/getevents/ST001-73"], "isController": false}, {"data": [0.2866666666666667, 500, 1500, "/api/collegebirthdaystudent/ghj-76"], "isController": false}, {"data": [0.16833333333333333, 500, 1500, "/api/studentAttendancebystudentid/ST001-70"], "isController": false}, {"data": [0.11333333333333333, 500, 1500, "/api/auth/login-61"], "isController": false}, {"data": [0.06333333333333334, 500, 1500, "/api/auth/login-62"], "isController": false}, {"data": [0.10166666666666667, 500, 1500, "/api/collegeannouncement-67"], "isController": false}, {"data": [0.19166666666666668, 500, 1500, "/api/timetabledataa/ghj-78"], "isController": false}, {"data": [0.03333333333333333, 500, 1500, "/api/event/ST001-68"], "isController": false}, {"data": [0.05333333333333334, 500, 1500, "/api/collegestudent/ST001-63"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2700, 619, 22.925925925925927, 3606.015185185191, 0, 24834, 2758.5, 8756.9, 10878.149999999998, 12777.96, 41.902042336582035, 1005.241301688885, 14.238464935168228], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/api/getevents/ST001-73", 300, 110, 36.666666666666664, 2533.4766666666646, 0, 13630, 524.5, 8129.30000000001, 11165.5, 12115.99, 5.255965520866183, 5.507694103901678, 1.6038907284768211], "isController": false}, {"data": ["/api/collegebirthdaystudent/ghj-76", 300, 75, 25.0, 2162.3133333333344, 1, 12614, 825.0, 6428.9, 8200.499999999998, 11813.010000000006, 5.384353069978642, 4.756196072338784, 1.8928139358274854], "isController": false}, {"data": ["/api/studentAttendancebystudentid/ST001-70", 300, 58, 19.333333333333332, 3328.5266666666653, 1, 24139, 3141.0, 7322.800000000001, 8755.85, 12069.350000000002, 4.982974835977078, 4.378626930902749, 1.8930113777925421], "isController": false}, {"data": ["/api/auth/login-61", 300, 5, 1.6666666666666667, 5389.2333333333345, 57, 12427, 4836.5, 10624.2, 11265.349999999999, 12132.52, 5.718860802928057, 2.6146289055053566, 2.876184876472607], "isController": false}, {"data": ["/api/auth/login-62", 300, 121, 40.333333333333336, 2602.936666666667, 1, 12653, 1415.0, 7189.000000000005, 9127.749999999998, 12216.830000000002, 5.3765367934334565, 7.450108818864475, 1.7438041014014838], "isController": false}, {"data": ["/api/collegeannouncement-67", 300, 93, 31.0, 3122.6833333333316, 1, 24134, 1921.5, 7282.6, 11015.749999999993, 12968.97, 4.986702127659575, 29.812492208277927, 1.569204127534907], "isController": false}, {"data": ["/api/timetabledataa/ghj-78", 300, 63, 21.0, 3293.7266666666656, 2, 13001, 2584.5, 7787.8, 10857.39999999999, 12220.720000000001, 5.260758250622523, 4.135243682706133, 0.625674034650861], "isController": false}, {"data": ["/api/event/ST001-68", 300, 66, 22.0, 3815.929999999998, 0, 12774, 3214.5, 7882.400000000002, 10945.149999999998, 12764.96, 4.838241460503823, 24.417921123560625, 1.6839978187594749], "isController": false}, {"data": ["/api/collegestudent/ST001-63", 300, 28, 9.333333333333334, 6205.309999999999, 5, 24834, 6052.5, 10984.400000000001, 13159.0, 14916.020000000002, 4.894682742980209, 976.2361718839227, 2.0200604238387365], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 3, 0.48465266558966075, 0.1111111111111111], "isController": false}, {"data": ["502/Proxy Error", 9, 1.4539579967689822, 0.3333333333333333], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 607, 98.06138933764136, 22.48148148148148], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2700, 619, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 607, "502/Proxy Error", 9, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 3, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["/api/getevents/ST001-73", 300, 110, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 110, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegebirthdaystudent/ghj-76", 300, 75, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 73, "502/Proxy Error", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/studentAttendancebystudentid/ST001-70", 300, 58, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 57, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/auth/login-61", 300, 5, "502/Proxy Error", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/auth/login-62", 300, 121, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 120, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegeannouncement-67", 300, 93, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 93, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/timetabledataa/ghj-78", 300, 63, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 60, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 2, "502/Proxy Error", 1, "", "", "", ""], "isController": false}, {"data": ["/api/event/ST001-68", 300, 66, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 66, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegestudent/ST001-63", 300, 28, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 28, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
