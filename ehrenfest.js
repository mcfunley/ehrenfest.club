function Urn() {
  this.top = 0;
  this.left = 0;
  this.bottom = 500;
  this.right = 700;

  this.mid_x = this.right / 2;
  this.mid_y = this.bottom / 2;
  this.gap_width = 40;

  this.top_gap = this.mid_y - (this.gap_width / 2);
  this.bottom_gap = this.mid_y + (this.gap_width / 2);

  this.update = function() {
    fill(150);
    stroke(0, 0, 0);
    strokeWeight(2);
    rect(this.top, this.left, this.right, this.bottom);
    line(this.mid_x, this.top, this.mid_x, this.top_gap);
    line(this.mid_x, this.bottom, this.mid_x, this.bottom_gap);
  };

}

function random_velocity() {
  return 5 - random(10);
}

function Particle(urn) {
  var x_pos, y_pos, x_velocity, y_velocity, col;

  // initially, give it a 90% chance of being on the left.
  var min_x = urn.left,
      side = random(100);

  col = color(0, 121, 184);
  if(side > 90) {
    col = color(230, 80, 0);
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
        return;
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

  this.update = function() {
    fill(col);
    stroke(col);
    ellipse(x_pos, y_pos, 1, 1);
    deflect();
  };
}


var particles = new Array(500);
var urn = new Urn();

function setup() {
  createCanvas(700, 500);
  frameRate(15);
  for(var i = 0; i < particles.length; i++) {
    particles[i] = new Particle(urn);
  }
}


function draw() {
  background(100);
  urn.update();
  for(var i = 0; i < particles.length; i++) {
    particles[i].update();
  }
}
