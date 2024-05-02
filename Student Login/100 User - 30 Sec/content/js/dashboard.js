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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9966666666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "/api/getevents/ST001-73"], "isController": false}, {"data": [1.0, 500, 1500, "/api/collegebirthdaystudent/ghj-76"], "isController": false}, {"data": [0.995, 500, 1500, "/api/studentAttendancebystudentid/ST001-70"], "isController": false}, {"data": [0.99, 500, 1500, "/api/auth/login-61"], "isController": false}, {"data": [0.99, 500, 1500, "/api/auth/login-62"], "isController": false}, {"data": [1.0, 500, 1500, "/api/collegeannouncement-67"], "isController": false}, {"data": [0.995, 500, 1500, "/api/timetabledataa/ghj-78"], "isController": false}, {"data": [1.0, 500, 1500, "/api/event/ST001-68"], "isController": false}, {"data": [1.0, 500, 1500, "/api/collegestudent/ST001-63"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 900, 0, 0.0, 158.39555555555546, 17, 865, 83.5, 279.9, 305.94999999999993, 486.99, 30.002000133342225, 60.03808457022134, 13.250297415661043], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/api/getevents/ST001-73", 100, 0, 0.0, 172.81999999999996, 35, 485, 245.0, 267.0, 297.39999999999986, 484.87999999999994, 3.622138510576644, 1.5868433176072152, 1.7524924840625906], "isController": false}, {"data": ["/api/collegebirthdaystudent/ghj-76", 100, 0, 0.0, 162.84000000000003, 37, 488, 240.0, 267.9, 289.74999999999994, 486.2899999999991, 3.6799882240376833, 1.8579628045190255, 1.7035757985574447], "isController": false}, {"data": ["/api/studentAttendancebystudentid/ST001-70", 100, 0, 0.0, 140.94000000000008, 17, 865, 41.0, 283.6, 306.69999999999993, 861.079999999998, 3.6220073164547792, 2.4476492606577565, 1.7064464938969175], "isController": false}, {"data": ["/api/auth/login-61", 100, 0, 0.0, 99.36000000000001, 46, 602, 57.5, 198.80000000000007, 364.29999999999916, 601.8399999999999, 3.3937419398628927, 1.5411035176135206, 1.7068135732708885], "isController": false}, {"data": ["/api/auth/login-62", 100, 0, 0.0, 281.1000000000001, 44, 690, 260.0, 306.9, 478.69999999999993, 689.4699999999997, 3.4324157341937256, 3.157487278609185, 1.8649682287018603], "isController": false}, {"data": ["/api/collegeannouncement-67", 100, 0, 0.0, 175.92999999999992, 36, 487, 247.5, 291.9000000000001, 312.29999999999984, 486.95, 3.564554074285307, 27.583521957653097, 1.6256315944250375], "isController": false}, {"data": ["/api/timetabledataa/ghj-78", 100, 0, 0.0, 150.86999999999998, 34, 847, 44.5, 268.6, 293.0, 841.5999999999972, 3.6801236521547125, 1.6352111930960882, 0.5464121094468775], "isController": false}, {"data": ["/api/event/ST001-68", 100, 0, 0.0, 183.32999999999996, 32, 489, 246.0, 302.5, 467.84999999999997, 488.91999999999996, 3.510742873191967, 2.1642838413670833, 1.575171587557927], "isController": false}, {"data": ["/api/collegestudent/ST001-63", 100, 0, 0.0, 58.36999999999998, 33, 450, 37.0, 66.70000000000007, 251.69999999999993, 448.70999999999935, 3.459848458637512, 21.514648674013078, 1.582745519496246], "isController": false}]}, function(index, item){
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
