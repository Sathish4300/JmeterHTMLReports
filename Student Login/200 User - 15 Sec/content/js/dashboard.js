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

    var data = {"OkPercent": 74.38888888888889, "KoPercent": 25.61111111111111};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.16555555555555557, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.215, 500, 1500, "/api/getevents/ST001-73"], "isController": false}, {"data": [0.47, 500, 1500, "/api/collegebirthdaystudent/ghj-76"], "isController": false}, {"data": [0.1675, 500, 1500, "/api/studentAttendancebystudentid/ST001-70"], "isController": false}, {"data": [0.1575, 500, 1500, "/api/auth/login-61"], "isController": false}, {"data": [0.045, 500, 1500, "/api/auth/login-62"], "isController": false}, {"data": [0.0625, 500, 1500, "/api/collegeannouncement-67"], "isController": false}, {"data": [0.3275, 500, 1500, "/api/timetabledataa/ghj-78"], "isController": false}, {"data": [0.02, 500, 1500, "/api/event/ST001-68"], "isController": false}, {"data": [0.025, 500, 1500, "/api/collegestudent/ST001-63"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1800, 461, 25.61111111111111, 3992.63999999999, 1, 25839, 1564.0, 11733.6, 16281.349999999999, 21240.53, 39.64408422165448, 783.8972406065544, 13.121370260604792], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/api/getevents/ST001-73", 200, 59, 29.5, 2559.4100000000003, 1, 21549, 954.5, 6298.600000000004, 11515.7, 21075.76000000001, 6.218325404968442, 5.702854162780214, 2.1438344817803068], "isController": false}, {"data": ["/api/collegebirthdaystudent/ghj-76", 200, 27, 13.5, 1156.6799999999998, 5, 16046, 847.5, 1944.0000000000011, 5548.25, 11224.16000000004, 7.615276244145757, 5.441352853824772, 3.0572656874690627], "isController": false}, {"data": ["/api/studentAttendancebystudentid/ST001-70", 200, 89, 44.5, 2552.5149999999994, 1, 22420, 639.5, 8419.900000000012, 11524.5, 21075.270000000004, 5.956103517079127, 7.3755639685517735, 1.5630409351827035], "isController": false}, {"data": ["/api/auth/login-61", 200, 14, 7.0, 5182.984999999998, 69, 19948, 3529.0, 15884.7, 18548.2, 19867.510000000002, 5.852059925093633, 2.7334377560276217, 2.9431746693586143], "isController": false}, {"data": ["/api/auth/login-62", 200, 66, 33.0, 5216.074999999996, 1, 25728, 3465.5, 14292.1, 15878.55, 25428.520000000077, 5.159027007506385, 6.69272915753089, 1.8785609377821342], "isController": false}, {"data": ["/api/collegeannouncement-67", 200, 58, 29.0, 4150.574999999999, 1, 17494, 4403.5, 6927.6, 12284.0, 17411.910000000003, 5.144694533762058, 31.342368368167204, 1.6658460610932475], "isController": false}, {"data": ["/api/timetabledataa/ghj-78", 200, 37, 18.5, 1569.9050000000004, 1, 22207, 796.0, 4650.400000000001, 5573.099999999999, 15996.020000000062, 6.412517233640065, 4.762170757318286, 0.7807740709865658], "isController": false}, {"data": ["/api/event/ST001-68", 200, 90, 45.0, 3460.359999999999, 1, 17399, 2255.0, 11287.400000000005, 15849.649999999958, 17170.82, 5.076528669695662, 22.215414958626294, 1.2565152089626115], "isController": false}, {"data": ["/api/collegestudent/ST001-63", 200, 21, 10.5, 10085.254999999997, 4, 25839, 8710.5, 20528.4, 21637.399999999998, 25661.320000000018, 4.831151263346055, 783.2026060286728, 1.980913555606551], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Proxy Error", 19, 4.1214750542299345, 1.0555555555555556], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 442, 95.87852494577007, 24.555555555555557], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1800, 461, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 442, "502/Proxy Error", 19, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["/api/getevents/ST001-73", 200, 59, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 57, "502/Proxy Error", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegebirthdaystudent/ghj-76", 200, 27, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 27, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/studentAttendancebystudentid/ST001-70", 200, 89, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 88, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/auth/login-61", 200, 14, "502/Proxy Error", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/auth/login-62", 200, 66, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 66, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegeannouncement-67", 200, 58, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 58, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/timetabledataa/ghj-78", 200, 37, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 37, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/event/ST001-68", 200, 90, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 89, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/collegestudent/ST001-63", 200, 21, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: collegeapi.abhisvr360.in.net:443 failed to respond", 20, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
