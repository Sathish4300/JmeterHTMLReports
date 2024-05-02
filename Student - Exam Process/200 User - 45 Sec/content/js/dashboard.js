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

    var data = {"OkPercent": 85.83333333333333, "KoPercent": 14.166666666666666};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.2605, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.145, 500, 1500, "/api/getevents/ST001-73"], "isController": false}, {"data": [0.1, 500, 1500, "/api/studentAttendancebystudentid/ST001-70"], "isController": false}, {"data": [0.2575, 500, 1500, "/api/examstatus/ST001-554"], "isController": false}, {"data": [0.33, 500, 1500, "/api/collegestudent/ST001-558"], "isController": false}, {"data": [0.2125, 500, 1500, "/api/timetabledataa/ghj-78"], "isController": false}, {"data": [0.32, 500, 1500, "/api/collegeexambysectionid/ghj-555"], "isController": false}, {"data": [0.1175, 500, 1500, "/api/collegestudent/ST001-63"], "isController": false}, {"data": [0.3075, 500, 1500, "/api/collegestudent/ST001-556"], "isController": false}, {"data": [0.19, 500, 1500, "/api/collegebirthdaystudent/ghj-76"], "isController": false}, {"data": [0.2125, 500, 1500, "/api/collegestudent/ST001-553"], "isController": false}, {"data": [0.7425, 500, 1500, "/api/createstatus-559"], "isController": false}, {"data": [0.0575, 500, 1500, "/api/auth/login-62"], "isController": false}, {"data": [0.575, 500, 1500, "/api/collegeexambyexamid/Exam%20-%202-562"], "isController": false}, {"data": [0.0, 500, 1500, "Exam Module"], "isController": true}, {"data": [0.07, 500, 1500, "/api/collegeannouncement-67"], "isController": false}, {"data": [0.43, 500, 1500, "/api/collegeexambyexamid/Exam%20-%202-557"], "isController": false}, {"data": [0.0825, 500, 1500, "/api/event/ST001-68"], "isController": false}, {"data": [0.0, 500, 1500, "Login Module"], "isController": true}, {"data": [0.57, 500, 1500, "/api/getQuestionsbyexamid/Exam%20-%202-560"], "isController": false}, {"data": [0.49, 500, 1500, "/api/createstatus-561"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3600, 510, 14.166666666666666, 2209.600833333327, 1, 25929, 1052.0, 6592.6, 8537.199999999997, 10367.329999999964, 53.1624259787055, 75.31955140511245, 21.44957656958371], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/api/getevents/ST001-73", 200, 45, 22.5, 2376.309999999999, 1, 10407, 1518.5, 6798.800000000003, 8875.1, 9784.87, 3.580956473474065, 2.875256262197633, 1.3522132269341642], "isController": false}, {"data": ["/api/studentAttendancebystudentid/ST001-70", 200, 50, 25.0, 2404.9749999999985, 1, 12355, 1568.0, 6306.9000000000015, 8522.849999999997, 9413.97, 3.6288420365061507, 3.6664948164259537, 1.2915346486373698], "isController": false}, {"data": ["/api/examstatus/ST001-554", 200, 33, 16.5, 1892.8699999999994, 4, 10439, 1037.5, 4722.5, 7666.749999999997, 9401.260000000002, 3.586736249349904, 6.691224601423934, 1.3685640501425727], "isController": false}, {"data": ["/api/collegestudent/ST001-558", 200, 17, 8.5, 1574.3249999999998, 6, 9779, 883.0, 4048.2000000000003, 5882.599999999997, 8841.120000000003, 4.219765381044814, 6.217004236908178, 1.7794099515254451], "isController": false}, {"data": ["/api/timetabledataa/ghj-78", 200, 37, 18.5, 2254.850000000001, 2, 13394, 1465.0, 6481.9, 8492.649999999998, 9766.92, 3.60555255092843, 2.677756557598702, 0.4428949488462232], "isController": false}, {"data": ["/api/collegeexambysectionid/ghj-555", 200, 23, 11.5, 1933.0650000000007, 5, 10408, 1010.0, 5097.700000000001, 8076.249999999996, 10366.880000000001, 3.7180941049617964, 4.22620942629808, 1.5307182834953803], "isController": false}, {"data": ["/api/collegestudent/ST001-63", 200, 19, 9.5, 3404.6099999999988, 4, 10398, 2554.5, 7242.700000000001, 7941.999999999998, 10119.930000000004, 3.5861574323112784, 5.308703716155639, 1.4957148220369374], "isController": false}, {"data": ["/api/collegestudent/ST001-556", 200, 29, 14.5, 1771.4549999999995, 3, 9783, 980.5, 4788.200000000002, 8004.149999999993, 9531.500000000005, 3.8449707782220854, 5.815386882161258, 1.5150273773934944], "isController": false}, {"data": ["/api/collegebirthdaystudent/ghj-76", 200, 51, 25.5, 2014.7599999999986, 3, 11207, 1092.0, 6239.400000000001, 7836.8499999999985, 9752.530000000002, 3.5801872437928504, 3.3924896342391206, 1.24161522944525], "isController": false}, {"data": ["/api/collegestudent/ST001-553", 200, 28, 14.0, 2297.3149999999987, 1, 13040, 1282.0, 7186.5000000000055, 8521.95, 10432.69, 3.583844031107766, 5.409539576837616, 1.4204306828566822], "isController": false}, {"data": ["/api/createstatus-559", 200, 20, 10.0, 710.4849999999994, 3, 7967, 139.5, 2534.1000000000017, 4808.9, 7716.2400000000025, 4.208045783538124, 2.5835716248842786, 1.9121129912893453], "isController": false}, {"data": ["/api/auth/login-62", 200, 0, 0.0, 5492.215, 641, 14610, 5545.5, 9690.800000000001, 11263.249999999996, 13729.730000000007, 3.664950248300379, 3.4493302017096994, 2.0218607124205166], "isController": false}, {"data": ["/api/collegeexambyexamid/Exam%20-%202-562", 200, 20, 10.0, 983.7099999999997, 8, 9779, 661.5, 1520.5, 5384.0, 9754.980000000009, 5.141388174807197, 5.4844402715295635, 2.200353470437018], "isController": false}, {"data": ["Exam Module", 200, 104, 52.0, 15436.810000000003, 4960, 48683, 8370.5, 34637.2, 36063.2, 40826.49000000001, 3.348064818534887, 40.02696500016741, 14.633626236691443], "isController": true}, {"data": ["/api/collegeannouncement-67", 200, 35, 17.5, 3393.1000000000004, 1, 12798, 2272.5, 9058.6, 9289.849999999999, 11192.770000000013, 3.5326950930865157, 23.827717912088882, 1.3291592792860425], "isController": false}, {"data": ["/api/collegeexambyexamid/Exam%20-%202-557", 200, 19, 9.5, 1626.0049999999994, 1, 10429, 944.0, 4880.200000000001, 7405.9, 9763.93, 4.010266281681104, 4.322628428777671, 1.7282524512752646], "isController": false}, {"data": ["/api/event/ST001-68", 200, 48, 24.0, 2995.1850000000004, 1, 22291, 2034.0, 7293.2, 9093.6, 15814.28000000003, 3.537131033019118, 3.1015354188405286, 1.215267031285924], "isController": false}, {"data": ["Login Module", 200, 132, 66.0, 24336.005000000016, 7972, 40664, 24066.0, 34740.600000000006, 36973.95, 40506.950000000004, 3.183344740318653, 43.124186754898375, 9.205384304319798], "isController": true}, {"data": ["/api/getQuestionsbyexamid/Exam%20-%202-560", 200, 23, 11.5, 1082.955, 2, 10955, 750.0, 3181.100000000002, 5108.7, 9053.180000000002, 4.520795660036167, 4.0710118105786615, 2.132168816399186], "isController": false}, {"data": ["/api/createstatus-561", 200, 13, 6.5, 1564.6250000000007, 4, 25929, 933.5, 4723.8, 8139.5, 9783.86, 4.613929453018663, 3.6854662664082865, 2.678399564848778], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 510, 100.0, 14.166666666666666], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3600, 510, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 510, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["/api/getevents/ST001-73", 200, 45, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 45, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/studentAttendancebystudentid/ST001-70", 200, 50, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/examstatus/ST001-554", 200, 33, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 33, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegestudent/ST001-558", 200, 17, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/timetabledataa/ghj-78", 200, 37, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 37, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegeexambysectionid/ghj-555", 200, 23, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 23, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegestudent/ST001-63", 200, 19, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegestudent/ST001-556", 200, 29, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 29, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegebirthdaystudent/ghj-76", 200, 51, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 51, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegestudent/ST001-553", 200, 28, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 28, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/createstatus-559", 200, 20, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/collegeexambyexamid/Exam%20-%202-562", 200, 20, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/collegeannouncement-67", 200, 35, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 35, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegeexambyexamid/Exam%20-%202-557", 200, 19, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/event/ST001-68", 200, 48, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 48, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/getQuestionsbyexamid/Exam%20-%202-560", 200, 23, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 23, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/createstatus-561", 200, 13, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 13, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
