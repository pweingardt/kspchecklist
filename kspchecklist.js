
var userGroups = new Array();

$(function()  {
	$('a[rel*=leanModal]').leanModal({ top : 200, overlay : 0.4, closeButton: ".modal_close" });
	
	$("#create_button").click(function() {

		var inputs = new Array();
		
		$('input:checkbox:checked.checkgroup').each(function() {
			inputs.push(this.name);
		});
		var groups = createCheckList(inputs);
		
		var div = $("#checklist");
		div.empty();
		
		for(var i in groups) {
			var divc = $('<div></div>').addClass("control-group");
			var fieldset = $('<fieldset></fieldset>').addClass('fieldset-auto-width');
			var legend = $('<legend></legend>');
			
			legend.append(groups[i].name);
			fieldset.append(legend);
			
			for(var n in groups[i].items) {
				fieldset.append("<label class=\"checkbox\">" + 
						"<input type=\"checkbox\" style=\"color: red;\">" +
						groups[i].items[n] + "</label>");
			}
			divc.append(fieldset);
			div.append(divc);
		}
	});
	
	$("#create_check_group").click(function() {
		$("#btn_create_check_group").click();
		$("#group_items").empty();
		$("#input_group_name").val("");
		$("#add_item").click();
		$("#create_done").html("Create").data("groupindex", -1);
	});
	
	$("#add_item").click(function() {
		$("#group_items").append(createItem(""));
	});
	
	$("#create_done").click(function() {
		var name = $("#input_group_name").val();
		var groupindex = $(this).data("groupindex");
		
		var group = new Group(name);
		
		$('input:text.creategroup').each(function() {
			var item = $(this).val();
			if(item != "") {
				group.add($(this).val());
			}
		});
		
		if(groupindex == -1) {
			userGroups.push(group);
		} else {
			userGroups[groupindex] = group;
		}
		
		saveGroups();
		updateUserGroups();
		$(".modal_close").click();
	});
	
	updateUserGroups();
});

updateUserGroups = function() {
	if(localStorage) {
		userGroups = JSON.parse(localStorage.getItem("usergroups"));
	}
	
	if(userGroups == null) {
		userGroups = new Array();
	}
	
	$("#user_groups").empty();
	
	for(var i in userGroups) {
		var g = userGroups[i];
		var l = $("<label />").addClass("checkbox");
		var input = $("<input />", {
			type: "checkbox",
			name: g.name
		}).addClass("checkgroup");
		l.append(input).append(g.name);
		
		var ae = $("<a />").addClass("edit").data("groupname", g.name);
		ae.click(editCheckGroup);
	
		l.append(ae);
		
		ae = $("<a />").addClass("delete").data("groupname", g.name);
		ae.click(deleteCheckGroup);
		
		l.append(ae);
		
		$("#user_groups").append(l);
	}
};

editCheckGroup = function() {
	var g = searchGroup($(this).data("groupname"));
	$("#btn_create_check_group").click();
	$("#group_items").empty();
	$("#input_group_name").val(g.name);
	$("#create_done").html("Edit");
	
	for(var i in g.items) {
		$("#group_items").append(createItem(g.items[i]));
	}
	
	$("#create_done").data("groupindex", searchGroupIndex(g.name));
};

deleteCheckGroup = function() {
	var g = searchGroup($(this).data("groupname"));
	var i = userGroups.indexOf(g);
	userGroups.splice(i, 1);
	
	saveGroups();
	updateUserGroups();
};

saveGroups = function() {
	if(localStorage) {
		localStorage.setItem('usergroups', JSON.stringify(userGroups));
	}
};

remove_item = function() {
	$(this).parent().parent().remove();
};

createItem = function(name) {
	var d = $('<div></div>').addClass("form-group");
	var d2 = $("<div></div>").addClass("col-sm-offset-2").addClass("col-sm-6");
	var input = $("<input />", {
		placeholder: "Item",
		type: "text"
	}).addClass("form-control").addClass("creategroup");
	input.val(name);
	d2.append(input);
	
	d.append(d2);
	
	d2 = $("<div></div>").addClass("col-sm-2");
	var btn = $("<button/>", {
		click: remove_item
	}).addClass("btn").addClass("btn-default").addClass("btn_full").append("remove");
	d2.append(btn);
	d.append(d2);
	
	return d;
};

createCheckList = function(values) {
	var groups = new Array();
	
	for(var v in values) {
		var name = values[v];
		
		var g = new Group("(undefined)");
		
		switch(name) {
		case "LANDING":
			g.name = "(Atmospheric) landing";
			g.add("Dragchutes (atmospheric)");
			g.add("Parachutes (atmospheric)");
			g.add("Legs (long enough)");
			g.add("Ladder for EVA (if needed)");
			break;
			
		case "ORBITING":
			g.name = "Orbiting";
			break;
			
		case "KETHANE_MINING":
			g.name = "Kethane mining";
			g.add("Kethane container");
			g.add("Kethane converter");
			g.add("Kethane mining drill");
			g.add("Kethane scanner");
			break;
			
		case "SCIENCING":
			g.name = "Sciencing";
			g.add("Communication link to Kerbin");
			
			g.add("Gravman Negative Gravioli Detector");
			g.add("2HOT Thermometer");
			g.add("PresMat Barometer");
			g.add("Double-C Seismic Accelerometer");
			
			g.add("SC-9001 Science Junior");
			g.add("Mystery Goo Containment Unit");
			g.add("Mobile processing Lab MPL-LG-2");
			g.add("Sensor array computing nose cone");
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
			
		default:
			var ug = searchGroup(name);
			g.name = ug.name;
			for(var i in ug.items) {
				g.add(ug.items[i]);
			}
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
	
	groups.sort(function(a, b) {
		return (a.items.length < b.items.length);
	});
	
	return groups;
};

searchGroup = function(name) {
	for(var i in userGroups) {
		var g = userGroups[i];
		if(g.name == name) {
			return g;
		}
	}
	return new Group("undefined");
};

searchGroupIndex = function(name) {
	for(var i in userGroups) {
		var g = userGroups[i];
		if(g.name == name) {
			return i;
		}
	}
	return -1;
};


function Group(n) {
	this.name = n;
	this.items = new Array();
	
	this.add = function(name) {
		this.items.push(name);
	};
	
}