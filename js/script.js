/* Presentation */
var Presentation = ( () =>{
    'use strict';

    var canvas,
      ctx,
      slides = [],
      startDragging = false,
      isDragging = false,
      startX = 0,
      startY = 0,
      startSlide,
      endSlide,
      startSlice,
      endSlice,
      slideIndex = 0,
      radius = 35,
      radius2 = 15,
      mouse = { x:0, y:0};

    // Circle Object
    function Circle(x, y) {
      var startAngle,
          endAngle,
          i;

      this.x = x;
      this.y = y;
      this.isDragging = false;
      this.isActive = false;
      this.slice = {};
      this.slices = [
        { angle: 225, isHover: false, isDisabled: false },
        { angle: 315, isHover: false, isDisabled: false },
        { angle: 45, isHover: false, isDisabled: false },
        { angle: 135, isHover: false, isDisabled: false }
      ];/*<=  before this was a ',' */
      this.buttons = [
        { text: 'X' },
        { text: 'E' }
      ];

      this.draw = () => {
        if (this.isActive) {
          for (i = 0; i < this.slices.length; i++) {
            startAngle = _toRadians(this.slices[i].angle);
            endAngle = _toRadians(this.slices[i].angle + 90);

            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x, this.y);
            ctx.arc(this.x, this.y, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = this.slices[i].isDisabled ? "#FFF" : this.slices[i].isHover ? "salmon" : "#FFF";
            ctx.lineWidth = 2;
            ctx.strokeStyle= 'salmon';
            ctx.stroke();
            ctx.fill();

            // Draw text
            ctx.font = '18px arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = this.slices[i].isDisabled ? "#afafaf" : this.slices[i].isHover ? "#FFF" : "salmon";

            _setTextPosition(i, this.x, this.y);
          }

          if (this.isDragging) {
            startAngle = _toRadians(this.slice.angle);
            endAngle = _toRadians(this.slice.angle + 90);

            ctx.beginPath();
            ctx.moveTo(this.slice.x, this.slice.y);
            ctx.lineTo(this.slice.x, this.slice.y);
            ctx.moveTo(this.slice.x, this.slice.y);
            ctx.arc(this.slice.x, this.slice.y, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = "#FFF";
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fill();

            // Draw text
            ctx.font = '18px arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#afafaf';

            _setTextPosition(this.slice.id, this.slice.x, this.slice.y);
          }

          if (!isDragging) {
            // Draw buttons
            for (i = 0; i < this.buttons.length; i++) {
              startAngle = _toRadians(0);
              endAngle = _toRadians(360);

              this.buttons[i].x = this.buttons[i].text === 'X' ? (this.x - (radius + 30)) : (this.x + (radius + 30));
              this.buttons[i].y = this.y;

              ctx.beginPath();
              ctx.arc(this.buttons[i].x, this.buttons[i].y, radius2, startAngle, endAngle);
              ctx.closePath();
              ctx.fillStyle = "#FFF";
              ctx.lineWidth = 1;
              ctx.fill();
              ctx.stroke();

              // Draw text
              ctx.font = '18px arial';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = 'salmon';

              ctx.fillText(this.buttons[i].text, this.buttons[i].x, this.buttons[i].y);
            }
          }
        } else {
          startAngle = _toRadians(0);
          endAngle = _toRadians(360);

          // Main circle
          ctx.beginPath();
          ctx.arc(this.x, this.y, radius, startAngle, endAngle);
          ctx.closePath();
          ctx.fillStyle = "#FFF";
          ctx.lineWidth = 2;
          ctx.fill();
          ctx.strokeStyle = 'salmon';
          ctx.stroke();
        }
      };
    }

    // Connector Object
    function Connector(slideId, relationId, from, to) {
      this.slideId = slideId;
      this.relationId = relationId;
      this.from = from;
      this.to = to;
      this.isActive = false;

      this.draw = () => {
        var pos1 =_setLinePosition(this.slideId, this.from),
            pos2 =_setLinePosition(this.relationId, this.to);

        ctx.beginPath();
        ctx.moveTo(pos1.x, pos1.y);
        ctx.lineTo(pos2.x, pos2.y);
        ctx.closePath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'salmon';
        ctx.stroke();
      };
    }

    // Get distance between 2 points
    var _getDistance = (a, b) =>{
      return Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2));
    }

    // Convert a number to radiants
    var _toRadians = (deg) =>{
      return deg * Math.PI / 180;
    }

    // Return slide index
    var _getSlideId = (id) =>{
      var i;

      for (i = 0; i < slides.length; i++) {
        if (slides[i].id === id) {
          return i;
        }
      }
    }

    // Return slide index
    var _getSlideById = (id) =>{
      var i;

      for (i = 0; i < slides.length; i++) {
        if (slides[i].id === id) {
          return slides[i];
        }
      }
    }

    // Get active circle
    var _getActiveSlide = () =>{
      var i;

      for (i = 0; i < slides.length; i++) {
        if (slides[i].circle.isActive) {
          return { slide: slides[i], circle: slides[i].circle };
        }
      }
    }

    // Set position for text
    var _setTextPosition = (sliceId, x, y) =>{
      switch (sliceId) {
        case 0:
          ctx.fillText(1, x, y - (radius - 15));
          break;
        case 1:
          ctx.fillText(2, x + (radius - 15), y);
          break;
        case 2:
          ctx.fillText(3, x, y + (radius - 15));
          break;
        case 3:
          ctx.fillText(4, x - (radius - 15), y);
          break;
      }
    }

    // Set position for lines
    var _setLinePosition = (slideId, sliceId) =>{
      var slide = _getSlideById(slideId),
          x = slide.circle.x,
          y = slide.circle.y;

      switch (sliceId) {
        case 0:
          y -= radius;
          break;
        case 1:
          x += radius;
          break;
        case 2:
          y += radius;
          break;
        case 3:
          x -= radius;
          break;
      }

      return { x: x , y: y };
    }

    // Tell the browser we're handling this event
    var _initEvent = (e) =>{
      e.preventDefault();
      e.stopPropagation();

      mouse.x = e.layerX;
      mouse.y = e.layerY;
    }

    // Verify if mouse is over a circle
    var _isCircle = (circle, mouse, radius) =>{
      return (_getDistance(circle, mouse) <= radius);
    }

    // Check if mouse is over a slice
    var _isSlice = (circle, mouse, slice) =>{
      var ang = Math.atan2((mouse.y - circle.y), (mouse.x - circle.x));
        ang = ang < 0 ? 2 * Math.PI + ang : ang;

      return (ang >= _toRadians(slice.angle) && ang <= _toRadians(slice.angle + 90));
    }

    // Draw circles
    var _drawCircles = () =>{
      var i;

      for (i = 0; i < slides.length; i++) {
        slides[i].circle.draw();
      }
    }

    // Draw connectors
    var _drawConectores = () =>{
      var i,
        j;

      for (i = 0; i < slides.length; i++) {
        for (j = 0; j < slides[i].connectors.length; j++) {
          slides[i].connectors[j].draw();
        }
      }
    }

    // Clear the canvas
    var _clearCanvas = () =>{
      ctx.clearRect(0, 0, canvas.width, canvas.width);
      ctx.fillStyle = "#FFF";
      ctx.fillRect(0, 0, canvas.width, canvas.width);
    }

    // Draw canvas
    var _drawCanvas = () =>{

      canvas.height = window.innerHeight;
      canvas.width = window.innerWidth;

      _clearCanvas();
      _drawConectores();
      _drawCircles();
    }

    // Add a new slide
    var _newSlide = (x, y) =>{
      slides.push({
        id: slideIndex,
        circle: new Circle(x, y),
        relations: [],
        connectors: [],
        content: ''
      });

      // Increase slide id
      slideIndex++;

      // Save slides
      save();
    }

    // Remove a slide
    var _removeSlide = (activeSlide) =>{
      var id = _getSlideId(activeSlide.slide.id);

      _removeRelations(activeSlide.slide.id);
      slides.splice(id, 1);

      // Save slides
      save();
    }

    // Remove Relations
    var _removeRelations = (slideId) =>{
      var i,
          j,
          k,
          id,
          slide,
          relation,
          otherRelations,
          conector;

      for (i = 0; i < slides.length; i++) {
        slide = slides[i];

        // Remove Relations
        for (j = 0; j < slide.relations.length; j++) {
          relation = slide.relations[j];
          id = _getSlideId(relation.id),
          otherRelations = slides[id].relations;

          for (k = 0; k < otherRelations.length; k++) {
            if (otherRelations[k] && otherRelations[k].id === slideId) {
              otherRelations.splice(k, 1);
              k--;
            }
          }
        }

        // Remove Connectors
        for (j = 0; j < slide.connectors.length; j++) {
          if (slide.connectors[j]) {
            conector = slide.connectors[j];

            if (conector.slideId === slideId) {
              id = _getSlideId(conector.relationId);
              slides[id].circle.slices[conector.to].isDisabled = false;
            }

            if (conector.relationId === slideId) {
              id = _getSlideId(conector.slideId);
              slides[id].circle.slices[conector.from].isDisabled = false;
            }

            if (conector.slideId === slideId || conector.relationId === slideId) {
              slide.connectors.splice(j, 1);
              j--;
            }
          }
        }
      }
    }

    // Add a new relations
    var _newRelation = (slideIndex, relationIndex, connectorFrom, connectorTo) =>{
      var slideActive = _getSlideById(slideIndex),
          slideRelation = _getSlideById(relationIndex);

      // Relation for old slide
      slideActive.relations.push({
        placeholder: 'Relation ' + slideRelation.id,
        label: '',
        id: slideRelation.id
      });

      // Relation for new slide
      slideRelation.relations.push({
        placeholder: 'Relation ' + slideActive.id,
        label: '',
        id: slideActive.id
      });

      // Add a new connector
      slideActive.connectors.push(new Connector(slideActive.id, slideRelation.id, connectorFrom, connectorTo));

      // Disable the slice
      slideActive.circle.slices[connectorFrom].isDisabled = true;
      slideRelation.circle.slices[connectorTo].isDisabled = true;

      // Save slides
      save();
    }

    // slide activation
    var _activeCircle = (e) =>{
      var i;

      _initEvent(e);

      for (i = 0; i < slides.length; i++) {
        slides[i].circle.isActive = _isCircle(slides[i].circle, mouse, radius);
      }

      // Draw canvas
      _drawCanvas();
    }

    var _hoverSlice = (e) =>{
      var circle,
        slice,
        i,
        j;

      _initEvent(e);

      // Reset hover
      for (i = 0; i < slides.length; i++) {
        circle = slides[i].circle;
        for (j = 0; j < circle.slices.length; j++) {
          slice = circle.slices[j];
          slice.isHover = false;
        }
      }

      for (i = 0; i < slides.length; i++) {
        circle = slides[i].circle;

        if (_isCircle(circle, mouse, radius) && circle.isActive) {
          for (j = 0; j < circle.slices.length; j++) {
            slice = circle.slices[j];
            if (_isSlice(circle, mouse, slice) && !slice.isDisabled) {
              slice.isHover = true;
              break;
            }
          }
        }
      }

      // Draw canvas
      _drawCanvas();
    }

    var _clickCircle = (e) =>{
      var circle,
        slideActive,
        relationId,
        slideId,
        i;

      // _initEvent(e);

      slideActive = _getActiveSlide();

      if (slideActive && slideActive.circle) {
        circle = slideActive.circle;
        slideId = slideActive.slide.id;

        // Click on the main circle
        if (_isCircle(circle, mouse, radius)) {
          for (i = 0; i < circle.slices.length; i++) {
            if (_isSlice(circle, mouse, circle.slices[i]) && !circle.slices[i].isDisabled) {
              switch (i) {
                case 0:
                  _newSlide(circle.x, circle.y - 175);
                  relationId = slideIndex - 1;
                  _newRelation(slideId, relationId, 0, 2);
                  break;
                case 1:
                  _newSlide(circle.x + 175, circle.y);
                  relationId = slideIndex - 1;
                  _newRelation(slideId, relationId, 1, 3);
                  break;
                case 2:
                  _newSlide(circle.x, circle.y + 175);
                  relationId = slideIndex - 1;
                  _newRelation(slideId, relationId, 2, 0);
                  break;
                case 3:
                  _newSlide(circle.x - 175, circle.y);
                  relationId = slideIndex - 1;
                  _newRelation(slideId, relationId, 3, 1);
                  break;
              }

              break;
            }
          }
        } else {
          for (i = 0; i < circle.buttons.length; i++) {
            if (_isCircle(circle.buttons[i], mouse, radius2) && circle.buttons[i].text === 'E') {
              Modal.showSlide(slideActive.slide);
            } else if (_isCircle(circle.buttons[i], mouse, radius2) && circle.buttons[i].text === 'X') {
              _removeSlide(slideActive);
            }
          }
        }

        // Draw canvas
        _drawCanvas();
      }
    }

    var _startDrag = (e) =>{
      var circle,
        i,
        j;

      _initEvent(e);

      // Test each rect to see if mouse is inside
      isDragging = false;
      startSlide = null;
      endSlide = null;
      startSlice = null;
      endSlice = null;

      for (i = 0; i < slides.length; i++) {
        circle = slides[i].circle;

        if (_isCircle(circle, mouse, radius)) {
          circle = slides[i].circle;
          startSlide = slides[i].id;
          startDragging = true;
          startX = mouse.x;
          startY = mouse.y;

          if (circle.isActive) {
            for (j = 0; j < circle.slices.length; j++) {
              if (_isSlice(circle, mouse, circle.slices[j]) && !circle.slices[j].isDisabled) {
                startSlice = j;
                circle.slice = {
                  id: j,
                  x: mouse.x,
                  y: mouse.y,
                  angle: circle.slices[j].angle
                };

                break;
              }
            }
          }
        }
      }
    }

    var _moveslide = (e) =>{
      var slide,
        circle,
        circle2,
        i,
        j,
        k,
        dx,
        dy;

      _initEvent(e);

      if (startDragging && (Math.abs(mouse.x - startX) > 20 || (Math.abs(mouse.y - startY) > 20))) {

        isDragging = true;
        startDragging = false;
        slide = _getSlideById(startSlide);
        slide.circle.isDragging = true;
      }

      if (isDragging) {
        // calculate the distance the mouse has moved
        // since the last mousemove
        dx = mouse.x - startX;
        dy = mouse.y - startY;

        // move each circle that isDragging
        // by the distance the mouse has moved
        // since the last mousemove
        for (i = 0; i < slides.length; i++) {
          circle = slides[i].circle;

          if (circle.isDragging) {
            if (circle.isActive) {
              circle.slice.x += dx;
              circle.slice.y += dy;

              // Active circle for not direct relations
              for (j = 0; j < slides.length; j++) {
                circle2 = slides[j].circle;
                circle2.isActive = true;

                if (_isCircle(circle2, mouse, radius)) {
                  endSlide = slides[j].id;

                  for (k = 0; k < circle2.slices.length; k++) {
                    if (_isSlice(circle2, mouse, circle2.slices[k]) && !circle2.slices[k].isDisabled) {
                      endSlice = k;
                    }
                  }
                }
              }
            } else {
              slides[i].circle.x += dx;
              slides[i].circle.y += dy;
            }

            break;
          }
        }

        // Reset the starting mouse position for the next mousemove
        startX = mouse.x;
        startY = mouse.y;

        // Draw canvas
        _drawCanvas();
      }
    }

    var _endDrag = (e) =>{
      var slide,
        circle,
        i,
        j;

      _initEvent(e);

      // Create a not direct relation
      if (startSlide !== null && endSlide !== null && startSlide !== endSlide) {
        slide = _getSlideById(endSlide);
        circle = slide.circle;

        for (i = 0; i < circle.slices.length; i++) {
          if (_isSlice(circle, mouse, circle.slices[i]) && !circle.slices[i].isDisabled) {
            _newRelation(startSlide, endSlide, startSlice, endSlice);
            break;
          }
        }
      }

      // Clear all the dragging flags
      for (i = 0; i < slides.length; i++) {
        circle = slides[i].circle;
        circle.isDragging = false;
        circle.slice = {};

        if (isDragging && slides[i].circle.isActive) {
          circle.isActive = _getSlideId(startSlide) === i;
        }

        for (j = 0; j < circle.slices.length; j++) {
          circle.slices[j].isHover = false;
        }
      }

      isDragging = false;
      startDragging = false;
    }

    var _attachEvents = () =>{
      // Active circle
      canvas.addEventListener('dblclick', _activeCircle, false);

      // Show slice hover
      canvas.addEventListener('mousemove', _hoverSlice, false);

      // Add new slide
      canvas.addEventListener('click', _clickCircle, false);

      // Start drag the circle
      canvas.addEventListener('mousedown', _startDrag, false);

      // Move circle
      canvas.addEventListener('mousemove', _moveslide, false);

      // Drop the circle
      canvas.addEventListener('mouseup', _endDrag, false);

      // Actions
      canvas.addEventListener('onkeydown', _removeSlide, false);

      // Resize
      window.addEventListener('resize', _drawCanvas, false);
    }

    // Public methods

    // Load slides
    var load = () =>{
      var storage,
        i,
        j;

      try {
        // Verify if the item exists into Session Storage
        storage = localStorage.getItem('Presentation') ? JSON.parse(localStorage.getItem('Presentation') + '') : [];

        if (storage.length) {
          // Set circles
          for (i = 0; i < storage.length; i++) {
            _newSlide(storage[i].circle.x, storage[i].circle.y);

            // Set values for circle
            slides[i].circle.id = storage[i].circle.id;

            // Set content
            slides[i].content = storage[i].content;
          }

          // Set relations
          for (i = 0; i < storage.length; i++) {
            for (j = 0; j < storage[i].connectors.length; j++) {
              _newRelation(storage[i].connectors[j].slideId, storage[i].connectors[j].relationId, storage[i].connectors[j].from, storage[i].connectors[j].to);

              // Set labels
              slides[i].relations[j].label = storage[i].relations[j].label;
            }
          }
        } else {
          _newSlide((canvas.width / 2), (canvas.height / 2));
        }
      } catch (error) {
        _newSlide((canvas.width / 2), (canvas.height / 2));
      }
    }

    // Save slides
    var save = () =>{
      var value = JSON.stringify(window.Presentation.slides);

      localStorage.setItem('Presentation', value);
    }

    // Init Presentation
    var init = () =>{
      canvas = document.querySelector('#canvas');

      if(canvas){

        ctx = canvas.getContext('2d');
        
        // Add main circle
        load();

        _drawCanvas();

        _attachEvents();
      } 
    }

    return{
      init: init,
      load: load,
      save: save,
      slides: slides
    };
})();

  document.addEventListener('DOMContentLoaded', Presentation.init);