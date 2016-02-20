function showTip(text) {
    d3.select("#tooltip")
	.style("visibility", "visible")
        .style("top", (d3.event.pageY-10)+"px")
        .style("left",(d3.event.pageX+10)+"px")
    	.text(text);
};

function closeTip(text) {
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
