var color = d3.scale.category10();

function drawParallelChart(data)
{
    var left_padding = 50;
    var top_padding = 50;
    var bottom_padding = 50;
    var right_padding = 50;    
    var width = 1000;
    var height = 500;
    if( N > 30 )
    {
	height = N*15;
    }

    var svg = d3.select('div.parallel')
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

    var txt = svg.selectAll('.text').data(data).enter()
	.append("svg:a")
	.attr("xlink:href", function(d) {return "http://qiita.com/tags/"+d.id;})
	.append("text")
	.attr("x",function(d) {return x_scale("id");})
	.attr("y",function(d) {return y_scale["id"](d.id);})
	.attr("class",function(d){return d.id;})
	.text(function (d) {return d.id;})
	.on("mouseover",  function(d,i){ mouseOverTag(i);})
	.on("mouseout",   function(d,i){ mouseOutTag(i);});
    
    n_fields.forEach( function(tag,tindex,ar){    
	var cs = svg.selectAll('.'+tag).data(data).enter()
	    .append("svg:a")
	    .attr("xlink:href", function(d) {return "http://qiita.com/tags/"+d.id;})
	    .append("circle")
	    .attr({ cx : function(d) {return x_scale(tag);},
		    cy : function(d) {return y_scale[tag](d[tag]);},
		    fill : function(d) {return color(tindex);},
		    r : function(d) {return r_scale[tag](d[tag]);},
		    id : function(d) {return tag+'-'+d.id;},
		    class : function(d) {return tag+' '+d.id;}})
	    .on("mouseover",  function(d,i){ mouseOverTag(i);})
	    .on("mouseout",   function(d,i){ mouseOutTag(i);});
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
	    .on("mouseover",  function(d){ mouseOverTag(i);})
	    .on("mouseout",  function(d){ mouseOutTag(i);});
    });

    svg.append("g")
	.attr("class", "category label")
	.attr("transform", "translate("+ -x_scale.rangeBand()/2+",-30)")
	.call(xAxis);

    svg.selectAll(".tick")
	.on("mouseover",  function(l){ mouseOverTick(l);})
	.on("mouseout",  function(l){ mouseOutTick();})

    svg.selectAll("circle").moveToFront();
    svg.selectAll("text").moveToFront();
};

function mouseOverTick(l) {
    showTip( fieldToLongLabel[l] );
};


function mouseOutTick() {
    closeTip();
};

function mouseOverTag(i) {
    showTip( data[i]["id"]+" "+n_fields.map( function(f) {return fieldToLabel[f]+": "+data[i][f]}).join(", ") );

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

function mouseOutTag(i) {
    closeTip();
    
    d3.selectAll("path."+data[i]["id"]).classed("active",false);
    n_fields.forEach( function(tag,ind) {
	    var c = d3.selectAll("circle."+tag)
		.attr({"fill":function (d) {return color(ind);}});
	});
    d3.select("#tooltip")
	.style("visibility", "hidden");
};
