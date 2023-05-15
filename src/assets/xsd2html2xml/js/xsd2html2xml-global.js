(function() {

	window.TABCONTENT_SELECTOR_STRING = 'div.tabcontent';
	window.STRUCTUTING_NODE_NAME = '_structuringNode';

if ( typeof window.xsd2html2xml === 'undefined' ) {
	window['xsd2html2xml'] = [];
}

window['xsd2html2xml']["<<REPLACE>>"] = [];

/* POLYFILLS */

/* add .matches if not natively supported */
if (!Element.prototype.matches)
	Element.prototype.matches =
		Element.prototype.msMatchesSelector ||
		Element.prototype.webkitMatchesSelector;

/* add .closest if not natively supported */
if (!Element.prototype.closest)
	Element.prototype.closest = function (s) {
		var el = this;
		do {
			if (el.nodeType !== 1) return null;
			if (el.matches(s)) return el;
			el = el.parentElement || el.parentNode;
		} while (el !== null);
		return null;
	};

/* add .forEach if not natively supported */
if (!NodeList.prototype.forEach) {
	NodeList.prototype.forEach = function (callback) {
		var i = 0;
		while (i != this.length) {
			callback.apply(this, [this[i], i, this]);
			i++;
		}
	};
}

/* add .previousElementSibling if not supported */
(function (arr) {
	arr.forEach(function (item) {
		if (item.hasOwnProperty("previousElementSibling")) {
			return;
		}
		Object.defineProperty(item, "previousElementSibling", {
			configurable: true,
			enumerable: true,
			get: function () {
				let el = this;
				while ((el = el.previousSibling)) {
					if (el.nodeType === 1) {
						return el;
					}
				}
				return null;
			},
			set: undefined,
		});
	});
})([Element.prototype, CharacterData.prototype]);

/* EVENT HANDLERS */

window['xsd2html2xml']["<<REPLACE>>"].clickAddButton = function (button) {
	var newNode = button.previousElementSibling.cloneNode(true);

	newNode.removeAttribute("hidden");

	newNode.querySelectorAll("input, select, textarea").forEach(function (o) {
		if (o.closest("[hidden]") == null) {
			o.removeAttribute("disabled");
		}

		/* CHANGE JK */
		o.removeAttribute('data-autocomplete-flag');

	});

	//set a new random id for radio buttons
	newNode.querySelectorAll("input[type='radio']").forEach(function (o) {
		if (
			o.parentElement.previousElementSibling != null &&
			o.parentElement.previousElementSibling.previousElementSibling !=
				null &&
			o.parentElement.previousElementSibling.previousElementSibling
				.children.length > 0 &&
			o.parentElement.previousElementSibling.previousElementSibling.children[0].hasAttribute(
				"type"
			) &&
			o.parentElement.previousElementSibling.previousElementSibling.children[0].getAttribute(
				"type"
			) === "radio"
		) {
			o.setAttribute(
				"name",
				o.parentElement.previousElementSibling.previousElementSibling.children[0].getAttribute(
					"name"
				)
			);
		} else {
			o.setAttribute(
				"name",
				o
					.getAttribute("name")
					.concat(Math.random().toString().substring(2))
			);
		}

		o.setAttribute(
			"onclick",
			"window['xsd2html2xml']['<<REPLACE>>'].clickRadioInput(this, '"
				.concat(o.getAttribute("name"))
				.concat("');")
		);
	});

	button.parentNode.insertBefore(newNode, button.previousElementSibling);

	if (
		button.parentNode.children.length - 2 ==
		button.getAttribute("data-xsd2html2xml-max")
	)
		button.setAttribute("disabled", "disabled");

	if (
		newNode.querySelectorAll("[data-xsd2html2xml-primitive='id']").length >
		0
	)
	window['xsd2html2xml']["<<REPLACE>>"].updateIdentifiers(button);

	/* CHANGE JK: Remove the flag for added dependency from the elements */
	newNode.querySelectorAll('[data-dependency-init="1"]').forEach(function (o) {
		o.removeAttribute('data-dependency-init');
	});

	/* CHANGE JK: Fire an event after the new element was created */
	const addEvent = new Event('xsd2html2xml-add-button');
	window.dispatchEvent(addEvent);
};

window['xsd2html2xml']["<<REPLACE>>"].clickRemoveButton = function (button) {
	var section = button.closest("section");

	if (
		button.closest("section").children.length - 2 ==
		button
			.closest("section")
			.lastElementChild.getAttribute("data-xsd2html2xml-min")
	) {
		button.closest("section").lastElementChild.click();
		alert('Item cannot be removed because at least one is required.');
	}

	if (
		button.closest("section").children.length - 2 ==
		button
			.closest("section")
			.lastElementChild.getAttribute("data-xsd2html2xml-max")
	)
		button.closest("section").lastElementChild.removeAttribute("disabled");

	button.closest("section").removeChild(button.closest("fieldset, label"));

	if (
		section.querySelectorAll("[data-xsd2html2xml-primitive = 'id']")
			.length > 0
	)
	window['xsd2html2xml']["<<REPLACE>>"].updateIdentifiers(button);

	/* CHANGE JK: Fire an event after the new element was removed */
	const removeEvent = new Event('xsd2html2xml-remove-button');
	window.dispatchEvent(removeEvent);
};

window['xsd2html2xml']["<<REPLACE>>"].clickRadioInput = function (input, name) {
	var activeSections = [];
	var currentSection = input.parentElement.nextElementSibling;

	while (
		currentSection &&
		currentSection.hasAttribute("data-xsd2html2xml-choice")
	) {
		activeSections.push(currentSection);
		currentSection = currentSection.nextElementSibling;
	}

	input.closest(window.TABCONTENT_SELECTOR_STRING)
		.querySelectorAll("[name=".concat(name).concat("]"))
		.forEach(function (o) {
			o.removeAttribute("checked");

			var section = o.parentElement.nextElementSibling;

			while (
				section &&
				section.hasAttribute("data-xsd2html2xml-choice")
			) {
				section
					.querySelectorAll("input, select, textarea")
					.forEach(function (p) {
						var contained = false;
						activeSections.forEach(function (q) {
							if (q.contains(p)) contained = true;
						});

						if (contained) {
							if (
								p.closest("[data-xsd2html2xml-choice]") ===
								section
							) {
								if (p.closest("*[hidden]") === null)
									p.removeAttribute("disabled");
								else p.setAttribute("disabled", "disabled");
							}
						} else {
							p.setAttribute("disabled", "disabled");
						}
					});

				section = section.nextElementSibling;
			}
		});

	input.setAttribute("checked", "checked");
};

window['xsd2html2xml']["<<REPLACE>>"].updateIdentifiers = function (button) {
	var globalIdentifiers = [];

	if ( typeof button !== 'undefined' && button.closest(window.TABCONTENT_SELECTOR_STRING) != null ) {

		button.closest(window.TABCONTENT_SELECTOR_STRING)
			.querySelectorAll("[data-xsd2html2xml-primitive='id']:not([disabled])")
			.forEach(function (o) {
				if (o.hasAttribute("value")) {
					globalIdentifiers.push(o.getAttribute("value"));
				}
			});
	} else {
		window['xsd2html2xml']["<<REPLACE>>"]['selector']
			.querySelectorAll("[data-xsd2html2xml-primitive='id']:not([disabled])")
			.forEach(function (o) {
				if (o.hasAttribute("value")) {
					globalIdentifiers.push(o.getAttribute("value"));
				}
			});
	}

	globalIdentifiers = globalIdentifiers.filter(function uniques(
		value,
		index,
		self
	) {
		return self.indexOf(value) === index;
	});

	if ( typeof button !== 'undefined' && button.closest(window.TABCONTENT_SELECTOR_STRING) != null ) {

		button.closest(window.TABCONTENT_SELECTOR_STRING)
			.querySelectorAll(
				"[data-xsd2html2xml-primitive='idref'], [data-xsd2html2xml-primitive='idrefs']"
			)
			.forEach(function (o) {
				while (o.firstChild) {
					o.removeChild(o.firstChild);
				}

				for (var i = 0; i < globalIdentifiers.length; i++) {
					var option = document.createElement("option");
					option.textContent = globalIdentifiers[i];
					option.setAttribute("value", globalIdentifiers[i]);
					o.append(option);
				}
		});
	} else {
		window['xsd2html2xml']["<<REPLACE>>"]['selector']
			.querySelectorAll(
				"[data-xsd2html2xml-primitive='idref'], [data-xsd2html2xml-primitive='idrefs']"
			)
			.forEach(function (o) {
				while (o.firstChild) {
					o.removeChild(o.firstChild);
				}

				for (var i = 0; i < globalIdentifiers.length; i++) {
					var option = document.createElement("option");
					option.textContent = globalIdentifiers[i];
					option.setAttribute("value", globalIdentifiers[i]);
					o.append(option);
				}
			});
	}


};

window['xsd2html2xml']["<<REPLACE>>"].pickFile = function (input, file, type) {
	var resetFilePicker = function (input) {
		input.removeAttribute("value");
		input.removeAttribute("type");
		input.setAttribute("type", "file");
	};

	var fileReader = new FileReader();

	fileReader.onloadend = function () {
		if (fileReader.error) {
			alert(fileReader.error);
			resetFilePicker(input);
		} else {
			input.setAttribute(
				"value",
				(type === "base64binary" || type.endsWith(":base64binary"))
					? fileReader.result.substring(
							fileReader.result.indexOf(",") + 1
					  )
					: //convert base64 to base16 (hexBinary)
					  atob(
							fileReader.result.substring(
								fileReader.result.indexOf(",") + 1
							)
					  )
					  .split('')
					  .map(function (aChar) {
						  return ('0' + aChar.charCodeAt(0).toString(16)).slice(-2);
					  })
							.join("")
							.toUpperCase()
			);
		}
	};

	if (file) {
		fileReader.readAsDataURL(file);
	} else {
		resetFilePicker(input);
	}

	if (input.getAttribute("data-xsd2html2xml-required"))
		input.setAttribute("required", "required");
};

/* HTML POPULATORS */

window['xsd2html2xml']["<<REPLACE>>"].addHiddenFields = function () {
	window['xsd2html2xml']["<<REPLACE>>"]['selector']
		.querySelectorAll("[data-xsd2html2xml-min], [data-xsd2html2xml-max]")
		.forEach(function (o) {
			//add hidden element
			var newNode = o.previousElementSibling.cloneNode(true);

			newNode.setAttribute("hidden", "");

			newNode
				.querySelectorAll("input, textarea, select")
				.forEach(function (p) {
					p.setAttribute("disabled", "");
				});

			o.parentElement.insertBefore(newNode, o);
		});
};

window['xsd2html2xml']["<<REPLACE>>"].ensureMinimum = function () {
	window['xsd2html2xml']["<<REPLACE>>"]['selector']
		.querySelectorAll("[data-xsd2html2xml-min], [data-xsd2html2xml-max]")
		.forEach(function (o) {
			//add minimum number of elements
			if (o.hasAttribute("data-xsd2html2xml-min")) {
				//if no minimum, remove element
				if (
					o.getAttribute("data-xsd2html2xml-min") === "0" &&
					//check for input elements existing to handle empty elements
					o.previousElementSibling.previousElementSibling.querySelector(
						"input, textarea, select"
					) &&
					//check if element has been populated with data from an xml document
					Array.from(o.previousElementSibling.previousElementSibling.querySelectorAll("input, textarea, select")).filter(function(el) {return el.hasAttribute("data-xsd2html2xml-filled")}).length == 0) {
					window['xsd2html2xml']["<<REPLACE>>"].clickRemoveButton(
						o.parentElement.children[0].querySelector(
							"legend > button.remove, span > button.remove"
						)
					);
					//if there is only one allowed element that has been filled, disable the button
				} else if (
					o.getAttribute("data-xsd2html2xml-max") === "1" &&
					//check for input elements existing to handle empty elements
					o.previousElementSibling.previousElementSibling.querySelector(
						"input, textarea, select"
					) &&
					//check if element has been populated with data from an xml document
					o.previousElementSibling.previousElementSibling
						.querySelector("input, textarea, select")
						.hasAttribute("data-xsd2html2xml-filled")
				) {
					o.setAttribute("disabled", "disabled");
					//else, add up to minimum number of elements
				} else {
					var remainder =
						o.getAttribute("data-xsd2html2xml-min") -
						(o.parentNode.children.length - 2);

					for (var i = 0; i < remainder; i++) {
						window['xsd2html2xml']["<<REPLACE>>"].clickAddButton(o);
					}
				}
			}
		});
};

window['xsd2html2xml']["<<REPLACE>>"].xmlToHTML = function (root) {
	var xmlDocument;

	var allMetaData = window['xsd2html2xml']["<<REPLACE>>"]['selector'].querySelectorAll("span[data-name='generator'][data-content='XSD2HTML2XML v3: https://github.com/MichielCM/xsd2html2xml']");

	if ( allMetaData.length ) {

		for ( var i = 0; i < allMetaData.length; i++ ) {

			xmlDocument = null;

			if ( allMetaData[i].getAttribute('data-xsd2html2xml-source') ) {

				xmlDocument = new DOMParser().parseFromString(allMetaData[i].getAttribute('data-xsd2html2xml-source'), "application/xml");

				var parentContentDiv = allMetaData[i].closest(window.TABCONTENT_SELECTOR_STRING);

				window['xsd2html2xml']["<<REPLACE>>"].parseNode(
					xmlDocument.childNodes[0],
					parentContentDiv.querySelector(
						"[data-xsd2html2xml-xpath = '/"
							.concat(xmlDocument.childNodes[0].nodeName)
							.concat("']")
					)
				);
			}
		}
	}

	//check if form was generated from an XML document
	// if (
	// 	document
	// 		.querySelector(
	// 			"meta[name='generator'][content='XSD2HTML2XML v3: https://github.com/MichielCM/xsd2html2xml']"
	// 		)
	// 		.getAttribute("data-xsd2html2xml-source")
	// ) {
	// 	//parse xml document from attribute
	// 	xmlDocument = new DOMParser().parseFromString(
	// 		document
	// 			.querySelector(
	// 				"meta[name='generator'][content='XSD2HTML2XML v3: https://github.com/MichielCM/xsd2html2xml']"
	// 			)
	// 			.getAttribute("data-xsd2html2xml-source"),
	// 		"application/xml"
	// 	);

	// 	//start parsing nodes, providing the root node and the corresponding document element
	// 	parseNode(
	// 		xmlDocument.childNodes[0],
	// 		document.querySelector(
	// 			"[data-xsd2html2xml-xpath = '/"
	// 				.concat(xmlDocument.childNodes[0].nodeName)
	// 				.concat("']")
	// 		)
	// 	);
	// }
};

window['xsd2html2xml']["<<REPLACE>>"].setValue = function (element, value) {

	var containerIdentifier = element.closest(TABCONTENT_SELECTOR_STRING).getAttribute('data-tab');

	if ( typeof window['xsd2html2xml']["<<REPLACE>>"].globalValuesMap[containerIdentifier] === 'undefined' ) {
		window['xsd2html2xml']["<<REPLACE>>"].globalValuesMap[containerIdentifier] = [];
	}

	// console.log('element');
	// console.log(element);
	// console.log('value');
	// console.log(value);

	element
		.querySelector("input, textarea, select")
		.setAttribute("data-xsd2html2xml-filled", "true");

	if (element.querySelector("input") !== null) {
		if (
			element
				.querySelector("input")
				.getAttribute("data-xsd2html2xml-primitive") === "boolean"
		) {
			if (value === "true") {
				element
					.querySelector("input")
					.setAttribute("checked", "checked");
			}
		} else {
			element.querySelector("input").setAttribute("value", value);
		}

		if (element.querySelector("input").getAttribute("type") === "file") {
			element.querySelector("input").removeAttribute("required");
			element
				.querySelector("input")
				.setAttribute("data-xsd2html2xml-required", "true");
		}
	}

	if (element.querySelector("textarea") !== null) {
		element.querySelector("textarea").textContent = value;
	}

	if (element.querySelector("select") !== null) {
		if (
			element
				.querySelector("select")
				.getAttribute("data-xsd2html2xml-primitive") === "idref" ||
			element
				.querySelector("select")
				.getAttribute("data-xsd2html2xml-primitive") === "idrefs"
		) {
			window['xsd2html2xml']["<<REPLACE>>"].globalValuesMap[containerIdentifier].push({
				object: element.querySelector("select"),
				values: value.split(/\s+/),
			});
			/*var values = value.split(/\\s+/);
			for (var i=0; i<values.length; i++) {
				element.querySelector("select option[value = '".concat(values[i]).concat("']")).setAttribute("selected", "selected");
			}*/
		} else {

			// console.log('element 2');
			// console.log(element);
			// console.log('magic');
			// console.log("select option[value = '".concat(value).concat("']"));

			// console.log('VALUE');
			// console.log(value);

			/* CHANGE JK: Check if the select element even has the option */
			if ( element.querySelector("select option[value = '".concat(value).concat("']")) ) {

			}

			element
				.querySelector(
					"select option[value = '".concat(value).concat("']")
				)
				.setAttribute("selected", "selected");

		}
	}
};

window['xsd2html2xml']["<<REPLACE>>"].parseNode = function (node, element) {

	// CHANGE JK: Special case for preIdentValue Attribute
	var preIdentValue = '';

	//iterate through the node's attributes and fill them out
	for (var i = 0; i < node.attributes.length; i++) {

		// CHANGE JK: Special case for preIdentValue Attribute
		if ( node.attributes[i].nodeName === 'preIdentValue' ) {
			preIdentValue = node.attributes[i].nodeValue;
		}

		var attribute = element.querySelector(
			"[data-xsd2html2xml-xpath = '"
				.concat(
					element.getAttribute("data-xsd2html2xml-xpath").concat(
						"/@".concat(node.attributes[i].nodeName)
						//"/@*[name() = \"".concat(node.attributes[i].nodeName).concat("\"]")
					)
				)
				.concat("']")
		);

		// CHANGE JK: If the attribute is still null, check if the |content suffix is missing
		if ( attribute === null ) {
			var attribute = element.querySelector(
				"[data-xsd2html2xml-xpath = '"
					.concat(
						element.getAttribute("data-xsd2html2xml-xpath").concat(
							"/@".concat(node.attributes[i].nodeName)
							//"/@*[name() = \"".concat(node.attributes[i].nodeName).concat("\"]")
						)
					)
					.concat("|content")
					.concat("']")
			);
		}

		if (attribute !== null) {
			window['xsd2html2xml']["<<REPLACE>>"].setValue(attribute, node.attributes[i].nodeValue);
		}
	}

	//if there is only one (non-element) node, it must contain the value; note: this will not work for potential mixed="true" support
	if (
		node.childNodes.length === 1 &&
		node.childNodes[0].nodeType === Node.TEXT_NODE
	) {
		//in the case of complexTypes with simpleContents, select the sub-element that actually contains the input element
		if (
			element.querySelectorAll(
				"[data-xsd2html2xml-xpath='"
					.concat(element.getAttribute("data-xsd2html2xml-xpath"))
					.concat("']")
			).length > 0
		) {
			window['xsd2html2xml']["<<REPLACE>>"].setValue(
				element.querySelector(
					"[data-xsd2html2xml-xpath='"
						.concat(element.getAttribute("data-xsd2html2xml-xpath"))
						.concat("']")
				),
				node.childNodes[0].nodeValue
			);

		} else if (

			// CHANGE JK: If the element is still null, check if the |content suffix is missing
			element.querySelectorAll(
				"[data-xsd2html2xml-xpath='"
					.concat(element.getAttribute("data-xsd2html2xml-xpath"))
					.concat("|content")
					.concat("']")
			).length > 0
		) {

			window['xsd2html2xml']["<<REPLACE>>"].setValue(
				element.querySelector(
					"[data-xsd2html2xml-xpath='"
						.concat(element.getAttribute("data-xsd2html2xml-xpath"))
						.concat("|content")
						.concat("']")
				),
				node.childNodes[0].nodeValue
			);

		} else {

			// CHANGE JK: Special case for preIdentValue
			if ( preIdentValue !== '' ) {
				element.querySelector('input').setAttribute('data-xsd2html2xml-pre-filled-value-autocomplete', preIdentValue);
			}

			window['xsd2html2xml']["<<REPLACE>>"].setValue(element, node.childNodes[0].nodeValue);
		}
		//else, iterate through the children
	} else {
		var previousChildName;

		for (var i = 0; i < node.childNodes.length; i++) {
			var childNode = node.childNodes[i];

			// console.log('node');
			// console.log(node);
			// console.log('node.childNodes');
			// console.log(node.childNodes);
			// console.log('childNode');
			// console.log(childNode);
			// console.log('element');
			// console.log(element);

			if (childNode.nodeType === Node.ELEMENT_NODE) {
				//find the corresponding element

				// console.log("[data-xsd2html2xml-xpath = '"
				// .concat(
				// 	element
				// 		.getAttribute("data-xsd2html2xml-xpath")
				// 		.concat(
				// 			"/".concat(childNode.nodeName)
				// 			//"/*[name() = \"".concat(childNode.nodeName).concat("\"]")
				// 		)
				// )
				// .concat("']"));

				var childElement = element.querySelector(
					"[data-xsd2html2xml-xpath = '"
						.concat(
							element
								.getAttribute("data-xsd2html2xml-xpath")
								.concat(
									"/".concat(childNode.nodeName)
									//"/*[name() = \"".concat(childNode.nodeName).concat("\"]")
								)
						)
						.concat("']")
				);

				// CHANGE JK: If the childElement is still null, check if the |content suffix is missing
				if ( childElement === null ) {

					var childElement = element.querySelector(
						"[data-xsd2html2xml-xpath = '"
							.concat(
								element
									.getAttribute("data-xsd2html2xml-xpath")
									.concat(
										"/".concat(childNode.nodeName)
										//"/*[name() = \"".concat(childNode.nodeName).concat("\"]")
									)
							)
							.concat("|content")
							.concat("']")
					);
				}

				//if there is an add-button (and it is not the first child node being parsed), add an element
				var button;

				if (
					childElement.parentElement.lastElementChild.nodeName.toLowerCase() ===
					"button"
				) {
					button = childElement.parentElement.lastElementChild;
				} else if (
					childElement.parentElement.parentElement.parentElement.lastElementChild.nodeName.toLowerCase() ===
						"button" &&
					!childElement.parentElement.parentElement.parentElement.lastElementChild.hasAttribute(
						"data-xsd2html2xml-element"
					)
				) {
					button =
						childElement.parentElement.parentElement.parentElement
							.lastElementChild;
				}

				if (
					button !== null &&
					childNode.nodeName === previousChildName
				) {
					window['xsd2html2xml']["<<REPLACE>>"].clickAddButton(button);

					window['xsd2html2xml']["<<REPLACE>>"].parseNode(
						childNode,
						button.previousElementSibling.previousElementSibling
						//childElement.parentElement.lastElementChild.previousElementSibling.previousElementSibling
					);
					//else, use the already generated element
				} else {
					window['xsd2html2xml']["<<REPLACE>>"].parseNode(childNode, childElement);
				}

				previousChildName = childNode.nodeName;
			}
		}
	}
};

// window.setDynamicValues = function () {
// 	for (var i = 0; i < window['xsd2html2xml']["<<REPLACE>>"]['globalValuesMap'].length; i++) {
// 		for (var j = 0; j < window['xsd2html2xml']["<<REPLACE>>"]['globalValuesMap'][i].values.length; j++) {
// 			window['xsd2html2xml']["<<REPLACE>>"]['globalValuesMap'][i].object
// 				.querySelector(
// 					"select option[value = '"
// 						.concat(window['xsd2html2xml']["<<REPLACE>>"]['globalValuesMap'][i].values[j])
// 						.concat("']")
// 				)
// 				.setAttribute("selected", "selected");
// 		}
// 	}
// };

window['xsd2html2xml']["<<REPLACE>>"].setDynamicValues = function () {
	for (var i = 0; i < window['xsd2html2xml']["<<REPLACE>>"].globalValuesMap.length; i++) {
		for (var j = 0; j < window['xsd2html2xml']["<<REPLACE>>"].globalValuesMap[i].length; j++) {
			for (var k = 0; k < window['xsd2html2xml']["<<REPLACE>>"].globalValuesMap[i][j].values.length; kj++) {
				window['xsd2html2xml']["<<REPLACE>>"].globalValuesMap[i][j].object
					.querySelector(
						"select option[value = '"
							.concat(window['xsd2html2xml']["<<REPLACE>>"].globalValuesMap[i][j].values[k])
							.concat("']")
					)
					.setAttribute("selected", "selected");
			}
		}
	}
};

/* VALUE FIXERS */

window['xsd2html2xml']["<<REPLACE>>"].setValues = function () {
	/* specifically set values on ranges */
	window['xsd2html2xml']["<<REPLACE>>"]['selector'].querySelectorAll("[type='range']").forEach(function (o) {
		if (o.getAttribute("value")) {
			o.value = o.getAttribute("value").replace(/\D/g, "");
		} else if (o.getAttribute("min")) {
			o.value = o.getAttribute("min");
		} else if (o.getAttribute("max")) {
			o.value = o.getAttribute("max");
		} else {
			o.value = 0;
			o.onchange();
		}

		o.previousElementSibling.textContent = o.value;
	});

	/* specifically set values on datepickers */
	window['xsd2html2xml']["<<REPLACE>>"]['selector']
		.querySelectorAll("[data-xsd2html2xml-primitive='gday']")
		.forEach(function (o) {
			if (o.getAttribute("value")) {
				o.value = o.getAttribute("value").replace(/-+0?/g, "");
			}
		});
	window['xsd2html2xml']["<<REPLACE>>"]['selector']
		.querySelectorAll("[data-xsd2html2xml-primitive='gmonth']")
		.forEach(function (o) {
			if (o.getAttribute("value")) {
				o.value = o.getAttribute("value").replace(/-+0?/g, "");
			}
		});
	window['xsd2html2xml']["<<REPLACE>>"]['selector']
		.querySelectorAll("[data-xsd2html2xml-primitive='gmonthday']")
		.forEach(function (o) {
			if (o.getAttribute("value")) {
				o.value = new Date()
					.getFullYear()
					.toString()
					.concat(o.getAttribute("value").substring(1));
			}
		});


	/* CHANGE JK: Fire an event after the new element was created */
	const valuesSetEvent = new Event('xsd2html2xml-values-set');
	window.dispatchEvent(valuesSetEvent);
};

/* XML GENERATORS */

window['xsd2html2xml']["<<REPLACE>>"].htmlToXML = function (root, customNodeOpening, customNodeClosing) {
	var namespaces = [];
	var prefixes = [];

	if ( typeof customNodeOpening === 'undefined' ) {
		customNodeOpening = '';
	}

	if ( typeof customNodeClosing === 'undefined' ) {
		customNodeClosing = '';
	}

	root
		.querySelectorAll(
			"[data-xsd2html2xml-namespace]:not([data-xsd2html2xml-namespace=''])"
		)
		.forEach(function (o) {
			if (
				namespaces.indexOf(
					o.getAttribute("data-xsd2html2xml-namespace")
				) == -1
			) {
				namespaces.push(o.getAttribute("data-xsd2html2xml-namespace"));

				prefixes.push(
					o
						.getAttribute("data-xsd2html2xml-name")
						.substring(
							0,
							o
								.getAttribute("data-xsd2html2xml-name")
								.indexOf(":")
						)
				);
			}
		});

	var emptyPrefixIndex = [];

	var cleanedPrefixes = [],
		cleanedNamespaces = [];

	prefixes.forEach(function(prefix, i) {
		if ( prefix == "" ) {
			emptyPrefixIndex.push(i);
		}
	});

	var removeIndexes = [];

	if ( emptyPrefixIndex.length > 1 ) {
		namespaces.forEach(function (o, i) {
			if ( o.indexOf('w3.org') !== - 1) {
				removeIndexes.push(i);
			}
		});
	}

	if ( removeIndexes.length > 0 ) {
		for ( var i = 0; i < removeIndexes.length; i++ ) {
			prefixes.splice(removeIndexes[i], 1);
			namespaces.splice(removeIndexes[i], 1);
		}
	}


	var namespaceString = "";

	namespaces.forEach(function (o, i) {
		namespaceString = namespaceString.concat(
			"xmlns"
				.concat(
					prefixes[i] == ""
						? "="
						: ":".concat(prefixes[i].concat("="))
				)
				.concat('"'.concat(namespaces[i]).concat('" '))
		);
	});

	// Check if only the content of xml should be returned
	if ( customNodeOpening !== '' && customNodeClosing !== '' ) {

		return String.fromCharCode(60)
			.concat(customNodeOpening)
			.concat(String.fromCharCode(62))
			.concat(window['xsd2html2xml']["<<REPLACE>>"].getXML(root, false, namespaceString.trim()))
			.concat(String.fromCharCode(60))
			.concat(String.fromCharCode(47))
			.concat(customNodeClosing)
			.concat(String.fromCharCode(62));

	} else {
		return String.fromCharCode(60)
			.concat('?xml version="1.0"?')
			.concat(String.fromCharCode(62))
			.concat(window['xsd2html2xml']["<<REPLACE>>"].getXML(root, false, namespaceString.trim()));
	}


};

window['xsd2html2xml']["<<REPLACE>>"].getXML = function (parent, attributesOnly, namespaceString) {

	var xml = "";
	var children = [].slice.call(parent.children);

	children.forEach(function (o) {

		/* CHANGE JK: If the element is a custom created one, take the first child node */
		if ( o.hasAttribute('data-created') ) {
			var oChildren = [].slice.call(o.children);

			if ( oChildren.length > 0 ) {
				o = oChildren[0];
			}
		}

		/* CHANGE JK: Also filter out objects that have a parent with the attribute 'dependency-hidden' */
		if (!o.hasAttribute("hidden") && !o.closest('[dependency-hidden]') ) {
			switch (o.getAttribute("data-xsd2html2xml-type")) {
				case "element":
					if (!attributesOnly) {
						xml = xml
							.concat(String.fromCharCode(60))
							.concat(o.getAttribute("data-xsd2html2xml-name"))
							.concat(window['xsd2html2xml']["<<REPLACE>>"].getXML(o, true));

							// CHANGES JK: We need to keep the original value and save it to the node as an attribute
							if ( o.querySelector(':scope > .autocomplete-wrapper > input[data-pre-identifier-value]') ) {
								xml = xml.concat(' ' + 'preIdentValue="' + o.querySelector(':scope > .autocomplete-wrapper > input[data-pre-identifier-value]').getAttribute('data-pre-identifier-value') + '"');
							}

							if ( o.querySelector(':scope > input[data-pre-identifier-value]') ) {
								xml = xml.concat(' ' + 'preIdentValue="' + o.querySelector(':scope > input[data-pre-identifier-value]').getAttribute('data-pre-identifier-value') + '"');
							}

						xml = xml
							.concat(String.fromCharCode(62))
							.concat(
								(function () {
									if (o.nodeName.toLowerCase() === "label") {
										return window['xsd2html2xml']["<<REPLACE>>"].getContent(o);
									} else {
										return window['xsd2html2xml']["<<REPLACE>>"].getXML(o);
									}
								})()
							)
							.concat(String.fromCharCode(60))
							.concat("/")
							.concat(o.getAttribute("data-xsd2html2xml-name"))
							.concat(String.fromCharCode(62));
					}
					break;
				case "attribute":
					if (attributesOnly) {

						if (
							window['xsd2html2xml']["<<REPLACE>>"].getContent(o) ||
							(o.getElementsByTagName("input").length > 0
								? o
										.getElementsByTagName("input")[0]
										.getAttribute(
											"data-xsd2html2xml-primitive"
										)
										.toLowerCase() === "boolean"
								: false)
						) {
							xml = xml
								.concat(" ")
								.concat(
									o.getAttribute("data-xsd2html2xml-name")
								)
								.concat('="')
								.concat(window['xsd2html2xml']["<<REPLACE>>"].getContent(o))
								.concat('"');
						}
					}

					break;
				case "content":
					if (!attributesOnly) xml = xml.concat(window['xsd2html2xml']["<<REPLACE>>"].getContent(o));
					break;
				default:
					if (!attributesOnly) {
						if (!o.getAttribute("data-xsd2html2xml-choice")) {
							xml = xml.concat(window['xsd2html2xml']["<<REPLACE>>"].getXML(o));
						}

						if (o.getAttribute("data-xsd2html2xml-choice")) {
							var node = o.previousElementSibling;
							while (
								node.hasAttribute("data-xsd2html2xml-choice")
							) {
								node = node.previousElementSibling;
							}

							if (node.getElementsByTagName("input")[0].checked)
								xml = xml.concat(window['xsd2html2xml']["<<REPLACE>>"].getXML(o));
						}
					}

					break;
			}
		}
	});

	if (namespaceString) {
		xml = xml
			.substring(0, xml.indexOf(String.fromCharCode(62)))
			.concat(" ")
			.concat(namespaceString)
			.concat(xml.substring(xml.indexOf(String.fromCharCode(62))));
	}

	return xml;
};

window['xsd2html2xml']["<<REPLACE>>"].getContent = function (node) {

	if (node.getElementsByTagName("input").length != 0) {
		switch (
			node
				.getElementsByTagName("input")[0]
				.getAttribute("type")
				.toLowerCase()
		) {
			case "checkbox":
				return node.getElementsByTagName("input")[0].checked;
			case "file":
			case "range":
			case "date":
			case "time":
			case "datetime-local":
				return node
					.getElementsByTagName("input")[0]
					.getAttribute("value");
			default:
				switch (
					node
						.getElementsByTagName("input")[0]
						.getAttribute("data-xsd2html2xml-primitive")
						.toLowerCase()
				) {
					case "gday":
					case "gmonth":
					case "gmonthday":
					case "gyear":
					case "gyearmonth":
						return node
							.getElementsByTagName("input")[0]
							.getAttribute("value");
					default:
						return node.getElementsByTagName("input")[0].value;
				}
		}
	} else if (node.getElementsByTagName("select").length != 0) {
		if (node.getElementsByTagName("select")[0].hasAttribute("multiple")) {
			return [].map
				.call(
					node.getElementsByTagName("select")[0].selectedOptions,
					function (o) {
						return o.getAttribute("value");
					}
				)
				.join(" ");
		} else if (
			node
				.getElementsByTagName("select")[0]
				.getElementsByTagName("option")
				[
					node.getElementsByTagName("select")[0].selectedIndex
				]
				&&
				node
				.getElementsByTagName("select")[0]
				.getElementsByTagName("option")
				[
					node.getElementsByTagName("select")[0].selectedIndex
				].hasAttribute("value")
		) {
			return node.getElementsByTagName("select")[0].value;
		} else {
			return null;
		}
	} else if (node.getElementsByTagName("textarea").length != 0) {
		return node.getElementsByTagName("textarea")[0].value;
	}
};

window['xsd2html2xml']["<<REPLACE>>"].globalValuesMap = [];

window['xsd2html2xml']["<<REPLACE>>"].eventListenerLoad = function() {

	window['xsd2html2xml']["<<REPLACE>>"]['selector'] = document.querySelector(window.TABCONTENT_SELECTOR_STRING + ' span[data-schema-file="<<REPLACE_FULL>>"').closest(TABCONTENT_SELECTOR_STRING);

	/* INITIAL CALLS */
	window['xsd2html2xml']["<<REPLACE>>"].addHiddenFields();
	window['xsd2html2xml']["<<REPLACE>>"].xmlToHTML(window['xsd2html2xml']["<<REPLACE>>"]['selector']);
	window['xsd2html2xml']["<<REPLACE>>"].updateIdentifiers();
	window['xsd2html2xml']["<<REPLACE>>"].setDynamicValues();
	window['xsd2html2xml']["<<REPLACE>>"].setValues();
	window['xsd2html2xml']["<<REPLACE>>"].ensureMinimum();

	window['xsd2html2xml']["<<REPLACE>>"]['selector']
		.querySelectorAll("[data-xsd2html2xml-filled='true']")
		.forEach(function (o) {
			if (o.closest("[data-xsd2html2xml-choice]")) {
				var node = o.closest(
					"[data-xsd2html2xml-choice]"
				).previousElementSibling;
				while (node) {
					if (!node.hasAttribute("data-xsd2html2xml-choice")) {
						node.querySelector("input[type='radio']").click();
						break;
					} else {
						node = node.previousElementSibling;
					}
				}
			}
		});

	window.removeEventListener('load<<REPLACE>>', window['xsd2html2xml']["<<REPLACE>>"].eventListenerLoad);
};
window.addEventListener("load<<REPLACE>>", window['xsd2html2xml']["<<REPLACE>>"].eventListenerLoad);
})();
