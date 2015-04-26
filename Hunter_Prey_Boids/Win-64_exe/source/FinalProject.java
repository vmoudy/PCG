import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class FinalProject extends PApplet {

Flock flock;

int babiesBorn = 0;
int preyEaten = 0;

class Flock{
  ArrayList<PreyBoids> boids;
  ArrayList<Hunter> hunter;
  Flock(){
    boids = new ArrayList<PreyBoids>();
    hunter = new ArrayList<Hunter>();    
  }  
  
  public void run(){
    for(int i = 0; i < boids.size(); i++){
      PreyBoids boid = boids.get(i);
      boid.run(hunter, boids);
    }
    Hunter h = hunter.get(0);
    h.run(hunter, boids);
  }
  
  public void addBoid(PreyBoids pb){
    boids.add(pb); 
  }
  
  public void addHunter(Hunter h){
    hunter.add(h);
  }
  
  /**TODO: this determines if the two classes are close
   * Now just have to when a hunter is close, to follow that boid 
   * and "eat" it. Will call remove method from ArrayList. 
   * also need to implement two boids spawning another if they
   * last lonf enough. Right now it does find when the two are
   * within a range a draws an ellipse for de-bugging perposes.  
  **/
  public void check(){
    float howClose = 15.0f;
    Hunter h = hunter.get(0);
    for(int i = 0; i < boids.size(); i++){
      PreyBoids b = boids.get(i);
      float d = PVector.dist(b.loc, h.loc);
      if((d > 0) && (d < howClose)){
        b.checkIfEaten(h, boids);
      }
    }
  }
  
}

public void setup(){
  size(640, 480);
  flock = new Flock();
  for(int i = 0; i < 2; i++){
    flock.addBoid(new PreyBoids(width/2, height/2));
  } 
  flock.addHunter(new Hunter(width/4, height/4));
}

public void draw(){
  background(255);
  flock.run();
}

public void mousePressed(){
  if(mouseButton == LEFT){
    flock.addBoid(new PreyBoids(mouseX, mouseY));
  }
}

//hunter boids
class Hunter{
  PVector loc;
  PVector vel;
  PVector accel;
  float[] dna = new float[4];
  PFont font = loadFont("LucidaSans-Typewriter-12.vlw");
  
  Hunter(float x, float y){
    accel = new PVector(0, 0);
    float angle = random(TWO_PI);
    vel = new PVector(cos(angle), sin(angle));
    loc = new PVector(x, y);
    //boid size
    dna[0] = 3;
    
    //maxForce
    dna[1] = 0.1f;
    
    //maxSpeed
    dna[2] = 3;
    //time
  }
   public void run(ArrayList<Hunter> h, ArrayList<PreyBoids> pb){
    update();
    borders();
    render();
    checkSpeed();
    preyFlock(pb);
    flock.check();
  }
  
  public void checkSpeed(){
    if(this.dna[2] < 1.5f){
      this.dna[2] = 2;
    }
  }
  
  public void applyForces(PVector s, PVector a, PVector c){
    accel.add(s);
    accel.add(a);
    accel.add(c);
  }
    
  public void preyFlock(ArrayList<PreyBoids> pb){
    PVector separate = separate(pb);
    PVector align = align(pb);
    PVector cohesion = cohesion(pb);
  
   /* separate.mult(2.0);
    align.mult(1.0);
    cohesion.mult(2.0);*/
    
    applyForces(separate, align, cohesion);
  }
  
  public void update(){
    vel.add(accel);
    vel.limit(dna[2]);
    loc.add(vel);
    accel.mult(0);
    textFont(font, 12);
    fill(255, 0, 0);
    text("Om noms - " + str(preyEaten), 550, 15);
    
  }
  
  public PVector find(PVector target){
    PVector direction = PVector.sub(target, loc);
    direction.normalize();
    direction.mult(dna[2]);
    
    PVector find = PVector.sub(direction, vel);
    find.limit(dna[1]);
    return find;
  }

  public void render(){
    float theta = vel.heading2D() + radians(90);
    
    fill(255, 0, 0);
    stroke(0, 0, 0);
    pushMatrix();
    translate(loc.x, loc.y);
    rotate(theta);
    beginShape(TRIANGLES);
    vertex(0, -dna[0]*2);
    vertex(-dna[0], dna[0]*2);
    vertex(dna[0], dna[0]*2);
    endShape();
    popMatrix();
  }
  
  //if boids go off screen, the appear again on the opposite side
  public void borders(){
    if(loc.x < -dna[0]){
      loc.x = width + dna[0];
    }
    if(loc.y < -dna[0]){
      loc.y = height + dna[0];
    }
    if(loc.x > width + dna[0]){
      loc.x = -dna[0];
    }
    if(loc.y > height + dna[0]){
      loc.y = -dna[0];
    }
  }
  
  // here are the main forces at play
  public PVector separate(ArrayList<PreyBoids> pb){
    float distance = 5.0f;
    PVector steer = new PVector(0, 0, 0);
    int count = 0;
    
    for(int i = 0; i < pb.size(); i++){
      PreyBoids neighbor = pb.get(i);
      float d = PVector.dist(this.loc, neighbor.loc);
      if((d > 0) && (d < distance)){
        PVector diff = PVector.sub(this.loc, neighbor.loc);
        diff.normalize();
        diff.div(d);
        steer.add(diff);
        count++;
      }
    }
    if(count > 0){
      steer.div((float)count);
    }
    
    if(steer.mag() > 0){
      steer.normalize();
      steer.mult(dna[2]);
      steer.sub(vel);
      steer.limit(dna[1]);
    }
    return steer;
  }
  
  public PVector align(ArrayList<PreyBoids> pb){
    float neighbor = 75;
    PVector sum = new PVector(0, 0);
    int count = 0;
    for(int i = 0; i < pb.size(); i++){
      PreyBoids other = pb.get(i);
      float d = PVector.dist(this.loc, other.loc);
      if((d > 0) && (d < neighbor)){
        sum.add(other.vel);
        count++;
      }
    }
    if(count > 0){
      sum.div((float)count);
      sum.normalize();
      sum.mult(dna[2]);
      PVector steer = PVector.sub(sum, vel);
      steer.limit(dna[1]);
      return steer;
    }
    return new PVector(0, 0);
  }
  
  public PVector cohesion(ArrayList<PreyBoids> pb){
    float neighbor = 75;
    PVector sum = new PVector (0, 0);
    int count = 0;
    
    for(int i = 0; i < pb.size(); i++){
      PreyBoids other = pb.get(i);
      float d = PVector.dist(this.loc, other.loc);
      if((d > 0) && (d < neighbor)){
        sum.add(other.loc);
        count++;
      }
    }
    if(count > 0){
      sum.div(count);
      return find(sum);
    }
    return new PVector(0, 0);
  }
}

//prey boids
class PreyBoids{
  PVector loc;
  PVector vel;
  PVector accel;
  float[] dna = new float[4];
  boolean spawned = false;
  int babies = 0;
  PFont font = loadFont("LucidaSans-Typewriter-12.vlw");
  int eaten = 0;
  
  PreyBoids(float x, float y){
    accel = new PVector(0, 0);
    
    float angle = random(TWO_PI);
    vel = new PVector(cos(angle), sin(angle));
    
    loc = new PVector(x, y);
    //boid size/age
    dna[0] = 1;
    
    //maxForce
    dna[1] = 0.05f;
    
    //maxSpeed they all start fast, then slow with age
    dna[2] = 2;
    
    //time alive
    dna[3] = 1;
  }
  
  public void run(ArrayList<Hunter> hunter, ArrayList<PreyBoids> pb){
    flock(hunter, pb);
    checkLife(pb);
    update(pb);
    borders();
    render();
  }
  //remove if eaten
  public void checkIfEaten(Hunter h, ArrayList<PreyBoids> pb){
    float dist = 5f;
    
    for(int i = 0; i < pb.size(); i++){
      PreyBoids prey = pb.get(i);
      float d = PVector.dist(prey.loc, h.loc);
      if((d > 0) && (d < dist)){
        pb.remove(i);
        preyEaten++;
      }
    }
  }
  //remove if old
  public void checkLife(ArrayList<PreyBoids> pb){
    if(this.dna[3] % 1000 == 0){
      this.dna[0]++;
      this.dna[1] -= 0.005f;
      this.dna[2] -= 0.2f;
    }
    for(int i = 0; i < pb.size(); i++){
      PreyBoids boid = pb.get(i);
      if(boid == this && dna[0] > 6){
        pb.remove(i);
      }
    }
    checkForBabies(pb);
  }
  //spawn new babies, boid must be size/age 3, hasnt already produce more then 2, 
  public void checkForBabies(ArrayList<PreyBoids> pb){
    float distance = 25f;
    for(int i = 0; i < pb.size(); i++){
      PreyBoids neighbor = pb.get(i);
      float d = PVector.dist(loc, neighbor.loc);
      if((d > 0) && (d < distance) && this.dna[0] >= 3){
        if(this.dna[0] == neighbor.dna[0] && (!this.spawned && !neighbor.spawned)){
          this.babies++;
          neighbor.babies++;
          babiesBorn++;
          if(this.babies == 3){
            this.spawned = true;
          }
          if(neighbor.babies == 3){
            neighbor.spawned = true;
          }
          flock.addBoid(new PreyBoids(this.loc.x, this.loc.y));
        }
      }
    }
  }
  
  public void applyForces(PVector s, PVector a, PVector c){
    accel.add(s);
    accel.add(a);
    accel.add(c);
  }
  
  public void flock(ArrayList<Hunter> hunter, ArrayList<PreyBoids> pb){
    PVector separate = separate(pb);
    PVector align = align(hunter, pb);
    PVector cohesion = cohesion(pb);
    
    separate.mult(2.0f);
    align.mult(2.0f);
    cohesion.mult(1.0f);
   
    applyForces(separate, align, cohesion);
  }
  
  public void update(ArrayList<PreyBoids> pb){
    vel.add(accel);
    vel.limit(dna[2]);
    loc.add(vel);
    accel.mult(0);
    dna[3]++;
    textFont(font, 12);
    fill(0, 0, 255);
    text("Prey - " + str(pb.size()), 10, 15);
    text("Babies born - " + str(babiesBorn), 10, 30);
 
  }
  
  public PVector find(PVector target){
    PVector direction = PVector.sub(target, loc);
    direction.normalize();
    direction.mult(dna[2]);
    
    PVector find = PVector.sub(direction, vel);
    find.limit(dna[1]);
    return find;
  }

  public void render(){
    float theta = vel.heading2D() + radians(90);
    fill(0, 0, 255);
    stroke(0, 0, 0);
    pushMatrix();
    translate(loc.x, loc.y);
    rotate(theta);
    beginShape(TRIANGLES);
    vertex(0, -dna[0]*2);
    vertex(-dna[0], dna[0]*2);
    vertex(dna[0], dna[0]*2);
    endShape();
    popMatrix();
  }
  
  //if boids go off screen, they appear again on the opposite side
  public void borders(){
    if(loc.x < -dna[0]){
      loc.x = width + dna[0];
    }
    if(loc.y < -dna[0]){
      loc.y = height + dna[0];
    }
    if(loc.x > width + dna[0]){
      loc.x = -dna[0];
    }
    if(loc.y > height + dna[0]){
      loc.y = -dna[0];
    }
  }
  
  // here are the main forces at play
  public PVector separate(ArrayList<PreyBoids> pb){
    float distance = 25.0f;
    PVector steer = new PVector(0, 0, 0);
    int count = 0;
    
    for(PreyBoids neighbor : pb){
      float d = PVector.dist(loc, neighbor.loc);
      if((d > 0) && (d < distance)){
        PVector diff = PVector.sub(loc, neighbor.loc);
        diff.normalize();
        diff.div(d);
        steer.add(diff);
        count++;
      }
    }
    if(count > 0){
      steer.div((float)count);
    }
    
    if(steer.mag() > 0){
      steer.normalize();
      steer.mult(dna[2]);
      steer.sub(vel);
      steer.limit(dna[1]);
    }
    return steer;
  }
  
  public PVector align(ArrayList<Hunter> hunter, ArrayList<PreyBoids> pb){
    float neighbor = 50;
    
    PVector sum = new PVector(0, 0);
    int count = 0;
    boolean hunterNearby = false;
    Hunter h = hunter.get(0);    
    float howClose = 35.0f;
    
    for(PreyBoids other : pb){
      float d = PVector.dist(loc, other.loc);
      if((d > 0) && (d < neighbor)){
        sum.add(other.vel);
        count++;
      }
    }
    
    float d = PVector.dist(loc, h.loc);
    if((d > 0) && (d < howClose)){
      hunterNearby = true;
    }
    if(count > 0 && !hunterNearby){
      sum.div((float)count);
      sum.normalize();
      sum.mult(dna[2]);
      PVector steer = PVector.sub(sum, vel);
      steer.limit(dna[1]);
      return steer;
    }else if(count >= 0 && hunterNearby){
      sum.add(h.vel);
      count++;
      sum.mult(dna[2] * dna[2]);
      PVector dis = PVector.sub(h.loc, loc);
 
      PVector steer = PVector.sub(sum, dis);
      return steer;
    }
    return new PVector(0, 0);
  }
  
  public PVector cohesion(ArrayList<PreyBoids> pb){
    float neighbor = 50;
    PVector sum = new PVector (0, 0);
    int count = 0;
    
    for(PreyBoids other : pb){
      float d = PVector.dist(loc, other.loc);
      if((d > 0) && (d < neighbor)){
        sum.add(other.loc);
        count++;
      }
    }
    if(count > 0){
      sum.div(count);
      return find(sum);
    }
    return new PVector(0, 0);
  }
  
}
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "FinalProject" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
