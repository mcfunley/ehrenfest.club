var canvas;
var BLUE, RED;

function scale_value(x) {
  return x * canvas.width / 700;
}


function Urn() {
  this.top = 0;
  this.left = 0;
  this.bottom = canvas.height;
  this.right = canvas.width;

  this.mid_x = this.right / 2;
  this.mid_y = this.bottom / 2;

  var gap_width = scale_value(40);
  this.top_gap = this.mid_y - (gap_width / 2);
  this.bottom_gap = this.mid_y + (gap_width / 2);

  var self = this;

  function updateCounters(counters) {
    $('#lcounters .redcount').text(counters['left']['red']);
    $('#lcounters .bluecount').text(counters['left']['blue']);
    $('#rcounters .redcount').text(counters['right']['red']);
    $('#rcounters .bluecount').text(counters['right']['blue']);
  }

  this.update = function(counters) {
    fill(0xff, 0xff, 0xff);
    stroke(0, 0, 0);
    strokeWeight(2);
    line(this.mid_x, this.top, this.mid_x, this.top_gap);
    line(this.mid_x, this.bottom, this.mid_x, this.bottom_gap);
    updateCounters(counters);
  };

}

function random_velocity() {
  return scale_value(5 - random(10));
}

function Particle(urn, side) {
  var x_pos, y_pos, x_velocity, y_velocity, col;

  var min_x = urn.left;
  this.color = 'blue';
  col = BLUE;

  if(side == 'right') {
    this.color = 'red';
    col = RED;
    min_x = urn.mid_x;
  }

  x_pos = random(urn.mid_x) + min_x;
  y_pos = random(urn.bottom - urn.top);
  x_velocity = random_velocity();
  y_velocity = random_velocity();

  function deflect_x() {
    if(x_pos <= urn.left) {
      x_pos = urn.left;
      x_velocity = -x_velocity;
      x_pos += x_velocity;
      return;
    }
    if(x_pos >= urn.right) {
      x_pos = urn.right;
      x_velocity = -x_velocity;
      x_pos += x_velocity;
      return;
    }

    if((x_pos > urn.mid_x && x_pos + x_velocity <= urn.mid_x) ||
       (x_pos < urn.mid_x && x_pos + x_velocity >= urn.mid_x)) {

      if(y_pos < urn.top_gap || y_pos > urn.bottom_gap) {
        x_pos = urn.mid_x;
        x_velocity = -x_velocity;
      }

    }

    x_pos += x_velocity;
  }

  function deflect_y() {
    if(y_pos <= urn.top) {
      y_pos = urn.top;
      y_velocity = -y_velocity;
      y_pos += y_velocity;
      return;
    }
    if(y_pos >= urn.bottom) {
      y_pos = urn.bottom;
      y_velocity = -y_velocity;
    }
    y_pos += y_velocity;
  }

  function deflect() {
    deflect_x();
    deflect_y();
  }

  var size = scale_value(1.5);

  this.update = function() {
    fill(col);
    strokeWeight(2);
    stroke(col);
    ellipse(x_pos, y_pos, size, size);
    deflect();
  };

  this.get_side = function() {
    return (x_pos > urn.mid_x) ? 'right' : 'left';
  };
}


var R = 250;
var particles = new Array(2*R);
var urn;

function setup() {
  BLUE = color(0, 121, 184);
  RED = color(230, 80, 0);

  canvas = createCanvas(document.documentElement.offsetWidth, window.innerHeight);
  canvas.parent('anim');

  // if this caused vertical scroll (i.e. small screen) then the offsetWidth
  // changed by virtue of adding the canvas.
  resizeCanvas(document.documentElement.offsetWidth, window.innerHeight);

  urn = new Urn();

  frameRate(15);
  for(var i = 0; i < R; i++) {
    particles[i] = new Particle(urn, 'left');
  }
  for(i = R; i < 2*R; i++) {
    particles[i] = new Particle(urn, 'right');
  }
}


function draw() {
  if(!urn) {
    return;
  }

  var counters = {
    left: {
      blue: 0, red: 0
    },
    right: {
      blue: 0, red: 0
    }
  };

  background(255,255,255);
  for(var i = 0; i < particles.length; i++) {
    var p = particles[i];
    p.update();
    counters[p.get_side()][p.color] += 1;
  }

  urn.update(counters);
}

window.onresize = function() { setup(); };

/*
if($('header').css('position') == 'absolute') {
  var hide_explain = setTimeout(function() {
    $('#explain-link').fadeIn();
    $('#explanation').slideUp();
  }, 4000);
}

$('#explain-link a').click(function(e) {
  e.preventDefault();
  $('#explanation').slideDown(function() {
    $('#explain-link').slideUp(100);
  });
  return false;
});
*/
