app.controller('requests', ['$scope', '$http', function($scope, $http) {

    $scope.urlsJSON = {};
    $scope.urlsRangeJSON = {};

    $scope.results = [];

    $scope.from = '';
    $scope.to = '';

    $scope.hasNotImported = true;

    $scope.import = function() {
        try {
            var f = document.getElementById('file').files[0];
            var r = new FileReader();
            if (typeof(f) != "undefined") {
                r.onloadend = function (e) {
                    try {
                        $scope.urlsJSON = JSON.parse(e.target.result.substring(e.target.result.indexOf("{"))); //removes characters preceding the first {
                        //console.log($scope.urlsJSON);
                        alert("JSON imported");
                        $scope.hasNotImported = false;
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
        if($scope.hasNotImported) return;
        console.log("cut range started, " + $scope.from + " " + $scope.to);
        var from = 0, to = 0;
        var processed = {};
        if($scope.from != '' && $scope.to != '') {
            from = $scope.from * 1;
            to = $scope.to * 1 + 1;
        }
        //console.log(from + " " + to);
        if($scope.urlsJSON == {}) return;

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
                    //console.log("from found, source " + sourceApp[0] + ", not yet to");
                    if (typeof processed[site] == "undefined") processed[site] = {};
                    processed[site][source] = $scope.urlsJSON[site][source];
                }
            }
            if(toFound) {
                console.log("all done");
                //console.log(processed);
                $scope.urlsRangeJSON = processed;
                $scope.makeDownload(JSON.stringify(processed, null, 4), "sources-from"+$scope.from+"to"+$scope.to+".json");
                return;
            }
        }
        console.log(null);
        $scope.urlsRangeJSON = {};
        alert("Empty range");
    };

    $scope.makeDownload = function(text, filename) {
        var blob = new Blob([text], {type: "text/plain;charset=utf-16"});
        saveAs(blob, filename);
    };

}]);