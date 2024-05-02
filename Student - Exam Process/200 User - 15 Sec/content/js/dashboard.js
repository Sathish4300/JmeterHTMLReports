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

    var data = {"OkPercent": 66.11111111111111, "KoPercent": 33.888888888888886};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.26975, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.1175, 500, 1500, "/api/getevents/ST001-73"], "isController": false}, {"data": [0.1275, 500, 1500, "/api/studentAttendancebystudentid/ST001-70"], "isController": false}, {"data": [0.1875, 500, 1500, "/api/examstatus/ST001-554"], "isController": false}, {"data": [0.3275, 500, 1500, "/api/collegestudent/ST001-558"], "isController": false}, {"data": [0.2175, 500, 1500, "/api/timetabledataa/ghj-78"], "isController": false}, {"data": [0.335, 500, 1500, "/api/collegeexambysectionid/ghj-555"], "isController": false}, {"data": [0.02, 500, 1500, "/api/collegestudent/ST001-63"], "isController": false}, {"data": [0.26, 500, 1500, "/api/collegestudent/ST001-556"], "isController": false}, {"data": [0.255, 500, 1500, "/api/collegebirthdaystudent/ghj-76"], "isController": false}, {"data": [0.1625, 500, 1500, "/api/collegestudent/ST001-553"], "isController": false}, {"data": [0.6925, 500, 1500, "/api/createstatus-559"], "isController": false}, {"data": [0.015, 500, 1500, "/api/auth/login-62"], "isController": false}, {"data": [0.9, 500, 1500, "/api/collegeexambyexamid/Exam%20-%202-562"], "isController": false}, {"data": [0.0, 500, 1500, "Exam Module"], "isController": true}, {"data": [0.1275, 500, 1500, "/api/collegeannouncement-67"], "isController": false}, {"data": [0.4725, 500, 1500, "/api/collegeexambyexamid/Exam%20-%202-557"], "isController": false}, {"data": [0.0375, 500, 1500, "/api/event/ST001-68"], "isController": false}, {"data": [0.0, 500, 1500, "Login Module"], "isController": true}, {"data": [0.7025, 500, 1500, "/api/getQuestionsbyexamid/Exam%20-%202-560"], "isController": false}, {"data": [0.4375, 500, 1500, "/api/createstatus-561"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3600, 1220, 33.888888888888886, 2850.686111111105, 0, 39751, 746.5, 9086.6, 18165.049999999992, 32305.98, 57.927172671247206, 171.9226912350958, 18.273159932297617], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/api/getevents/ST001-73", 200, 91, 45.5, 1639.5899999999992, 2, 19768, 972.5, 2849.2000000000003, 3413.249999999995, 19694.990000000005, 7.433286255853713, 8.64083231899948, 2.0096368491228724], "isController": false}, {"data": ["/api/studentAttendancebystudentid/ST001-70", 200, 82, 41.0, 2641.225, 1, 32616, 1284.5, 8613.2, 9250.849999999999, 32462.750000000124, 4.812782750986621, 5.8355460854028305, 1.3815600484887862], "isController": false}, {"data": ["/api/examstatus/ST001-554", 200, 89, 44.5, 758.9450000000004, 1, 2108, 930.0, 1707.5000000000002, 1888.95, 2102.6900000000005, 23.180343069077423, 49.74300152845387, 5.877711013560501], "isController": false}, {"data": ["/api/collegestudent/ST001-558", 200, 65, 32.5, 683.5, 0, 3898, 745.5, 1344.6000000000001, 1475.95, 2054.1500000000015, 25.39037704709915, 234.94318407229912, 7.896308080487495], "isController": false}, {"data": ["/api/timetabledataa/ghj-78", 200, 82, 41.0, 773.505, 1, 3396, 570.5, 1812.4, 2013.6999999999998, 3320.470000000003, 19.184652278177456, 21.192015137889687, 1.6813736510791366], "isController": false}, {"data": ["/api/collegeexambysectionid/ghj-555", 200, 86, 43.0, 524.28, 0, 1758, 340.0, 1282.7, 1522.7999999999995, 1676.5000000000005, 23.806689679800023, 32.375005579692896, 6.344575794548268], "isController": false}, {"data": ["/api/collegestudent/ST001-63", 200, 74, 37.0, 8175.450000000002, 13, 22064, 6700.5, 15730.4, 18159.949999999997, 20913.680000000004, 3.8661537569349136, 35.860558254479905, 1.1222228632251454], "isController": false}, {"data": ["/api/collegestudent/ST001-556", 200, 88, 44.0, 671.2399999999998, 1, 5519, 779.0, 1340.6, 1501.4499999999996, 3452.390000000016, 26.01795238714713, 242.51259736405618, 6.712326818004422], "isController": false}, {"data": ["/api/collegebirthdaystudent/ghj-76", 200, 84, 42.0, 712.0550000000003, 0, 2221, 503.0, 1687.3, 2018.4499999999994, 2198.9, 23.90057361376673, 28.29428794962954, 6.433665638444072], "isController": false}, {"data": ["/api/collegestudent/ST001-553", 200, 82, 41.0, 878.2449999999999, 2, 3222, 1016.5, 1858.9, 1993.7499999999995, 2356.900000000001, 23.22071287588529, 127.676958159178, 6.313131313131313], "isController": false}, {"data": ["/api/createstatus-559", 200, 58, 29.0, 152.22499999999997, 1, 669, 73.5, 344.9, 446.5999999999999, 652.8200000000002, 28.710881424059718, 26.402655532227964, 10.291897699540625], "isController": false}, {"data": ["/api/auth/login-62", 200, 2, 1.0, 17630.454999999998, 567, 39751, 19573.5, 32219.0, 33885.5, 39372.36000000004, 3.8169395778464827, 3.5808596284686436, 2.105709396112447], "isController": false}, {"data": ["/api/collegeexambyexamid/Exam%20-%202-562", 200, 5, 2.5, 279.6050000000002, 13, 1267, 219.0, 604.0, 788.5999999999997, 1059.5300000000004, 27.624309392265193, 20.282690564571823, 12.529674551104971], "isController": false}, {"data": ["Exam Module", 200, 197, 98.5, 5495.990000000008, 2441, 9607, 5249.5, 7517.8, 8184.0, 9338.590000000002, 16.342539630658607, 527.545478223566, 55.521544063572485], "isController": true}, {"data": ["/api/collegeannouncement-67", 200, 93, 46.5, 7033.694999999997, 1, 33794, 1376.5, 21690.1, 32596.45, 33787.92, 4.419694157164324, 22.00004195256563, 1.249685787368514], "isController": false}, {"data": ["/api/collegeexambyexamid/Exam%20-%202-557", 200, 67, 33.5, 444.445, 0, 1621, 223.0, 1165.6000000000001, 1354.2499999999995, 1613.2100000000007, 27.045300878972277, 32.753470461460445, 8.425773326572008], "isController": false}, {"data": ["/api/event/ST001-68", 200, 97, 48.5, 7210.384999999998, 0, 33775, 5590.0, 21017.5, 21144.3, 33753.18000000001, 3.869220352099052, 4.9799586477074875, 0.9356031751789515], "isController": false}, {"data": ["Login Module", 200, 200, 100.0, 45816.35999999999, 38247, 53514, 45751.5, 50594.4, 51110.15, 52697.3, 3.425537381176672, 72.42233329943478, 7.812784346364649], "isController": true}, {"data": ["/api/getQuestionsbyexamid/Exam%20-%202-560", 200, 29, 14.5, 426.00499999999994, 0, 2593, 214.0, 1051.0, 1212.5, 1540.7600000000011, 26.838432635534087, 22.21797629830918, 12.010853839573269], "isController": false}, {"data": ["/api/createstatus-561", 200, 46, 23.0, 677.5000000000003, 2, 1994, 770.5, 1242.9, 1394.1, 1534.8700000000001, 27.498968788670425, 27.755428897978828, 12.796016731403823], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 2, 0.16393442622950818, 0.05555555555555555], "isController": false}, {"data": ["502/Proxy Error", 28, 2.2950819672131146, 0.7777777777777778], "isController": false}, {"data": ["404/Not Found", 1, 0.08196721311475409, 0.027777777777777776], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 1189, 97.45901639344262, 33.02777777777778], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3600, 1220, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 1189, "502/Proxy Error", 28, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 2, "404/Not Found", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["/api/getevents/ST001-73", 200, 91, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 89, "502/Proxy Error", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/studentAttendancebystudentid/ST001-70", 200, 82, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 79, "502/Proxy Error", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/examstatus/ST001-554", 200, 89, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 89, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegestudent/ST001-558", 200, 65, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 64, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/timetabledataa/ghj-78", 200, 82, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 82, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegeexambysectionid/ghj-555", 200, 86, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 85, "404/Not Found", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegestudent/ST001-63", 200, 74, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 74, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegestudent/ST001-556", 200, 88, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 88, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegebirthdaystudent/ghj-76", 200, 84, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 84, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegestudent/ST001-553", 200, 82, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 81, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/createstatus-559", 200, 58, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 58, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/auth/login-62", 200, 2, "502/Proxy Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegeexambyexamid/Exam%20-%202-562", 200, 5, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/collegeannouncement-67", 200, 93, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 76, "502/Proxy Error", 17, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegeexambyexamid/Exam%20-%202-557", 200, 67, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 67, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/event/ST001-68", 200, 97, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 93, "502/Proxy Error", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/getQuestionsbyexamid/Exam%20-%202-560", 200, 29, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 29, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/createstatus-561", 200, 46, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 46, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
