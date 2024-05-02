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

    var data = {"OkPercent": 71.72222222222223, "KoPercent": 28.27777777777778};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.2165, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0975, 500, 1500, "/api/getevents/ST001-73"], "isController": false}, {"data": [0.0575, 500, 1500, "/api/studentAttendancebystudentid/ST001-70"], "isController": false}, {"data": [0.1225, 500, 1500, "/api/examstatus/ST001-554"], "isController": false}, {"data": [0.33, 500, 1500, "/api/collegestudent/ST001-558"], "isController": false}, {"data": [0.145, 500, 1500, "/api/timetabledataa/ghj-78"], "isController": false}, {"data": [0.225, 500, 1500, "/api/collegeexambysectionid/ghj-555"], "isController": false}, {"data": [0.065, 500, 1500, "/api/collegestudent/ST001-63"], "isController": false}, {"data": [0.18, 500, 1500, "/api/collegestudent/ST001-556"], "isController": false}, {"data": [0.1425, 500, 1500, "/api/collegebirthdaystudent/ghj-76"], "isController": false}, {"data": [0.1025, 500, 1500, "/api/collegestudent/ST001-553"], "isController": false}, {"data": [0.72, 500, 1500, "/api/createstatus-559"], "isController": false}, {"data": [0.0225, 500, 1500, "/api/auth/login-62"], "isController": false}, {"data": [0.785, 500, 1500, "/api/collegeexambyexamid/Exam%20-%202-562"], "isController": false}, {"data": [0.0, 500, 1500, "Exam Module"], "isController": true}, {"data": [0.035, 500, 1500, "/api/collegeannouncement-67"], "isController": false}, {"data": [0.37, 500, 1500, "/api/collegeexambyexamid/Exam%20-%202-557"], "isController": false}, {"data": [0.0125, 500, 1500, "/api/event/ST001-68"], "isController": false}, {"data": [0.0, 500, 1500, "Login Module"], "isController": true}, {"data": [0.6025, 500, 1500, "/api/getQuestionsbyexamid/Exam%20-%202-560"], "isController": false}, {"data": [0.315, 500, 1500, "/api/createstatus-561"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3600, 1018, 28.27777777777778, 2420.291388888893, 0, 36000, 1030.5, 7348.700000000001, 11641.949999999986, 17049.98, 56.05293888672635, 121.31649292039705, 19.06745693849747], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/api/getevents/ST001-73", 200, 62, 31.0, 3430.1749999999997, 1, 21270, 1532.0, 10362.6, 14195.85, 18176.460000000003, 4.110658938627862, 3.8696996585583916, 1.3817674934229456], "isController": false}, {"data": ["/api/studentAttendancebystudentid/ST001-70", 200, 90, 45.0, 2981.725, 1, 18252, 1200.5, 9554.900000000001, 14409.499999999998, 17259.71, 3.915426781519186, 5.049925515123336, 1.0217963855716523], "isController": false}, {"data": ["/api/examstatus/ST001-554", 200, 75, 37.5, 1398.505, 1, 16658, 1212.5, 2414.0000000000005, 4766.8499999999985, 12926.120000000032, 5.8095625399407425, 12.250602969049554, 1.6589591624063207], "isController": false}, {"data": ["/api/collegestudent/ST001-558", 200, 35, 17.5, 987.7649999999998, 1, 2679, 1083.5, 1782.2, 1958.1999999999998, 2532.370000000001, 13.866740622616653, 74.06417105057893, 5.271798949594398], "isController": false}, {"data": ["/api/timetabledataa/ghj-78", 200, 91, 45.5, 1892.0999999999995, 1, 18176, 689.5, 6740.700000000001, 10642.499999999996, 16639.360000000022, 4.398504508467121, 5.185145253738729, 0.3597624463932263], "isController": false}, {"data": ["/api/collegeexambysectionid/ghj-555", 200, 80, 40.0, 1062.9400000000007, 1, 13177, 806.0, 1989.0000000000005, 2439.5499999999993, 12698.470000000023, 7.176432595356848, 10.146347364006603, 2.001551903548746], "isController": false}, {"data": ["/api/collegestudent/ST001-63", 200, 27, 13.5, 5537.394999999996, 2, 16557, 4969.5, 11772.000000000002, 13225.699999999999, 14256.44, 3.845192548016842, 5.790751080258782, 1.5328762460827101], "isController": false}, {"data": ["/api/collegestudent/ST001-556", 200, 70, 35.0, 1061.4800000000002, 0, 7753, 1176.0, 1914.5, 2293.9, 6364.730000000014, 9.41132182014964, 51.32796140475742, 2.818893081502047], "isController": false}, {"data": ["/api/collegebirthdaystudent/ghj-76", 200, 69, 34.5, 2052.060000000001, 2, 17231, 1239.0, 5294.6, 9699.399999999983, 14265.400000000009, 4.698144233027954, 5.078033239370448, 1.4319475643058492], "isController": false}, {"data": ["/api/collegestudent/ST001-553", 200, 91, 45.5, 1498.1800000000003, 1, 14404, 1049.5, 2456.4, 6138.799999999992, 14376.930000000011, 5.2201602589199485, 28.819719726333098, 1.3109535275232949], "isController": false}, {"data": ["/api/createstatus-559", 200, 48, 24.0, 161.40500000000006, 0, 1447, 38.0, 475.0, 649.0499999999997, 1112.95, 14.914243102162565, 12.515729865771812, 5.722758202833706], "isController": false}, {"data": ["/api/auth/login-62", 200, 1, 0.5, 9961.345000000003, 671, 36000, 9029.0, 16964.2, 18321.649999999998, 35766.36000000012, 3.7970838396111786, 3.567960977844016, 2.09475548559956], "isController": false}, {"data": ["/api/collegeexambyexamid/Exam%20-%202-562", 200, 16, 8.0, 331.91999999999985, 3, 3381, 201.0, 808.0, 918.7499999999998, 1794.6500000000012, 15.640885274106516, 13.969418403456634, 6.7469646907014935], "isController": false}, {"data": ["Exam Module", 200, 191, 95.5, 9092.03, 3591, 34427, 8079.5, 13395.7, 19970.899999999994, 33948.940000000024, 4.528882951020131, 111.44977238824981, 16.26614210644007], "isController": true}, {"data": ["/api/collegeannouncement-67", 200, 54, 27.0, 5152.940000000001, 3, 18997, 3709.0, 14439.9, 16768.35, 18254.93, 3.884400248601616, 24.077819103480422, 1.3020517220031853], "isController": false}, {"data": ["/api/collegeexambyexamid/Exam%20-%202-557", 200, 56, 28.0, 761.5899999999997, 3, 4938, 541.0, 1807.8, 2314.35, 4868.95, 10.990218705352236, 13.262317631058357, 3.7362450544015826], "isController": false}, {"data": ["/api/event/ST001-68", 200, 84, 42.0, 3465.475, 1, 16777, 2749.5, 7615.0, 10327.799999999994, 16746.400000000023, 3.7647767487387997, 4.570563975321888, 0.9870406384120172], "isController": false}, {"data": ["Login Module", 200, 185, 92.5, 34473.215000000004, 19939, 47473, 35283.5, 43022.700000000004, 44085.149999999994, 45880.58, 3.4783213621106452, 49.91075252395694, 8.804993483582322], "isController": true}, {"data": ["/api/getQuestionsbyexamid/Exam%20-%202-560", 200, 43, 21.5, 412.30500000000006, 1, 2349, 226.0, 1085.9, 1223.6999999999998, 1765.3000000000006, 14.351320321469576, 13.720857289573766, 5.925735841525546], "isController": false}, {"data": ["/api/createstatus-561", 200, 26, 13.0, 1415.9399999999996, 5, 4041, 1035.0, 3524.0000000000005, 3686.6, 4028.8, 14.309222293768334, 12.522945061529656, 7.561110440366316], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Proxy Error", 2, 0.19646365422396855, 0.05555555555555555], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 1016, 99.80353634577604, 28.22222222222222], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3600, 1018, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 1016, "502/Proxy Error", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["/api/getevents/ST001-73", 200, 62, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 62, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/studentAttendancebystudentid/ST001-70", 200, 90, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 90, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/examstatus/ST001-554", 200, 75, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 75, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegestudent/ST001-558", 200, 35, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 35, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/timetabledataa/ghj-78", 200, 91, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 91, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegeexambysectionid/ghj-555", 200, 80, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 80, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegestudent/ST001-63", 200, 27, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 27, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegestudent/ST001-556", 200, 70, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 70, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegebirthdaystudent/ghj-76", 200, 69, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 69, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegestudent/ST001-553", 200, 91, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 91, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/createstatus-559", 200, 48, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 48, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/auth/login-62", 200, 1, "502/Proxy Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegeexambyexamid/Exam%20-%202-562", 200, 16, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/collegeannouncement-67", 200, 54, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 53, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegeexambyexamid/Exam%20-%202-557", 200, 56, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 56, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/event/ST001-68", 200, 84, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 84, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/getQuestionsbyexamid/Exam%20-%202-560", 200, 43, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 43, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/createstatus-561", 200, 26, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 26, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
