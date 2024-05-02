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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9994444444444445, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "/api/getevents/ST001-73"], "isController": false}, {"data": [1.0, 500, 1500, "/api/collegebirthdaystudent/ghj-76"], "isController": false}, {"data": [1.0, 500, 1500, "/api/studentAttendancebystudentid/ST001-70"], "isController": false}, {"data": [0.995, 500, 1500, "/api/auth/login-61"], "isController": false}, {"data": [1.0, 500, 1500, "/api/auth/login-62"], "isController": false}, {"data": [1.0, 500, 1500, "/api/collegeannouncement-67"], "isController": false}, {"data": [1.0, 500, 1500, "/api/timetabledataa/ghj-78"], "isController": false}, {"data": [1.0, 500, 1500, "/api/event/ST001-68"], "isController": false}, {"data": [1.0, 500, 1500, "/api/collegestudent/ST001-63"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 900, 0, 0.0, 90.76999999999995, 14, 584, 40.0, 253.0, 261.0, 300.97, 20.061074827809108, 40.14494039492455, 8.859916231081293], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/api/getevents/ST001-73", 100, 0, 0.0, 57.08999999999999, 16, 263, 38.0, 66.80000000000013, 249.89999999999998, 262.92999999999995, 2.3187868107406207, 1.0158505382483884, 1.1218942749153644], "isController": false}, {"data": ["/api/collegebirthdaystudent/ghj-76", 100, 0, 0.0, 129.63000000000002, 37, 305, 44.0, 257.8, 267.9, 304.8399999999999, 2.331219694143976, 1.1769927557348003, 1.0791908045039165], "isController": false}, {"data": ["/api/studentAttendancebystudentid/ST001-70", 100, 0, 0.0, 43.050000000000004, 14, 324, 37.5, 42.0, 46.849999999999966, 323.2899999999996, 2.318840579710145, 1.56700634057971, 1.092481884057971], "isController": false}, {"data": ["/api/auth/login-61", 100, 0, 0.0, 68.28000000000003, 46, 584, 55.0, 71.9, 75.89999999999998, 581.4699999999987, 2.256114069127335, 1.0245049239689559, 1.134666743750564], "isController": false}, {"data": ["/api/auth/login-62", 100, 0, 0.0, 257.27, 34, 487, 253.0, 275.70000000000005, 293.84999999999997, 485.3399999999991, 2.2740710419793513, 2.09192328137081, 1.2355934046254606], "isController": false}, {"data": ["/api/collegeannouncement-67", 100, 0, 0.0, 47.21999999999999, 37, 260, 40.0, 47.900000000000006, 51.0, 259.81999999999994, 2.3085624581573057, 17.864305584412588, 1.0528307304291618], "isController": false}, {"data": ["/api/timetabledataa/ghj-78", 100, 0, 0.0, 127.44000000000007, 33, 298, 39.5, 258.8, 267.84999999999997, 297.92999999999995, 2.3188943511733604, 1.0303680954920693, 0.3443014620628884], "isController": false}, {"data": ["/api/event/ST001-68", 100, 0, 0.0, 43.18000000000001, 32, 252, 36.0, 44.0, 45.0, 251.91999999999996, 2.297477369847907, 1.4163364641248908, 1.0308134792997288], "isController": false}, {"data": ["/api/collegestudent/ST001-63", 100, 0, 0.0, 43.77, 33, 398, 37.0, 44.0, 46.94999999999999, 396.51999999999924, 2.2860800585236496, 14.215712013922227, 1.0457923267722835], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 900, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
