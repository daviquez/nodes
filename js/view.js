/* Presentation Mode */
var PresentationMode = (function(){
	var actualSlide = 0,
			btnContainer,
			infoContainer,
			slides;

	// Relation slide buttons
	var relationButtons = ()=>{
		var relations = slides[actualSlide].relations,
				buttons = '',
				label;

		for (var i = 0; i < relations.length; i++) {
			label = relations[i].label ? relations[i].label : 'Default '+ relations[i].id;
			buttons += '<button class="btn btn-slide" type="button" data-slide="'+relations[i].id+'">'+label+'</button>'
		}
		btnContainer.innerHTML = buttons;
	}

	// Slide Content
	var renderInfo = ()=>{
		infoContainer.innerHTML = slides[actualSlide].content;
	}

	var handlers = ()=>{
		// When entering in View Mode 
		document.querySelector('a[data-route="section-view"]').addEventListener('click', function(){
			// Main Slide
			actualSlide = 0;

			relationButtons();
			renderInfo();
		});
		// Click on slide buttons
		document.addEventListener('click', function(e){
			var target = e.target;
			if (target.matches('.btn-slide')) {
				actualSlide = target.getAttribute('data-slide');
				relationButtons();
				renderInfo();
			}
		});
	}

	function init(){
		actualSlide = 0;
		btnContainer = document.querySelector('.nav-buttons');
		infoContainer = document.querySelector('.display div');
		slides = window.Presentation.slides;

		handlers();
	}

	return{
		init: init
	};
})();

document.addEventListener('DOMContentLoaded', PresentationMode.init);