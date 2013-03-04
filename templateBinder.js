/* il Binder deve processare la symbolTable,
 * associando gli elementi method ai metodi del modulo "owner" del template 
 * prende la symbolTable 
 * agganciare listener al dom
 * al fire dell'evento notificare all'esterno tale evento
*/
var eventTable = {};

function hasDataMethod(element, type) {
	for (var i in element.dataset) {
		return ((i.replace(/rfMethod/, '').toLowerCase()) === type) || (i.replace(/rfMethod/, '') === ''); 
	}
}

function notifyEvent(e) {
	if (eventTable[e.type] && hasDataMethod(e.target, e.type)) {
		e.method = (e.type === "click"? 
						e.target.dataset["rfMethod"] || e.target.dataset["rfMethodClick"] : 
						e.target.getAttribute("data-rf-method-" + e.type)
				   );
		notify(e.type, e)
	}
	event.preventDefault ? event.preventDefault() : event.returnValue = false;
}
// Per un bug degli eventi del dom, non è possibile associare ad un elemento l'evento doppio click e il click. 
// Diventa allora difficile agganciare tutti gli eventi alla root del template (to do: add a workaround)
function templateBinder(root, symbolTable) {
	for(var i = 0, symbol;  symbol = symbolTable[i]; i++) {
		if (symbol.action === 'method') {
			var eventType = (/data-rf-method$/.test(symbol.attributeName)? 
								'click' : 
								symbol.attributeName.replace(/data-rf-method-/, '')
							); 
			if (!eventTable[eventType]) {
				if (root.addEventListener) {
					root.addEventListener(eventType, notifyEvent, false); 
				} else if (el.attachEvent) {
					root.attachEvent(eventType, notifyEvent);
				}
				console.log('registered:', eventType);
				eventTable[eventType] = true;
			}
		}
	}
}