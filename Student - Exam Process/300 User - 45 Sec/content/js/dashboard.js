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

    var data = {"OkPercent": 64.31481481481481, "KoPercent": 35.68518518518518};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.09033333333333333, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.06, 500, 1500, "/api/getevents/ST001-73"], "isController": false}, {"data": [0.04833333333333333, 500, 1500, "/api/studentAttendancebystudentid/ST001-70"], "isController": false}, {"data": [0.056666666666666664, 500, 1500, "/api/examstatus/ST001-554"], "isController": false}, {"data": [0.06, 500, 1500, "/api/collegestudent/ST001-558"], "isController": false}, {"data": [0.085, 500, 1500, "/api/timetabledataa/ghj-78"], "isController": false}, {"data": [0.12166666666666667, 500, 1500, "/api/collegeexambysectionid/ghj-555"], "isController": false}, {"data": [0.02666666666666667, 500, 1500, "/api/collegestudent/ST001-63"], "isController": false}, {"data": [0.018333333333333333, 500, 1500, "/api/collegestudent/ST001-556"], "isController": false}, {"data": [0.08666666666666667, 500, 1500, "/api/collegebirthdaystudent/ghj-76"], "isController": false}, {"data": [0.02666666666666667, 500, 1500, "/api/collegestudent/ST001-553"], "isController": false}, {"data": [0.21666666666666667, 500, 1500, "/api/createstatus-559"], "isController": false}, {"data": [0.011666666666666667, 500, 1500, "/api/auth/login-62"], "isController": false}, {"data": [0.39166666666666666, 500, 1500, "/api/collegeexambyexamid/Exam%20-%202-562"], "isController": false}, {"data": [0.0, 500, 1500, "Exam Module"], "isController": true}, {"data": [0.03333333333333333, 500, 1500, "/api/collegeannouncement-67"], "isController": false}, {"data": [0.17666666666666667, 500, 1500, "/api/collegeexambyexamid/Exam%20-%202-557"], "isController": false}, {"data": [0.03666666666666667, 500, 1500, "/api/event/ST001-68"], "isController": false}, {"data": [0.0, 500, 1500, "Login Module"], "isController": true}, {"data": [0.24833333333333332, 500, 1500, "/api/getQuestionsbyexamid/Exam%20-%202-560"], "isController": false}, {"data": [0.10166666666666667, 500, 1500, "/api/createstatus-561"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5400, 1927, 35.68518518518518, 4542.217222222215, 0, 47073, 1910.0, 11853.400000000003, 18289.699999999997, 26125.98, 43.72434231301771, 444.4811713316086, 13.494529523040299], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/api/getevents/ST001-73", 300, 116, 38.666666666666664, 6808.0199999999995, 1, 34524, 2485.5, 22977.200000000004, 24567.3, 26357.660000000003, 3.8271652187224925, 3.8896307343692196, 1.210353458641101], "isController": false}, {"data": ["/api/studentAttendancebystudentid/ST001-70", 300, 127, 42.333333333333336, 5532.603333333334, 1, 47073, 2386.5, 12216.700000000008, 20129.6, 26125.57, 3.75859779245023, 4.602679508281444, 1.0503151936617514], "isController": false}, {"data": ["/api/examstatus/ST001-554", 300, 107, 35.666666666666664, 4164.869999999999, 1, 26052, 2416.5, 10029.400000000001, 11392.25, 11814.9, 4.825168076688004, 8.954597807162157, 1.4741736648357835], "isController": false}, {"data": ["/api/collegestudent/ST001-558", 300, 87, 29.0, 2777.3600000000006, 1, 11720, 2482.5, 6620.800000000003, 8035.949999999999, 11487.650000000005, 8.837305211064306, 373.3228106496892, 2.887543450083954], "isController": false}, {"data": ["/api/timetabledataa/ghj-78", 300, 139, 46.333333333333336, 3613.8133333333353, 1, 26150, 1040.0, 9806.90000000001, 16313.8, 26037.380000000005, 3.708786114304788, 4.3824281963555, 0.29972110701084204], "isController": false}, {"data": ["/api/collegeexambysectionid/ghj-555", 300, 124, 41.333333333333336, 2737.6366666666668, 1, 20028, 550.0, 8036.700000000002, 9487.85, 10898.180000000002, 5.611672278338944, 7.480859667274598, 1.543027204919566], "isController": false}, {"data": ["/api/collegestudent/ST001-63", 300, 117, 39.0, 6127.729999999999, 2, 23733, 5431.0, 12008.900000000001, 15990.449999999995, 23173.670000000002, 4.128762334677475, 101.2628018512338, 1.1596284888041728], "isController": false}, {"data": ["/api/collegestudent/ST001-556", 300, 114, 38.0, 3451.233333333333, 0, 13926, 3016.5, 8969.7, 10802.549999999992, 12953.6, 7.198387561186294, 395.8806664807083, 2.052290286975717], "isController": false}, {"data": ["/api/collegebirthdaystudent/ghj-76", 300, 113, 37.666666666666664, 4568.563333333331, 0, 47043, 1912.5, 10088.800000000001, 16392.35, 26137.84, 4.124278251306022, 4.544358545848227, 1.211802094789662], "isController": false}, {"data": ["/api/collegestudent/ST001-553", 300, 121, 40.333333333333336, 4602.476666666666, 1, 24444, 3185.5, 10260.700000000003, 12015.75, 23709.790000000005, 4.943886883868098, 196.58658084903018, 1.3724757852540335], "isController": false}, {"data": ["/api/createstatus-559", 300, 123, 41.0, 1183.6499999999999, 0, 8034, 209.0, 3026.3, 5309.15, 7814.760000000003, 8.79301248607773, 9.78262711398675, 2.6192701158479395], "isController": false}, {"data": ["/api/auth/login-62", 300, 25, 8.333333333333334, 13858.26, 790, 38395, 12636.5, 26356.000000000004, 27783.649999999998, 35019.78000000006, 4.194982800570518, 3.842656136385883, 2.3142048672287947], "isController": false}, {"data": ["/api/collegeexambyexamid/Exam%20-%202-562", 300, 61, 20.333333333333332, 1109.0799999999997, 1, 20228, 667.0, 2675.0, 3591.949999999996, 7905.370000000008, 7.333528894103843, 7.119347835386721, 2.7148380206805514], "isController": false}, {"data": ["Exam Module", 300, 298, 99.33333333333333, 25306.31333333334, 11321, 57914, 24008.0, 33042.10000000001, 38950.14999999999, 56160.65000000002, 3.5880017222408265, 522.9183610008133, 11.445830611186194], "isController": true}, {"data": ["/api/collegeannouncement-67", 300, 121, 40.333333333333336, 7201.923333333331, 1, 28877, 5461.5, 16454.6, 23867.0, 27020.08, 3.7577974296665584, 20.3857819428439, 1.0511068279179296], "isController": false}, {"data": ["/api/collegeexambyexamid/Exam%20-%202-557", 300, 116, 38.666666666666664, 2104.213333333333, 0, 11737, 376.0, 6719.0, 9043.8, 10859.900000000003, 8.254230293025175, 10.413603573393864, 2.3666425918283123], "isController": false}, {"data": ["/api/event/ST001-68", 300, 124, 41.333333333333336, 8742.683333333338, 0, 27099, 7468.5, 22623.0, 25009.5, 27010.97, 3.720145829716525, 6.871915863476849, 1.0516556780275788], "isController": false}, {"data": ["Login Module", 300, 299, 99.66666666666667, 56453.596666666686, 37217, 72920, 56731.5, 66094.8, 67829.05, 72071.1, 3.082234003205523, 114.77848128698682, 7.290296115999877], "isController": true}, {"data": ["/api/getQuestionsbyexamid/Exam%20-%202-560", 300, 101, 33.666666666666664, 1335.0100000000004, 1, 11665, 784.0, 3533.600000000011, 5317.5499999999965, 10054.110000000013, 8.904190905853023, 9.768871319601093, 3.08426448600558], "isController": false}, {"data": ["/api/createstatus-561", 300, 91, 30.333333333333332, 1840.7833333333315, 1, 10424, 1623.0, 3853.4, 4780.2, 10030.220000000001, 11.486771068652603, 12.711278812650763, 4.811880192977754], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 2, 0.10378827192527244, 0.037037037037037035], "isController": false}, {"data": ["502/Proxy Error", 64, 3.321224701608718, 1.1851851851851851], "isController": false}, {"data": ["404/Not Found", 10, 0.5189413596263622, 0.18518518518518517], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 1, 0.05189413596263622, 0.018518518518518517], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 1850, 96.00415153087701, 34.25925925925926], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5400, 1927, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 1850, "502/Proxy Error", 64, "404/Not Found", 10, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["/api/getevents/ST001-73", 300, 116, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 105, "502/Proxy Error", 11, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/studentAttendancebystudentid/ST001-70", 300, 127, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 123, "502/Proxy Error", 4, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/examstatus/ST001-554", 300, 107, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 99, "404/Not Found", 8, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegestudent/ST001-558", 300, 87, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 86, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/timetabledataa/ghj-78", 300, 139, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 137, "502/Proxy Error", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegeexambysectionid/ghj-555", 300, 124, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 122, "404/Not Found", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegestudent/ST001-63", 300, 117, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 117, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegestudent/ST001-556", 300, 114, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 114, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegebirthdaystudent/ghj-76", 300, 113, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 110, "502/Proxy Error", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegestudent/ST001-553", 300, 121, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 119, "502/Proxy Error", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/createstatus-559", 300, 123, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 123, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/auth/login-62", 300, 25, "502/Proxy Error", 25, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegeexambyexamid/Exam%20-%202-562", 300, 61, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 60, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/collegeannouncement-67", 300, 121, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 116, "502/Proxy Error", 5, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegeexambyexamid/Exam%20-%202-557", 300, 116, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 116, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/event/ST001-68", 300, 124, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 112, "502/Proxy Error", 12, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/getQuestionsbyexamid/Exam%20-%202-560", 300, 101, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 100, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/createstatus-561", 300, 91, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 91, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
