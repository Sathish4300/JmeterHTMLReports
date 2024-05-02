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

    var data = {"OkPercent": 67.98148148148148, "KoPercent": 32.01851851851852};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.1695, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.06166666666666667, 500, 1500, "/api/getevents/ST001-73"], "isController": false}, {"data": [0.051666666666666666, 500, 1500, "/api/studentAttendancebystudentid/ST001-70"], "isController": false}, {"data": [0.035, 500, 1500, "/api/examstatus/ST001-554"], "isController": false}, {"data": [0.21166666666666667, 500, 1500, "/api/collegestudent/ST001-558"], "isController": false}, {"data": [0.10333333333333333, 500, 1500, "/api/timetabledataa/ghj-78"], "isController": false}, {"data": [0.14666666666666667, 500, 1500, "/api/collegeexambysectionid/ghj-555"], "isController": false}, {"data": [0.075, 500, 1500, "/api/collegestudent/ST001-63"], "isController": false}, {"data": [0.14833333333333334, 500, 1500, "/api/collegestudent/ST001-556"], "isController": false}, {"data": [0.1, 500, 1500, "/api/collegebirthdaystudent/ghj-76"], "isController": false}, {"data": [0.09166666666666666, 500, 1500, "/api/collegestudent/ST001-553"], "isController": false}, {"data": [0.4683333333333333, 500, 1500, "/api/createstatus-559"], "isController": false}, {"data": [0.03, 500, 1500, "/api/auth/login-62"], "isController": false}, {"data": [0.6566666666666666, 500, 1500, "/api/collegeexambyexamid/Exam%20-%202-562"], "isController": false}, {"data": [0.0, 500, 1500, "Exam Module"], "isController": true}, {"data": [0.06833333333333333, 500, 1500, "/api/collegeannouncement-67"], "isController": false}, {"data": [0.2733333333333333, 500, 1500, "/api/collegeexambyexamid/Exam%20-%202-557"], "isController": false}, {"data": [0.045, 500, 1500, "/api/event/ST001-68"], "isController": false}, {"data": [0.0, 500, 1500, "Login Module"], "isController": true}, {"data": [0.52, 500, 1500, "/api/getQuestionsbyexamid/Exam%20-%202-560"], "isController": false}, {"data": [0.30333333333333334, 500, 1500, "/api/createstatus-561"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5400, 1729, 32.01851851851852, 3256.9648148148362, 0, 42764, 1051.0, 10922.500000000007, 16101.499999999998, 19978.96, 57.97599364411329, 104.91452021845677, 18.853605247901054], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/api/getevents/ST001-73", 300, 97, 32.333333333333336, 4561.923333333333, 1, 22070, 2031.0, 14464.6, 18005.299999999992, 20720.240000000005, 3.6420142766959644, 3.4722195876632838, 1.212475397434808], "isController": false}, {"data": ["/api/studentAttendancebystudentid/ST001-70", 300, 115, 38.333333333333336, 3852.2366666666635, 0, 21852, 1987.5, 10191.900000000001, 14507.9, 19974.18, 3.6369367294240305, 4.352177274903925, 1.0641118070120141], "isController": false}, {"data": ["/api/examstatus/ST001-554", 300, 171, 57.0, 2257.5300000000016, 0, 19256, 1210.5, 6308.000000000002, 11200.549999999992, 16439.370000000006, 3.850497997741041, 7.366321037677122, 1.0438960782677893], "isController": false}, {"data": ["/api/collegestudent/ST001-558", 300, 95, 31.666666666666668, 1743.7999999999993, 1, 19024, 1035.0, 2663.900000000002, 7338.64999999999, 18000.050000000003, 4.919807143559972, 20.477864455213354, 1.5491627103217553], "isController": false}, {"data": ["/api/timetabledataa/ghj-78", 300, 122, 40.666666666666664, 2805.613333333338, 1, 18641, 1204.0, 8950.700000000003, 14068.75, 18023.460000000014, 3.732271709380443, 4.03638138762752, 0.3394642051816372], "isController": false}, {"data": ["/api/collegeexambysectionid/ghj-555", 300, 119, 39.666666666666664, 2504.270000000001, 1, 20729, 860.0, 9109.900000000009, 14832.149999999998, 19231.260000000006, 3.892565200467108, 5.39134218486441, 1.1031975801219671], "isController": false}, {"data": ["/api/collegestudent/ST001-63", 300, 59, 19.666666666666668, 4571.13, 5, 18033, 4011.0, 10106.000000000002, 12042.1, 13629.410000000002, 3.7330147827385396, 15.25020385760415, 1.3819810292855008], "isController": false}, {"data": ["/api/collegestudent/ST001-556", 300, 124, 41.333333333333336, 1867.6833333333336, 0, 20198, 1040.5, 5226.5, 10127.59999999998, 17380.99, 4.12751262330944, 6.9547109752280445, 1.1159735383445921], "isController": false}, {"data": ["/api/collegebirthdaystudent/ghj-76", 300, 102, 34.0, 3176.5733333333324, 1, 20753, 1605.5, 9080.100000000008, 16522.199999999997, 18783.760000000002, 3.630466878040516, 3.8822359742962944, 1.1138986184560835], "isController": false}, {"data": ["/api/collegestudent/ST001-553", 300, 110, 36.666666666666664, 3166.1200000000013, 1, 21422, 1270.0, 10465.200000000003, 16463.149999999998, 20531.55, 3.700962250185048, 6.124249205835183, 1.08015811975697], "isController": false}, {"data": ["/api/createstatus-559", 300, 103, 34.333333333333336, 980.9666666666665, 1, 18929, 78.0, 1721.000000000002, 6942.85, 13461.930000000006, 4.508566275924256, 4.5326941501352565, 1.4947687716035467], "isController": false}, {"data": ["/api/auth/login-62", 300, 1, 0.3333333333333333, 11150.036666666667, 483, 42764, 10644.0, 19468.000000000004, 21126.199999999997, 24445.020000000008, 3.732968331985317, 3.5094155377029805, 2.059329893299322], "isController": false}, {"data": ["/api/collegeexambyexamid/Exam%20-%202-562", 300, 44, 14.666666666666666, 909.7099999999991, 0, 18556, 179.5, 1411.5000000000005, 2841.149999999996, 17756.470000000005, 6.378228978420325, 5.983804447485915, 2.564745668119486], "isController": false}, {"data": ["Exam Module", 300, 299, 99.66666666666667, 17569.926666666677, 3170, 64658, 7488.5, 48951.200000000026, 55555.5, 62404.07, 3.6004464553604647, 57.999676334865526, 11.881063095573852], "isController": true}, {"data": ["/api/collegeannouncement-67", 300, 90, 30.0, 6100.499999999996, 0, 21844, 2258.0, 17656.6, 19228.35, 20550.64, 3.587572648346129, 21.652122049221497, 1.1452905261175288], "isController": false}, {"data": ["/api/collegeexambyexamid/Exam%20-%202-557", 300, 106, 35.333333333333336, 1722.740000000001, 1, 19167, 378.5, 3072.8, 12931.349999999988, 18339.08, 4.5027466754720376, 5.814318218488277, 1.3743930672710352], "isController": false}, {"data": ["/api/event/ST001-68", 300, 110, 36.666666666666664, 4837.426666666665, 0, 21264, 2528.5, 14592.400000000001, 19126.199999999993, 21192.010000000002, 3.588216297678424, 3.9564289622878466, 1.0380013597844677], "isController": false}, {"data": ["Login Module", 300, 266, 88.66666666666667, 41055.439999999995, 9569, 62447, 41704.0, 57305.6, 59129.9, 60885.71, 3.330927663354244, 54.84085061830345, 8.506042077249765], "isController": true}, {"data": ["/api/getQuestionsbyexamid/Exam%20-%202-560", 300, 76, 25.333333333333332, 1080.5233333333338, 0, 17643, 210.5, 1828.6000000000001, 6246.249999999996, 17259.890000000003, 5.245122036506049, 5.187429108897476, 2.0626544852349817], "isController": false}, {"data": ["/api/createstatus-561", 300, 85, 28.333333333333332, 1336.583333333332, 1, 19503, 699.5, 2325.6000000000004, 3637.3999999999996, 16629.650000000023, 5.280109826284387, 5.729142603666157, 2.3027432095587588], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Proxy Error", 13, 0.7518796992481203, 0.24074074074074073], "isController": false}, {"data": ["404/Not Found", 50, 2.891844997108155, 0.9259259259259259], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 1666, 96.35627530364373, 30.85185185185185], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5400, 1729, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 1666, "404/Not Found", 50, "502/Proxy Error", 13, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["/api/getevents/ST001-73", 300, 97, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 95, "502/Proxy Error", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/studentAttendancebystudentid/ST001-70", 300, 115, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 115, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/examstatus/ST001-554", 300, 171, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 122, "404/Not Found", 49, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegestudent/ST001-558", 300, 95, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 95, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/timetabledataa/ghj-78", 300, 122, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 118, "502/Proxy Error", 4, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegeexambysectionid/ghj-555", 300, 119, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 117, "502/Proxy Error", 1, "404/Not Found", 1, "", "", "", ""], "isController": false}, {"data": ["/api/collegestudent/ST001-63", 300, 59, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 59, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegestudent/ST001-556", 300, 124, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 124, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegebirthdaystudent/ghj-76", 300, 102, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 102, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegestudent/ST001-553", 300, 110, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 110, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/createstatus-559", 300, 103, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 103, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/auth/login-62", 300, 1, "502/Proxy Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegeexambyexamid/Exam%20-%202-562", 300, 44, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 42, "502/Proxy Error", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/collegeannouncement-67", 300, 90, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 90, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegeexambyexamid/Exam%20-%202-557", 300, 106, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 106, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/event/ST001-68", 300, 110, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 108, "502/Proxy Error", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/getQuestionsbyexamid/Exam%20-%202-560", 300, 76, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 75, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/createstatus-561", 300, 85, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 85, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
