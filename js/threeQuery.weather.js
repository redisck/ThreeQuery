$$.Weather = {
	Snow: function(options, texture) {
		options = $$.extends({}, [{
			startSpeed: 2,
			endSpeed: 10,
			duration: 50,
			amount: 2000,
			startAmount: 500,
			fallSpeed: 2,
			scale: [10, 20],
			wind: {
				x: 0,
				y: 0,
				z: 0
			},
			area: {
				x: [-2000, 2000],
				y: [-2000, 2000],
				z: [-2000, 2000],
			},
			swing: {
				x: 2,
				y: 0,
				z: 2
			}
		}, options]);
		this.amount = options.amount;
		this.startAmount = options.startAmount;
		this.fallSpeed = options.fallSpeed;
		this.scale = options.scale;
		this.wind = options.wind;
		this.swing = options.swing;
		this.startSpeed = options.startSpeed;
		this.endSpeed = options.endSpeed;
		this.duration = options.duration;
		this.particles = [];
		this.material = new THREE.SpriteMaterial({
			map: texture,
			color: 0xffffff
		});
		this.onStartEnd = function() {
			console.log("snow start end");
		};
		this.onEndEnd = function() {
			console.log("snow end end");
		};
		this.area = options.area;

		function randomRange(min, max) {
			return((Math.random() * (max - min)) + min);
		}

		function rndInt(n) {
			return Math.floor(Math.random() * n);
		}

		for(i = 0; i < this.startAmount; i++) {
			var particle = new THREE.Sprite(this.material);
			var randomScale = randomRange(this.scale[0], this.scale[1]);
			particle.position.x = randomRange(this.area.x[0], this.area.x[1]);
			particle.position.y = randomRange(this.area.y[0], this.area.y[1]);
			particle.position.z = randomRange(this.area.z[0], this.area.z[1]);
			particle.scale.x = particle.scale.y = particle.scale.z = randomScale;
			particle.v = new THREE.Vector3(0, this.wind.y - this.fallSpeed + randomRange(-this.swing.y, this.swing.y), 0);
			particle.v.z = (this.wind.z + randomRange(-this.swing.z, this.swing.z));
			particle.v.x = (this.wind.x + randomRange(-this.swing.x, this.swing.x));

			this.particles.push(particle);
			$$.global.scene.add(particle);
		}

		this.start = function() {
			var timer = new $$.Component.Timer({
				life: (this.amount - this.startAmount) / this.startSpeed * this.duration,
				duration: this.duration,
				onRepeat: function() {
					for(var i = 0; i < this.owner.startSpeed; i++) {
						if(this.owner.particles.length >= this.owner.amount) {
							break;
						}
						var particle = new THREE.Sprite(this.owner.material);
						var randomScale = randomRange(this.owner.scale[0], this.owner.scale[1]);
						particle.position.x = randomRange(this.owner.area.x[0], this.owner.area.x[1]);
						particle.position.y = this.owner.area.y[1];
						particle.position.z = randomRange(this.owner.area.z[0], this.owner.area.z[1]);
						particle.scale.x = particle.scale.y = particle.scale.z = randomScale;
						particle.v = new THREE.Vector3(0, this.owner.wind.y - this.owner.fallSpeed + randomRange(-this.owner.swing.y, this.owner.swing.y), 0);
						particle.v.z = (this.owner.wind.z + randomRange(-this.owner.swing.z, this.owner.swing.z));
						particle.v.x = (this.owner.wind.x + randomRange(-this.owner.swing.x, this.owner.swing.x));

						this.owner.particles.push(particle);
						$$.global.scene.add(particle);
					}
				},
				onEnd: this.onStartEnd
			});
			timer.owner = this;
			timer.start();
			$$.actionInjections.push(this.update);
		};

		this.end = function() {
			var timer = new $$.Component.Timer({
				life: (this.amount / this.endSpeed + 1) * this.duration,
				duration: this.duration,
				onRepeat: function() {
					for(var i = 0; i < this.owner.endSpeed; i++) {
						if(this.owner.particles.length > 0) {
							var id = rndInt(this.owner.particles.length);
							$$.global.scene.remove(this.owner.particles[id]);
							this.owner.particles.splice(id, 1);
						} else {
							break;
						}
					}
				},
				onEnd: function() {
					while(this.owner.particles.length) {
						var id = rndInt(this.owner.particles.length);
						$$.global.scene.remove(this.owner.particles[id]);
						this.owner.particles.splice(id, 1);
					}
					onEnd: this.owner.onEndEnd;
				}
			});
			timer.owner = this;
			timer.start();
			$$.actionInjections.push(this.update);
		};

		this.update = function() {
			var owner = arguments.callee.owner;
			for(var i = 0; i < owner.particles.length; i++) {
				var particle = owner.particles[i];
				var pp = particle.position;

				pp.add(particle.v);

				if(pp.y < owner.area.y[0]) pp.y = owner.area.y[1];
				if(pp.x > owner.area.x[1]) pp.x = owner.area.x[0];
				else if(pp.x < owner.area.x[0]) pp.x = owner.area.x[1];
				if(pp.z > owner.area.z[1]) pp.z = owner.area.z[0];
				else if(pp.z < owner.area.z[0]) pp.z = owner.area.z[1];
			}
		};
		this.update.owner = this;
	}
};