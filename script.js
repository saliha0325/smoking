tsParticles.load("tsparticles", {
  fpsLimit: 60,
  particles: {
    number: {
      value: 0,
      density: {
        enable: true,
        value_area: 800
      }
    },
    color: {
      value: "#ffffff",
      animation: {
        enable: true,
        speed: 20,
        sync: true
      }
    },
    shape: {
      type: "image",
      options: {
        image: {
          src: "https://www.blog.jonnycornwell.com/wp-content/uploads/2012/07/Smoke10.png",
          width: 256,
          height: 256
        }
      }
    },
    opacity: {
      value: 1,
      animation: {
        enable: true,
        speed: 0.5,
        minimumValue: 0,
        sync: false
      }
    },
    size: {
      value: 64,
      random: { enable: true, minimumValue: 32 }
    },
    move: {
      enable: true,
      gravity: {
        enable: true,
        acceleration: -0.5
      },
      speed: 3,
      direction: "top",
      outModes: {
        default: "destroy"
      },
      attract: {
        enable: true,
        distance: 300,
        rotate: {
          x: 600,
          y: 1200
        }
      }
    },
    life: {
      duration: {
        value: 20
      },
      count: 1
    }
  },
  interactivity: {
    detectsOn: "canvas",
    events: {
      resize: true
    }
  },
  detectRetina: true,
  background: {
    color: "#000000"
  },
  emitters: {
    direction: "top",
    rate: {
      quantity: 50,
      delay: 0.05
    },
    size: {
      width: 100,
      height: 10
    },
    position: {
      x: 50,
      y: 110
    }
  }
});
