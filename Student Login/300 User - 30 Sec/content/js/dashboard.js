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

    var data = {"OkPercent": 71.33333333333333, "KoPercent": 28.666666666666668};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.13111111111111112, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.18166666666666667, 500, 1500, "/api/getevents/ST001-73"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "/api/collegebirthdaystudent/ghj-76"], "isController": false}, {"data": [0.09833333333333333, 500, 1500, "/api/studentAttendancebystudentid/ST001-70"], "isController": false}, {"data": [0.105, 500, 1500, "/api/auth/login-61"], "isController": false}, {"data": [0.05333333333333334, 500, 1500, "/api/auth/login-62"], "isController": false}, {"data": [0.04833333333333333, 500, 1500, "/api/collegeannouncement-67"], "isController": false}, {"data": [0.285, 500, 1500, "/api/timetabledataa/ghj-78"], "isController": false}, {"data": [0.041666666666666664, 500, 1500, "/api/event/ST001-68"], "isController": false}, {"data": [0.03333333333333333, 500, 1500, "/api/collegestudent/ST001-63"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2700, 774, 28.666666666666668, 4716.612592592593, 0, 28208, 2014.5, 13317.6, 15136.299999999997, 18047.889999999978, 43.249823797014166, 1272.0881486722706, 13.568130486320241], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/api/getevents/ST001-73", 300, 125, 41.666666666666664, 3518.3033333333333, 1, 26972, 590.5, 13604.300000000001, 14916.25, 15628.8, 6.627344423089668, 7.505942173658514, 1.860035835984271], "isController": false}, {"data": ["/api/collegebirthdaystudent/ghj-76", 300, 64, 21.333333333333332, 2093.0833333333376, 1, 15588, 818.0, 5248.800000000007, 12746.199999999999, 15331.37, 6.6187177337510485, 5.533825439593169, 2.4204211228103074], "isController": false}, {"data": ["/api/studentAttendancebystudentid/ST001-70", 300, 104, 34.666666666666664, 4449.0466666666625, 1, 19889, 1826.5, 13600.8, 14511.25, 15716.96, 5.496921723834653, 6.009216219125623, 1.6912875794763265], "isController": false}, {"data": ["/api/auth/login-61", 300, 9, 3.0, 7073.049999999997, 59, 16605, 7263.0, 13252.500000000004, 15119.15, 16230.04, 7.793219898688141, 3.582293560852059, 3.919441648266009], "isController": false}, {"data": ["/api/auth/login-62", 300, 151, 50.333333333333336, 2934.8266666666664, 1, 15222, 1213.5, 8910.100000000002, 10802.599999999999, 14784.800000000003, 7.051523128995863, 10.541797536080294, 1.9035669321761002], "isController": false}, {"data": ["/api/collegeannouncement-67", 300, 123, 41.0, 4471.07333333333, 3, 25915, 1757.5, 12723.100000000004, 13609.5, 15138.98, 5.319903532415945, 28.78452257190736, 1.431438496373599], "isController": false}, {"data": ["/api/timetabledataa/ghj-78", 300, 71, 23.666666666666668, 3606.280000000004, 1, 21001, 928.5, 12645.7, 13876.5, 19861.93000000003, 6.565844477030487, 5.39553399465978, 0.7566751042327811], "isController": false}, {"data": ["/api/event/ST001-68", 300, 97, 32.333333333333336, 4174.199999999996, 0, 19902, 4018.0, 9374.300000000001, 12461.95, 16245.670000000016, 5.17294892575094, 27.5026262145653, 1.5679322699330964], "isController": false}, {"data": ["/api/collegestudent/ST001-63", 300, 30, 10.0, 10129.649999999996, 2, 28208, 10332.5, 17680.600000000002, 18509.199999999997, 22869.81, 5.067054014795798, 1257.3766211933755, 2.072956209041313], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Proxy Error", 12, 1.550387596899225, 0.4444444444444444], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 762, 98.44961240310077, 28.22222222222222], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2700, 774, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 762, "502/Proxy Error", 12, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["/api/getevents/ST001-73", 300, 125, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 125, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegebirthdaystudent/ghj-76", 300, 64, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 64, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/studentAttendancebystudentid/ST001-70", 300, 104, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 103, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/auth/login-61", 300, 9, "502/Proxy Error", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/auth/login-62", 300, 151, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 151, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegeannouncement-67", 300, 123, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 123, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/timetabledataa/ghj-78", 300, 71, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 70, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/event/ST001-68", 300, 97, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 96, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegestudent/ST001-63", 300, 30, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 30, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
