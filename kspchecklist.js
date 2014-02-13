
var userGroups = new Array();

$(function()  {
	jQuery.validator.setDefaults({
		errorPlacement : function(error, element) {

			if (element.parent().hasClass('input-prepend')
					|| element.parent().hasClass('input-append')) {
				error.insertAfter(element.parent());
			} else {
				error.insertAfter(element);
			}
		},
		errorElement : "small",
		wrapper : "div",
		highlight : function(element) {
			$(element).closest('.form-group').addClass('has-error');
		},
		success : function(element) {
			$(element).closest('.form-group').removeClass('has-error');
		}
	});
	
	jQuery.validator.addMethod("uniqueName", function(value, element) {
		var curindex = $("#create_done").data("groupindex");
		if(curindex == -1) {
			return searchGroupIndex(value) == -1;
		} else {
			return curindex == searchGroupIndex(value) ||  searchGroupIndex(value) == -1;
		}
	});
	
	jQuery.validator.addMethod("uniqueItem", function(value, element) {
		if(value == "") {
			return true;
		}
		
		var count = 0;
		$('input:text.creategroup').each(function() {
			var item = $(this).val();
			if(item == value) {
				++count;
			}
		});
		
		return count <= 1;
	});
	
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
		if(!$("#create_form").valid()) {
			return;
		}
		
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
	
	$("#create_form").validate({
		rules: {
			group_name: { uniqueName : true, required: true },
			item : {uniqueItem : true}
		},
		messages : {
			group_name: { uniqueName: "Groupname not unique", required: "* required"},
			item : {uniqueItem: "Item does already exist in this group"}
		}
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

remove_item = function() {
	$(this).parent().parent().remove();
};

createItem = function(name) {
	var d = $('<div></div>').addClass("form-group");
	var d2 = $("<div></div>").addClass("col-sm-offset-2").addClass("col-sm-6");
	var input = $("<input />", {
		placeholder: "Item",
		type: "text",
		name: "item"
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

