app.controller('requests', ['$scope', '$http', function($scope, $http) {

    $scope.urls = '';
    $scope.paths = '';
    $scope.xpathJSON = {};

    $scope.urlsJSON = {};
    $scope.urlsRangeJSON = {};

    $scope.results = [];

    $scope.from = '';
    $scope.to = '';

    $scope.getData = function() {
        $scope.results = [];
        console.log("message to $scope.testData");
        if(typeof $scope.urlsRangeJSON == {}) { alert("urls and/or range undefined"); return; }
        if(typeof $scope.paths == '') {alert("xpaths undefined"); return; }

        // from string of urls to array of urls
        try {
            $scope.xpathJSON = JSON.parse($scope.paths);
            var paths =  $scope.xpathJSON;
            var urls = $scope.urlsRangeJSON;
        }
        catch(e) {
            $scope.results.push("error in JSON.parse: wrong input. ");
            console.log(e);
            return;
        }
        // for each path in input
        for (var site in paths) {
            for (var source in paths[site]) {
                var u = urls[site][source];
                for (var i in u) {
                    if (u[i] != null) u[i] = u[i].trim().replace(/(\r\n|\n|\r)/gm, "");
                    console.log("Fetching url: " + u[i]);
                    $http.post('/rest/', {url: u[i], paths: paths[site][source], source: source}).success(function (response) {
                        console.log("Request sent...");
                        if (response.err) {
                            console.log("There was an error in the request");
                            $scope.results.push({outcome: "danger", message: "error in request", url: "#"});
                        }
                        else {
                            console.log("I got the data I requested");
                            if (response.length < 1) {
                                console.log("But it was empty");
                                $scope.results.push({outcome: "warning", message: "empty data", url: "#"});
                                return;
                            }
                            console.log(response);
                            $scope.results = $scope.results.concat(response);
                        }
                    });
                }
            }
        }
    };

    $scope.sortBy = function(what) {
        $scope.results.sort(function(a, b){
            if(a[what] < b[what]) return -1;
            if(a[what] > b[what]) return 1;
            return 0;
        });
    };

    $scope.import = function() {
        try {
            var f = document.getElementById('file').files[0];
            var r = new FileReader();
            if (typeof(f) != "undefined") {
                r.onloadend = function (e) {
                    try {
                        var app = JSON.parse(e.target.result.substring(e.target.result.indexOf("{"))); //removes characters preceding the first {
                        $scope.urlsJSON = app;
                        console.log(app);
                        alert("JSON imported");
                        $scope.$apply();
                    }
                    catch (err) {
                        alert("Error: " + err);
                    }
                };
                r.readAsBinaryString(f);
            }
            else alert("No file selected");
        }
        catch (err) {
            alert("Error in File Reader: " + err);
        }
    };

    $scope.cutRange = function() {
        console.log("cut range started, " + $scope.from + " " + $scope.to);
        var from = 0, to = 0;
        var processed = {};
        if($scope.from != '' && $scope.to != '') {
            from = $scope.from * 1;
            to = $scope.to * 1 + 1;
        }
        console.log(from + " " + to);
        if($scope.urlsJSON == {}) return {};

        console.log("starting loop");
        var fromFound = false;
        var toFound = false;
        // find the first site
        for(var site in $scope.urlsJSON) {
            for(var source in $scope.urlsJSON[site]) {
                var sourceApp = source.split("-");
                fromFound = fromFound || (sourceApp[0] == from);
                toFound = toFound || (sourceApp[0] == to);
                if(fromFound && !toFound) {
                    console.log("from found, source " + sourceApp[0] + ", not yet to");
                    if (typeof processed[site] == "undefined") processed[site] = {};
                    processed[site][source] = $scope.urlsJSON[site][source];
                }
            }
            if(toFound) {
                console.log("all done");
                console.log(processed);
                $scope.urlsRangeJSON = processed;
                return processed;
            }
        }
        console.log(null);
        $scope.urlsRangeJSON = {};
        return null;
    };

}]);