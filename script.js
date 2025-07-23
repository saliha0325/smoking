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
      value: "#ff0000",
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
          src:
            "https://static.wixstatic.com/media/42e808_a53589c4658c4f31971df4befc8b118d~mv2.png",
          width: 256,
          height: 256
        }
      }
    },
    opacity: {
      value: 1,
      random: false,
      animation: {
        enable: true,
        speed: 0.5,
        minimumValue: 0,
        sync: false
      }
    },
    size: {
      value: 64,
      random: { enable: true, minimumValue: 32 },
      animation: {
        enable: false,
        speed: 20,
        minimumValue: 0.1,
        sync: false
      }
    },
    links: {
      enable: false,
      distance: 100,
      color: "#ffffff",
      opacity: 0.4,
      width: 1
    },
    life: {
      duration: {
        value: 20
      },
      count: 1
    },
    move: {
      enable: true,
      gravity: {
        enable: true,
        acceleration: -0.5
      },
      speed: 3,
      direction: "top",
      random: false,
      straight: false,
      outModes: {
        default: "destroy",
        bottom: "none"
      },
      attract: {
        enable: true,
        distance: 300,
        rotate: {
          x: 600,
          y: 1200
        }
      }
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
    color: "transparent"
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
