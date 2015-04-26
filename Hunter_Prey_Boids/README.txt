Hunter/prey boids i wrote in Processing. Some code i borrowed to get a simple flock 
are listed here: 
https://processing.org/examples/flocking.html
http://processingjs.org/learning/topic/flocking/

Then i added in the hunter myself with hunter behaviors and 
gave the prey flock prey behaviors. Left click on the screen 
to add more prey. The prey also have "DNA" 
structures to it that keep track of age, size, if they can 
spawn with another boid, speed, etc. The older they are, 
they slower the become. Two boids who haven't spawned 
and are 3 cycles old, can spawn two new baby boids but 
no more after that.