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

    var data = {"OkPercent": 99.77777777777777, "KoPercent": 0.2222222222222222};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.89575, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.97, 500, 1500, "/api/getevents/ST001-73"], "isController": false}, {"data": [0.965, 500, 1500, "/api/studentAttendancebystudentid/ST001-70"], "isController": false}, {"data": [0.97, 500, 1500, "/api/examstatus/ST001-554"], "isController": false}, {"data": [0.965, 500, 1500, "/api/collegestudent/ST001-558"], "isController": false}, {"data": [0.98, 500, 1500, "/api/timetabledataa/ghj-78"], "isController": false}, {"data": [0.96, 500, 1500, "/api/collegeexambysectionid/ghj-555"], "isController": false}, {"data": [0.955, 500, 1500, "/api/collegestudent/ST001-63"], "isController": false}, {"data": [0.955, 500, 1500, "/api/collegestudent/ST001-556"], "isController": false}, {"data": [0.995, 500, 1500, "/api/collegebirthdaystudent/ghj-76"], "isController": false}, {"data": [0.95, 500, 1500, "/api/collegestudent/ST001-553"], "isController": false}, {"data": [1.0, 500, 1500, "/api/createstatus-559"], "isController": false}, {"data": [0.88, 500, 1500, "/api/auth/login-62"], "isController": false}, {"data": [0.96, 500, 1500, "/api/collegeexambyexamid/Exam%20-%202-562"], "isController": false}, {"data": [0.27, 500, 1500, "Exam Module"], "isController": true}, {"data": [0.975, 500, 1500, "/api/collegeannouncement-67"], "isController": false}, {"data": [0.985, 500, 1500, "/api/collegeexambyexamid/Exam%20-%202-557"], "isController": false}, {"data": [0.97, 500, 1500, "/api/event/ST001-68"], "isController": false}, {"data": [0.285, 500, 1500, "Login Module"], "isController": true}, {"data": [0.98, 500, 1500, "/api/getQuestionsbyexamid/Exam%20-%202-560"], "isController": false}, {"data": [0.945, 500, 1500, "/api/createstatus-561"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1800, 4, 0.2222222222222222, 193.91722222222245, 10, 3732, 103.5, 426.8000000000002, 540.9499999999998, 844.8400000000001, 39.29530421114677, 186.62101486945227, 18.416177521994456], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/api/getevents/ST001-73", 100, 0, 0.0, 202.35, 16, 968, 181.0, 352.8, 524.8999999999997, 967.1499999999995, 2.330241879107051, 1.022257086848115, 1.1349916402572586], "isController": false}, {"data": ["/api/studentAttendancebystudentid/ST001-70", 100, 0, 0.0, 176.69999999999993, 13, 723, 84.5, 379.6000000000001, 590.6999999999992, 722.6999999999998, 2.313850710352168, 1.5198203005692072, 1.0976329307233097], "isController": false}, {"data": ["/api/examstatus/ST001-554", 100, 0, 0.0, 171.01000000000002, 39, 750, 75.5, 386.9000000000001, 517.95, 749.3899999999996, 2.3448858040613425, 5.04182506858791, 1.0711365075270833], "isController": false}, {"data": ["/api/collegestudent/ST001-558", 100, 0, 0.0, 189.09999999999997, 39, 1328, 76.5, 408.20000000000016, 706.5999999999995, 1327.3199999999997, 2.375466185238853, 39.568307272489726, 1.0943846948713685], "isController": false}, {"data": ["/api/timetabledataa/ghj-78", 100, 0, 0.0, 202.22999999999996, 39, 746, 241.0, 375.20000000000005, 488.74999999999926, 744.8799999999994, 2.329590457997484, 1.0351207601453665, 0.3526690554675488], "isController": false}, {"data": ["/api/collegeexambysectionid/ghj-555", 100, 2, 2.0, 189.23999999999995, 38, 657, 143.0, 363.70000000000005, 464.0499999999998, 656.1799999999996, 2.3446658851113713, 2.5032055978898007, 1.0922387895662369], "isController": false}, {"data": ["/api/collegestudent/ST001-63", 100, 0, 0.0, 188.14000000000001, 38, 1860, 81.5, 458.9000000000002, 695.95, 1856.129999999998, 2.2746917792639096, 37.88970090646467, 1.0479576111186932], "isController": false}, {"data": ["/api/collegestudent/ST001-556", 100, 0, 0.0, 233.74999999999997, 39, 3732, 144.0, 461.5, 583.9499999999998, 3703.3699999999853, 2.3568785500483163, 39.25869172617785, 1.0858213132527281], "isController": false}, {"data": ["/api/collegebirthdaystudent/ghj-76", 100, 0, 0.0, 156.74000000000004, 41, 895, 74.5, 344.9000000000001, 455.74999999999994, 891.0199999999979, 2.3288851626726284, 1.3251447547683923, 1.0848875002911107], "isController": false}, {"data": ["/api/collegestudent/ST001-553", 100, 0, 0.0, 207.37000000000012, 38, 1771, 78.0, 475.10000000000025, 597.2999999999994, 1764.0999999999965, 2.3448858040613425, 39.05892771303287, 1.080296217699198], "isController": false}, {"data": ["/api/createstatus-559", 100, 0, 0.0, 29.889999999999986, 10, 288, 15.0, 26.700000000000017, 227.74999999999994, 287.51999999999975, 2.3644015699626424, 1.0713694613893225, 1.1937457145221546], "isController": false}, {"data": ["/api/auth/login-62", 100, 2, 2.0, 408.8699999999999, 169, 999, 349.5, 618.3000000000001, 757.3499999999997, 998.92, 2.2428061991163344, 2.0973742346423845, 1.237310623051562], "isController": false}, {"data": ["/api/collegeexambyexamid/Exam%20-%202-562", 100, 0, 0.0, 179.77999999999997, 14, 740, 99.5, 456.5000000000001, 557.2999999999998, 739.4499999999997, 2.376425855513308, 2.5412903992395437, 1.1406844106463878], "isController": false}, {"data": ["Exam Module", 100, 2, 2.0, 1798.8100000000002, 478, 8417, 1402.0, 3048.100000000001, 4276.399999999994, 8380.929999999982, 2.3080296351005147, 132.2872429431994, 11.394453804786854], "isController": true}, {"data": ["/api/collegeannouncement-67", 100, 0, 0.0, 183.92000000000007, 42, 1321, 86.5, 396.30000000000007, 520.5499999999997, 1313.8299999999963, 2.2951572182694515, 17.760572067936653, 1.046717207941244], "isController": false}, {"data": ["/api/collegeexambyexamid/Exam%20-%202-557", 100, 0, 0.0, 161.94999999999993, 19, 689, 83.0, 355.4000000000001, 383.24999999999983, 687.5899999999992, 2.3604947597016337, 2.5242540836559346, 1.133037484656784], "isController": false}, {"data": ["/api/event/ST001-68", 100, 0, 0.0, 172.75, 37, 880, 93.5, 397.00000000000006, 596.8, 877.869999999999, 2.2809178413393547, 1.6651145733543178, 1.0307788479083984], "isController": false}, {"data": ["Login Module", 100, 2, 2.0, 1691.7000000000003, 782, 4541, 1393.5, 3019.2000000000007, 3821.6999999999985, 4538.319999999999, 2.211019722295923, 62.283086873728664, 7.736409829088175], "isController": true}, {"data": ["/api/getQuestionsbyexamid/Exam%20-%202-560", 100, 0, 0.0, 168.84, 39, 596, 103.5, 366.00000000000006, 499.0499999999998, 595.6999999999998, 2.375240493099926, 1.9353570877176314, 1.2769701135364957], "isController": false}, {"data": ["/api/createstatus-561", 100, 0, 0.0, 267.87999999999994, 44, 829, 271.5, 528.7, 641.8499999999997, 827.7299999999993, 2.366247840798845, 1.7047614082724023, 1.489858039918601], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Proxy Error", 2, 50.0, 0.1111111111111111], "isController": false}, {"data": ["404/Not Found", 2, 50.0, 0.1111111111111111], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1800, 4, "502/Proxy Error", 2, "404/Not Found", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/collegeexambysectionid/ghj-555", 100, 2, "404/Not Found", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/auth/login-62", 100, 2, "502/Proxy Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
