
function makeRankingTables(data) {
    var rank = d3.select("div.ranking");

    n_fields.forEach( function(label) {
	var tmp = data.concat();
	tmp.sort(function(a,b){
	    if( a[label] > b[label] ) return -1;
	    if( a[label] < b[label] ) return 1;
	    return 0;
	});
	tmp = tmp.slice(0,N);
	var t = rank.append("div").attr("class","col-md-4")
	    .append("table").attr("class","table");
	
	var th = t.append("thead");
	var tb = t.append("tbody");

	th.append('tr').selectAll('th').data(['id',label]).enter().append('th')  
	    .text(function(d){return fieldToLabel[d];} )
	    .on("mouseover",  function(d){ mouseOverTick(d);})
	    .on("mouseout",  function(d){ mouseOutTick();});


	tb.selectAll('tr').data(tmp).enter().append('tr')
	    .selectAll('td').data(function (row) {
		var re = d3.entries(row).filter( function (e,idx,ar) {return  e.key == 'id' || e.key == label;});
		re.sort( function(a,b) {
		    if( a.key == 'id' ) return -1;
		    if( b.key == 'id' ) return 1;
		    return 0;
		});
		return re;
	    })
	    .enter().append('td') 
	    .text(function(d){return d.value; })
    });
};
