/* Modal */
/* global CKEDITOR */

/**
* Controls modal general functions
* @module
*/

var Modal = (function(){
	'use strict';
	var _modal,
		_inputContent,
		_overlay,
		_currentSlideInfo,
		_editorContent;

	// Private Methods

	/**
	* Open Modal window
	* @private
	*/
	function openModal(){
		_overlay.classList.add('open');
		_modal.classList.add('open');
		_modal.setAttribute('aria-hidden', 'false');
		_modal.querySelector('h4').focus();
	}

	/**
	* Close Modal window
	* @private
	*/
	function close(){
		_overlay.classList.remove('open');
		_modal.classList.remove('open');
		_modal.setAttribute('aria-hidden', 'true');
	}

	/**
	* Create slide relations inputs
	* @param {Array} relations
	* private
	*/
	function inputRelations(relations){
		var inputs = '';

		relations.forEach(function(relation){
			inputs += '<input type="text" id="'+relation.id+'" value="'+relation.label+'" placeholder="'+relation.placeholder+'" />'
		});
		_inputContent.innerHTML = inputs;
	}

	/**
	* Bind ESC key event
	* @private
	*/
	function binkESCkeydown(){
		window.addEventListener('click', function(e){
			if (_modal.classList.contains('open')) {
				if (e.keyCode == 27) {
					close();
				}
			}
		}, false);
	}

	// Public Methods

	/**
	* Show modal
	* @param {Object} slideInfo slide info reference
	*/
	var showSlide = (slideInfo)=>{
		_currentSlideInfo = slideInfo;
		if (slideInfo && slideInfo.hasOwnProperty('relations')) {
			inputRelations(slideInfo.relations);
			_editorContent.setData(slideInfo.content);

			openModal();
		}
	}

	/**
	* Save
	*/
	var save = function(){
		_currentSlideInfo.content = _editorContent.getData();
		_currentSlideInfo.relations.forEach(function(relation){
			relation.label = _inputContent.querySelector('#rel-'+relation.id).value;
		});

		window.Presentation.save();
		this.close();
	}


	var init = ()=>{
		_modal = document.querySelector('.ws-modal');
		_inputContent = _modal.querySelector('.f-entries');
		_overlay = document.querySelector('.overlay');

		_editorContent = CKEDITOR.replace('editor',{
			cloudServices_tokenUrl: '/',
			cloudServices_uploadUrl: '/'
		});
	}
	return{
		init: init,
		showSlide: showSlide,
		close: close,
		save: save,
	};
})();
document.addEventListener('DOMContentLoaded', Modal.init);