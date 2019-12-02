
var Fork = function() {
    this.state = 0;
    return this;
}

Fork.prototype.acquire = function(cb) { 
    var state = this.state;
    var beb = function(time, icb) {
        setTimeout(function () {
            console.log(state);
            if (state == 0) {
                icb();
            }
            else {
                console.log(`Failed to acquire fork after ${time} ms`);
                beb(time * 2);
            }
        })
    }
    beb(1, function() {this.state = 1; cb()});
}

Fork.prototype.release = function() { 
    this.state = 0; 
}

var Philosopher = function(id, forks) {
    this.id = id;
    this.forks = forks;
    this.f1 = id % forks.length;
    this.f2 = (id+1) % forks.length;
    return this;
}

Philosopher.prototype.startNaive = function(count) {
    var forks = this.forks,
        f1 = this.forks[this.f1],
        f2 = this.forks[this.f2],
        id = this.id;
    
    var logFork = function(side) {console.log(`Philosopher ${this.id}: acquired ${side} fork`)}

    var thinkAndEat = function(n) {
        setTimeout(function() {
            f1.acquire(function() {
                logFork("left");
                f2.acquire(function() {
                    f2.acquire(function() {
                        logFork("right");
                        if (n > 1)
                            thinkAndEat(n - 1)
                    })
                })
            })
        }, 5)
    }

    thinkAndEat(count);
}

Philosopher.prototype.startAsym = function(count) {
    var forks = this.forks,
        f1 = this.forks[this.f1],
        f2 = this.forks[this.f2],
        id = this.id;
    
    if (this.id % 2 == 0)
        [f1, f2] = [f2, f1]

    var logFork = function(side) {console.log(`Philosopher ${id}: acquired ${side} fork`)}

    var thinkAndEat = function (n) {
        setTimeout(function() {
            f1.acquire(function() {
                logFork("left");
                f2.acquire(function() {
                    f2.acquire(logFork("right"));
                    if (n > 1)
                        thinkAndEat(n - 1)
                })
            })
        }, 5)
    }

    thinkAndEat(count);
}

Philosopher.prototype.startConductor = function(count) {
    var forks = this.forks,
        f1 = this.f1,
        f2 = this.f2,
        id = this.id;
    
    // zaimplementuj rozwiazanie z kelnerem
    // kazdy filozof powinien 'count' razy wykonywac cykl
    // podnoszenia widelcow -- jedzenia -- zwalniania widelcow
}


var N = 5;
var forks = [];
var philosophers = []
for (var i = 0; i < N; i++) {
    forks.push(new Fork());
}

for (var i = 0; i < N; i++) {
    philosophers.push(new Philosopher(i, forks));
}

for (var i = 0; i < N; i++) {
    philosophers[i].startNaive(10);
    // philosophers[i].startAsym(10);
}