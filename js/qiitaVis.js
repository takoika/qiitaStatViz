var query = getQuery();
var data;

var color = d3.scale.category10();
var n_fields = ["items_count",
		"followers_count",
		"items_followers_ratio"
		//,"stockers_count"		
		//,"items_stockers_ratio"
		];

var fields = ["id"].concat(n_fields);
var fieldToLabel = {"id" : "Name",
		    "items_count" : "#documents",
		    "followers_count" : "#followers",
		    "items_followers_ratio" : "#followers/#documents"
		    //,"stockers_count" : "#stockers/#documents"
		    //,"items_stockers_ratio" : "#followers/#documents"
                    };

var fieldToLongLabel = {"id" : "Name of the tag. Ordered by numbers of documents.",
			"items_count" : "Numbers of documents which have the tag. The value is counted as of Nov 2015.",
			"followers_count" : "Numbers of followers to the tag. The value is counted as of Nov 2015.",
			"items_followers_ratio" : "Number of followers par documents."
			//,"stockers_count" : "Sum of stocked to documents which have the tag."		
			//,"items_stockers_ratio" : "Total stockerd with the tag par documents.
                       };

d3.json("../data/tags.json", function(error,d){
    if( "N" in query )
	data = d.slice(0,query["N"]);
    else 
	data = d.slice(0,10);
    
    data.forEach( function(d,index,dt) {
	dt[index]["items_followers_ratio"] = Math.round(100*d["followers_count"]/d["items_count"])/100;
	//		dt[index]["items_stockers_ratio"] = Math.round(100*d["stockers_count"]/d["items_count"])/100;
    });

    var left_padding = 50;
    var top_padding = 50;
    var bottom_padding = 50;
    var right_padding = 50;    
    var width = 1000;
    var height = 500;

    var svg = d3.select('div')
	.append('svg')
	.attr({ width : width+left_padding+right_padding,
		height : height+top_padding+bottom_padding})
	.append("g")
	.attr("transform", "translate("+left_padding+","+top_padding+")");



    var x_scale = d3.scale.ordinal().domain(fields).rangeBands([0,width]);
    var y_scale = {};
    var r_scale = {};
    
    var names = data.map(function(d,i) {return d.id;});
    y_scale["id"] = d3.scale.ordinal().domain(names).rangeBands([0,height]);

    n_fields.forEach( function(tag,tindex,ar) {
	var v = data.map(function(d,i) {return d[tag];});
	v.sort(d3.descending);
	y_scale[tag] = d3.scale.ordinal()
	    .domain(v)
	    .rangeBands([0,height]);
	r_scale[tag] = d3.scale.linear()
	    .domain([d3.min(v),d3.max(v)])
	    .range([0,y_scale["id"].rangeBand()/2]);
    });
    
    var xAxis = d3.svg.axis()
	.scale(x_scale)
	.orient("top")
	.innerTickSize(0)
	.outerTickSize(0)
	.ticks(fields.length)
	.tickFormat(function(d) {return fieldToLabel[d];});

    var txt = svg.selectAll('.text').data(data).enter().append("text")
	.attr("x",function(d) {return x_scale("id");})
	.attr("y",function(d) {return y_scale["id"](d.id);})
	.attr("class",function(d){return d.id;})
	.text(function (d) {return d.id;})
	.on("mouseover",  function(d,i){ mouseover(i);})
	.on("mouseout",   function(d,i){ mouseout(i);});
    
    n_fields.forEach( function(tag,tindex,ar){    
	var cs = svg.selectAll('.'+tag).data(data).enter().append("circle")
	    .attr({ cx : function(d) {return x_scale(tag);},
		    cy : function(d) {return y_scale[tag](d[tag]);},
		    fill : function(d) {return color(tindex);},
		    r : function(d) {return r_scale[tag](d[tag]);},
		    id : function(d) {return tag+'-'+d.id;},
		    class : function(d) {return tag+' '+d.id;}})
	    .on("mouseover",  function(d,i){ mouseover(i);})
	    .on("mouseout",   function(d,i){ mouseout(i);});
    });


    var line = d3.svg.line()
	.x(function(d) {return x_scale(d.key);})
	.y(function(d) {return y_scale[d.key](d['val']);});

    Object.keys(data).forEach( function(i) {
	var line_d = fields.map(function(tag) {return {key: tag, val:data[i][tag]};});
	svg.append("path").datum(line_d)
	    .attr({d : line,
		   fill : "none" })
	    .classed( data[i]["id"],true)
	    .classed( "active" , false)
	    .on("mouseover",  function(d){ mouseover(i);})
	    .on("mouseout",  function(d){ mouseout(i);});
    });

    svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate("+ -x_scale.rangeBand()/2+",-30)")
	.call(xAxis);

    svg.selectAll(".tick")
	.on("mouseover",  function(l){ mouseover_lab(l);})
	.on("mouseout",  function(l){ mouseout_lab(l);})

    svg.selectAll("circle").moveToFront();
    svg.selectAll("text").moveToFront();

});

function mouseover_lab(l) {
    d3.select("#tooltip")
	.style("visibility", "visible")
        .style("top", (d3.event.pageY-10)+"px")
        .style("left",(d3.event.pageX+10)+"px")
	.text( fieldToLongLabel[l] );
};


function mouseout_lab(l) {
    d3.select("#tooltip")
	.style("visibility", "hidden");
};

function mouseover(i) {
    d3.select("#tooltip")
	.style("visibility", "visible")
        .style("top", (d3.event.pageY-10)+"px")
        .style("left",(d3.event.pageX+10)+"px")
	.text( data[i]["id"]+" "+n_fields.map( function(f) {return fieldToLabel[f]+": "+data[i][f]}).join(", "));

    d3.selectAll("path."+data[i]["id"]).classed("active",true);
    n_fields.forEach( function(tag,ind) {
	    var c = d3.selectAll("circle."+tag)
		.attr({"fill":function (d) {return d3.rgb(color(ind)).darker();}});
	});
    n_fields.forEach( function(tag,ind) {
	    var c = d3.selectAll("circle."+data[i]["id"]+"."+tag)
		.attr({"fill":function (d) {return d3.rgb(color(ind)).brighter();}});
	});
};

function mouseout(i) {
    d3.selectAll("path."+data[i]["id"]).classed("active",false);
    n_fields.forEach( function(tag,ind) {
	    var c = d3.selectAll("circle."+tag)
		.attr({"fill":function (d) {return color(ind);}});
	});
    d3.select("#tooltip")
	.style("visibility", "hidden");
};

function getQuery() {
    var query = {};
    var url = window.location.href;
    url = url.substring(url.lastIndexOf("?")+1);
    x = url.split("&");
    x.forEach( function(d) {
	    var tele = d.split("=");
	    query[tele[0]]=tele[1];
	});
    return query;
};

d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
	this.parentNode.appendChild(this);
    });
};
    

function selectorEscape(val){
    return val.replace(/[ !"#$%&'()*+,.\/:;<=>?@\[\\\]^`{|}~]/g, '\\$&');
};



