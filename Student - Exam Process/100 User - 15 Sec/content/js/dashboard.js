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

    var data = {"OkPercent": 99.88888888888889, "KoPercent": 0.1111111111111111};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.42275, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.46, 500, 1500, "/api/getevents/ST001-73"], "isController": false}, {"data": [0.43, 500, 1500, "/api/studentAttendancebystudentid/ST001-70"], "isController": false}, {"data": [0.565, 500, 1500, "/api/examstatus/ST001-554"], "isController": false}, {"data": [0.44, 500, 1500, "/api/collegestudent/ST001-558"], "isController": false}, {"data": [0.48, 500, 1500, "/api/timetabledataa/ghj-78"], "isController": false}, {"data": [0.595, 500, 1500, "/api/collegeexambysectionid/ghj-555"], "isController": false}, {"data": [0.055, 500, 1500, "/api/collegestudent/ST001-63"], "isController": false}, {"data": [0.53, 500, 1500, "/api/collegestudent/ST001-556"], "isController": false}, {"data": [0.52, 500, 1500, "/api/collegebirthdaystudent/ghj-76"], "isController": false}, {"data": [0.61, 500, 1500, "/api/collegestudent/ST001-553"], "isController": false}, {"data": [1.0, 500, 1500, "/api/createstatus-559"], "isController": false}, {"data": [0.04, 500, 1500, "/api/auth/login-62"], "isController": false}, {"data": [0.67, 500, 1500, "/api/collegeexambyexamid/Exam%20-%202-562"], "isController": false}, {"data": [0.0, 500, 1500, "Exam Module"], "isController": true}, {"data": [0.33, 500, 1500, "/api/collegeannouncement-67"], "isController": false}, {"data": [0.47, 500, 1500, "/api/collegeexambyexamid/Exam%20-%202-557"], "isController": false}, {"data": [0.14, 500, 1500, "/api/event/ST001-68"], "isController": false}, {"data": [0.0, 500, 1500, "Login Module"], "isController": true}, {"data": [0.57, 500, 1500, "/api/getQuestionsbyexamid/Exam%20-%202-560"], "isController": false}, {"data": [0.55, 500, 1500, "/api/createstatus-561"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1800, 2, 0.1111111111111111, 1629.1522222222218, 12, 19403, 966.0, 4227.9, 6302.0, 8506.140000000003, 46.915317851278445, 65.19030025803426, 21.970378189590015], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/api/getevents/ST001-73", 100, 0, 0.0, 1365.2599999999998, 312, 7041, 904.0, 3842.3000000000015, 4024.0499999999997, 7036.429999999998, 4.7555640098915735, 2.0805592543275635, 2.3171299873977556], "isController": false}, {"data": ["/api/studentAttendancebystudentid/ST001-70", 100, 0, 0.0, 1935.1200000000003, 318, 9814, 917.5, 5962.000000000005, 6744.9, 9802.989999999994, 4.553526706434133, 3.0057723065889532, 2.1608796559810575], "isController": false}, {"data": ["/api/examstatus/ST001-554", 100, 0, 0.0, 863.5900000000006, 238, 3384, 915.5, 1107.0, 1206.55, 3362.8399999999892, 11.936022917164001, 33.46912113571258, 5.454436097517307], "isController": false}, {"data": ["/api/collegestudent/ST001-558", 100, 0, 0.0, 1142.22, 289, 3853, 1135.0, 1515.8, 1706.95, 3837.9899999999925, 10.695187165775401, 15.179227941176471, 4.929186163101605], "isController": false}, {"data": ["/api/timetabledataa/ghj-78", 100, 0, 0.0, 1360.2799999999997, 218, 7687, 956.5, 3390.000000000001, 6202.049999999977, 7677.629999999996, 5.717552887364208, 2.5399558676386507, 0.8651148870783305], "isController": false}, {"data": ["/api/collegeexambysectionid/ghj-555", 100, 0, 0.0, 820.66, 112, 2301, 876.0, 1158.5, 1243.6, 2300.39, 11.827321111768185, 12.694041986989946, 5.508713409225311], "isController": false}, {"data": ["/api/collegestudent/ST001-63", 100, 1, 1.0, 3616.7700000000004, 185, 8609, 3326.5, 6695.800000000001, 7474.0499999999965, 8604.459999999997, 3.9252629926205054, 5.596106384440258, 1.7909779056759303], "isController": false}, {"data": ["/api/collegestudent/ST001-556", 100, 0, 0.0, 988.3700000000001, 262, 4060, 1003.0, 1477.3, 1534.85, 4039.8499999999894, 10.925379656943079, 15.505930432645034, 5.035277026657926], "isController": false}, {"data": ["/api/collegebirthdaystudent/ghj-76", 100, 0, 0.0, 1024.79, 189, 4394, 940.0, 1248.7, 2219.5999999999885, 4389.089999999997, 8.475294516484448, 4.827358912831596, 3.947467740910247], "isController": false}, {"data": ["/api/collegestudent/ST001-553", 100, 0, 0.0, 806.7099999999997, 238, 3371, 846.0, 1139.6000000000001, 1237.5999999999997, 3350.48999999999, 9.539254030334828, 13.538660807974816, 4.396440963941619], "isController": false}, {"data": ["/api/createstatus-559", 100, 0, 0.0, 58.93999999999999, 12, 166, 40.5, 134.8, 153.39999999999986, 166.0, 11.300711944852527, 5.120635100011301, 5.705535229969488], "isController": false}, {"data": ["/api/auth/login-62", 100, 0, 0.0, 5390.169999999999, 810, 19403, 5382.0, 8915.0, 9505.55, 19372.499999999985, 4.045634760093859, 3.8077166690266204, 2.2318945201877174], "isController": false}, {"data": ["/api/collegeexambyexamid/Exam%20-%202-562", 100, 0, 0.0, 741.6500000000001, 76, 1785, 678.0, 1367.9000000000003, 1507.1499999999992, 1783.1699999999992, 13.815971262779774, 14.840700771967393, 6.634904324399005], "isController": false}, {"data": ["Exam Module", 100, 0, 0.0, 8341.360000000006, 4953, 11710, 8218.5, 9060.2, 9472.0, 11702.219999999996, 5.938947618482005, 72.90939764223779, 29.332079503949398], "isController": true}, {"data": ["/api/collegeannouncement-67", 100, 0, 0.0, 2693.9300000000007, 409, 11427, 1692.0, 6302.0, 6582.0, 11383.079999999976, 4.103742613263297, 31.755954594652824, 1.871531055072226], "isController": false}, {"data": ["/api/collegeexambyexamid/Exam%20-%202-557", 100, 0, 0.0, 1070.32, 77, 1699, 1070.5, 1506.0, 1536.95, 1698.6699999999998, 10.330578512396695, 11.10759136105372, 4.961098915289257], "isController": false}, {"data": ["/api/event/ST001-68", 100, 1, 1.0, 3597.0599999999995, 23, 6888, 3871.5, 6506.3, 6742.85, 6887.45, 3.9553832766395063, 2.0509280318012815, 1.7703044038248557], "isController": false}, {"data": ["Login Module", 100, 2, 2.0, 20983.379999999994, 15251, 27854, 21199.5, 24756.3, 25173.3, 27833.65999999999, 3.2059502436522185, 40.82802681777379, 11.19017521519941], "isController": true}, {"data": ["/api/getQuestionsbyexamid/Exam%20-%202-560", 100, 0, 0.0, 917.6999999999999, 107, 1604, 931.5, 1379.5, 1426.1499999999999, 1602.5899999999992, 11.785503830288745, 9.64109457866824, 6.338851649970537], "isController": false}, {"data": ["/api/createstatus-561", 100, 0, 0.0, 931.1999999999998, 229, 3188, 943.0, 1420.3000000000002, 1609.7999999999995, 3186.189999999999, 12.2684333210649, 8.843455749294565, 7.733545922279475], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 2, 100.0, 0.1111111111111111], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1800, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 2, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/collegestudent/ST001-63", 100, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/event/ST001-68", 100, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
