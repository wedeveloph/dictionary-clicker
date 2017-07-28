function Item(type, name, increase_rate, base_cost) {
	this.type = type
	this.name = name
	this.rate = increase_rate
	this.cost = base_cost
	this.level = 0
}

clicks = 0
click_rate = 1 // Dictionaries per click
auto_rate = 0 // Auto-dictionary rate per second
clicks_per_second = 0

// Items that increse rate [increase_rate, base_cost, level]
items = [new Item("click", "keith", 5, 100),
		 new Item("click", "thesaurus", 1, 50),
		 new Item("auto", "factory", 2, 80),
		 new Item("auto", "librarian", 4, 90)]

$("#dictionary").click(function() {
	// Regular clicking lmao
	clicks += click_rate
	clicks_per_second += 1
	update_display()
})

function purchase_item(item) {
	for(i = 0; i < items.length; i++) {
		if(items[i].name == item && clicks >= items[i].cost) {
			clicks -= items[i].cost
			items[i].level += 1
			
			// Updates cost exponentially
			items[i].cost *= 1.15**items[i].level
			items[i].cost = Math.round(Number(items[i].cost))
			
			if(items[i].type == "auto") {
				auto_rate += items[i].rate
			}
			if(items[i].type == "click") {
				click_rate += items[i].rate
			}
		}

		// Add background effects to keep it interesting
		if(items[i].level > 3) {
			$("body").addClass("scroll-dictionaries")
		}
		if(items[i].level > 5) {
			$("body").removeClass("scroll-dictionaries")
			$("body").addClass("weird-colors")
		}
		if(items[i].level > 8) {
			$("body").removeClass("weird-colors")
			$("body").addClass("scroll-keith")
		}
	}
}

function update_display() {
	// Updates total dictionary count
	if(clicks == 1) {
		$("#total").text(clicks+" dictionary") // Gotta keep grammar on point
	}
	else {
		$("#total").text(clicks+" dictionaries")
	}

	// Updates color of buttons depending on availability
	for(i = 0; i < items.length; i++) {
		$("."+items[i].name+".item_price").text("Costs "+items[i].cost+" dictionaries.")

		if(clicks < items[i].cost) {
			$("#"+items[i].name).addClass("dark")
		}
		else {
			$("#"+items[i].name).removeClass("dark")
		}
	}
}

// Manually attach click events to elements :^(
$("#factory").click(function() {
	purchase_item("factory")
})
$("#keith").click(function() {
	purchase_item("keith")
})
$("#thesaurus").click(function() {
	purchase_item("thesaurus")
})
$("#librarian").click(function() {
	purchase_item("librarian")
})

// Auto update the clicker
intervalID = window.setInterval(auto_increment, 1000)
function auto_increment() {
	clicks += auto_rate
	update_display()
	
	$("#rate").text("per second: " + ((clicks_per_second*click_rate)+auto_rate))
	clicks_per_second = 0
}

update_display()