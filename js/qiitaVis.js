var n_fields = ["items_count",
		"followers_count",
		"stockers_count",
		"items_followers_ratio",		
		"items_stockers_ratio"
	       ];

var fields = ["id"].concat(n_fields);
var fieldToLabel = {"id" : "Name",
		    "items_count" : "#documents",
		    "followers_count" : "#followers",
		    "items_followers_ratio" : "#followers/#documents",
		    "stockers_count" : "#stockers",
		    "items_stockers_ratio" : "#stockers/#documents",
                   };

var fieldToLongLabel = {"id" : "Name of the tag. Ordered by numbers of documents.",
			"items_count" : "Numbers of documents which have the tag. The value is counted as of Nov 2015.",
			"followers_count" : "Numbers of followers to the tag. The value is counted as of Nov 2015.",
			"items_followers_ratio" : "Number of followers par documents.",
			"stockers_count" : "Sum of stocked to documents which have the tag.",
			"items_stockers_ratio" : "Total stockerd with the tag par documents."
		       };

var data;
var query = getQuery();
var N = 10;
if( "N" in query )
    N = query["N"];

d3.json("data/tags.json", function(error,d){
    data = d.slice(0,N);

    data.forEach( function(d,index,dt) {
	dt[index]["items_followers_ratio"] = Math.round(100*d["followers_count"]/d["items_count"])/100;
	dt[index]["items_stockers_ratio"] = Math.round(100*d["stockers_count"]/d["items_count"])/100;
    });
    drawParallelChart(data);
});

