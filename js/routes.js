/* Routes */
var Routes = (function (){
	'use strict'

	function _intialize(elements){
		var sections = document.querySelectorAll('.sections');

		// Display sections
		function _showSection(e){
			var sectionSelected = e.currentTarget.getAttribute('data-route');

			e.preventDefault();

			sections.forEach(function (section){
				if (section.classList.contains(sectionSelected)) {
					section.classList.add('show');
				} else{
					section.classList.remove('show');
				}
			});
		}
		// Click Event
		function _attachEvents(){
			elements.forEach(function(elem){
				elem.addEventListener('click', _showSection, false);
			});
		}

		_attachEvents();
	} 

	var init = () =>{
		var routes = document.querySelectorAll('[data-route]');

		if(routes){
			_intialize(routes);
		}
	}
	return{
		init: init
	};
})();

document.addEventListener('DOMContentLoaded', Routes.init);