

$(function()  {
	$("#create_button").click(function() {

		var inputs = new Array();
		
		$('#mission_form input:checkbox:checked').each(function() {
			inputs.push(this.name);
		});
		var groups = createCheckList(inputs);
		
		var div = $("#checklist");
		div.empty();
		
		var id = 1;
		
		for(var i in groups) {
			var fieldset = $('<fieldset></fieldset>').addClass('fieldset-auto-width');
			var legend = $('<legend></legend>');
			
			legend.append(groups[i].name);
			fieldset.append(legend);
			
			for(var n in groups[i].items) {
				var dynlabel = "dyn_label_ " + (id++);
				fieldset.append("<div><input type=\"checkbox\" style=\"color: red;\"" +
						"id=\"" + dynlabel + "\"><label for=\"" + dynlabel + "\">" + 
						groups[i].items[n] + "</label></div>");
			}
			
			div.append(fieldset);
		}
	});
});


createCheckList = function(values) {
	var groups = new Array();
	
	for(var v in values) {
		var name = values[v];
		
		var g = new Group("(undefined)");
		
		switch(name) {
		case "LANDING_ATMO":
			g.add("Parachutes");
		case "LANDING":
			g.name = "(Atmospheric) landing";
			g.add("Legs (long enough)");
			g.add("Ladder for EVA (if needed");
			break;
			
		case "ORBITING":
			g.name = "Orbiting";
			break;
			
		case "KETHANE_MINING":
			g.name = "Kethane mining";
			g.add("Kethane container");
			g.add("Kethane converter");
			g.add("Kethane mining drill");
			break;
			
		case "SCIENCING":
			g.name = "Sciencing";
			g.add("Communication link to Kerbin");
			
			g.add("Gravimeter");
			g.add("Thermometer");
			g.add("Barometer");
			g.add("Seismograph");
			
			g.add("Materials study");
			g.add("Science Lab");
			g.add("Atmospheric study nose cone");
			break;
			
		case "REMOTE_TECHING":
			g.name = "Remote teching";
			g.add("Solar panels (big enough)");
			g.add("Short range communication antenna");
			g.add("Long range communication dish");
			break;
			
		case "DOCKING":
			g.name = "Docking";
			g.add("Monopropellant");
			g.add("RCS thrusters");
			g.add("Docking port (correct orientation)");
			break;			
		}
		
		groups.push(g);
	}
	
	var g = new Group("General");
	g.add("Hatch clear for EVA");
	g.add("Lights");
	g.add("Reaction wheels (if necessary)");
	groups.push(g);
	
	g = new Group("Energy");
	g.add("Solar panels");
	g.add("Batteries");
	g.add("Back-up generator");
	groups.push(g);
	
	return groups;
}


function Group(n) {
	this.name = n;
	this.items = new Array();
	
	this.add = function(name) {
		this.items.push(name);
	}
	
}