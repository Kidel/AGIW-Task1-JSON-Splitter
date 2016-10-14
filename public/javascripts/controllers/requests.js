app.controller('requests', ['$scope', '$http', function($scope, $http) {

    $scope.results = [];
    $scope.outcomes = [];

    $scope.testData = function() {
        $scope.outcome = "Fetching...";
        $scope.results = [];
        console.log("Message to $scope.testData");
        if(typeof $scope.urls == "undefined") { console.log("urls undefined"); return; }
        if(typeof $scope.paths == "undefined") { console.log("xpaths undefined"); return; }
        var urls = $scope.urls.split(',');
        console.log("Urls are: " );
        console.log(urls);
        console.log("Paths are: ");
        console.log($scope.paths);
        console.log("Fetching urls...");
        for (var i in urls) {
            urls[i] = urls[i].trim().replace(/(\r\n|\n|\r)/gm,"");
            $http.post('/rest/', {url: urls[i], paths: $scope.paths}).success(function (response) {
                console.log("Fetching url: " + urls[i]);
                if (response.err) {
                    console.log("There was an error in the request");
                    $scope.outcomes.push("error in request");
                }
                else {
                    console.log("I got the data I requested");
                    if (response.length < 1) {
                        console.log("But it was empty");
                        $scope.outcomes.push("empty data");
                        return;
                    }
                    console.log(response);
                    $scope.outcomes.push(response.outcome);
                    $scope.results.push(response.result);
                }
            });
        }
    };

}]);