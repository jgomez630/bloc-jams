/*landing js animatePoints refactored*/
var pointsArray = document.getElementsByClassName('point');

var revealPoint = function(point) {
     point.style.opacity = 1;
     point.style.transform = "scaleX(1) translateY(0)";
     point.style.msTransform = "scaleX(1) translateY(0)";
     point.style.WebkitTransform = "scaleX(1) translateY(0)";
  };

var animatePoints = function(points) {
 forEach(points,revealPoint);
 };
//trigger animation on scrolls at least 200 pixels
window.onload = function(){
  var sellingPoints = document.getElementsByClassName('selling-points')[0];
  var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;
  
  // animate selling-points on taller screen
  if(window.innerHeight > 950){
    animatePoints(pointsArray);  
  }  
  
 
  window.addEventListener('scroll', function(event){
    if(pointsArray[0].getBoundingClientRect().top <= 500){
      animatePoints(pointsArray);
    }
  });
}
