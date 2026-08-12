const particleCanvas =
  document.getElementById("particles");

const heartCanvas =
  document.getElementById("heartCanvas");

const particleCtx =
  particleCanvas.getContext("2d");

const heartCtx =
  heartCanvas.getContext("2d");


let width = 0;
let height = 0;

let dpr =
  Math.min(
    window.devicePixelRatio || 1,
    2
  );

let particles = [];

let heartPoints = [];

let mouse = {
  x: 0,
  y: 0,
  active: false
};


const colors = [

  [255, 70, 150],

  [255, 120, 184],

  [255, 205, 229],

  [255, 245, 250]

];


/* CAMBIO DE TAMAÑO */

function resizeCanvas(canvas, ctx) {

  const rect =
    canvas.getBoundingClientRect();

  canvas.width =
    Math.floor(rect.width * dpr);

  canvas.height =
    Math.floor(rect.height * dpr);

  ctx.setTransform(
    dpr,
    0,
    0,
    dpr,
    0,
    0
  );
}


function resize() {

  width =
    window.innerWidth;

  height =
    window.innerHeight;

  resizeCanvas(
    particleCanvas,
    particleCtx
  );

  resizeCanvas(
    heartCanvas,
    heartCtx
  );

  createBackgroundParticles();

  createHeart();
}


window.addEventListener(
  "resize",
  resize
);


/* RANDOM */

function random(min, max) {

  return Math.random()
    * (max - min)
    + min;
}


/* PARTICULAS DEL FONDO */

function createBackgroundParticles() {

  const count =
    Math.min(
      260,
      Math.max(
        100,
        Math.floor(
          width * height / 6500
        )
      )
    );


  particles =
    Array.from(
      { length: count },
      () => ({

        x:
          random(0, width),

        y:
          random(0, height),

        r:
          random(.4, 1.8),

        speed:
          random(.05, .25),

        drift:
          random(-.18, .18),

        alpha:
          random(.18, .8),

        twinkle:
          random(
            0,
            Math.PI * 2
          ),

        color:
          colors[
            Math.floor(
              Math.random()
              * colors.length
            )
          ]

      })
    );
}


/* ECUACION DEL CORAZON */

function heartFormula(
  t,
  scale
) {

  const x =
    16 *
    Math.pow(
      Math.sin(t),
      3
    );

  const y =
    -(
      13 *
      Math.cos(t)

      -
      5 *
      Math.cos(2 * t)

      -
      2 *
      Math.cos(3 * t)

      -
      Math.cos(4 * t)
    );


  return {

    x:
      x * scale,

    y:
      y * scale

  };
}


/* CREAR CORAZON */

function createHeart() {

  const rect =
    heartCanvas
      .getBoundingClientRect();


  const centerX =
    rect.width / 2;

  const centerY =
    rect.height / 2
    +
    rect.height * .01;


  const scale =
    Math.min(
      rect.width / 40,
      rect.height / 34
    );


  const points = [];


  /* BORDE */

  for (
    let i = 0;
    i < 900;
    i++
  ) {

    const t =
      (
        Math.PI * 2 * i
      ) / 900;


    const p =
      heartFormula(
        t,
        scale
      );


    points.push({

      x:
        centerX + p.x,

      y:
        centerY + p.y,

      size:
        random(.65, 1.65),

      alpha:
        random(.55, 1),

      phase:
        random(
          0,
          Math.PI * 2
        ),

      edge: true

    });

  }


  /* INTERIOR */

  for (
    let i = 0;
    i < 2100;
    i++
  ) {

    const t =
      random(
        0,
        Math.PI * 2
      );


    const edge =
      heartFormula(
        t,
        scale
      );


    const fill =
      Math.pow(
        Math.random(),
        .55
      );


    points.push({

      x:
        centerX
        +
        edge.x
        * fill,

      y:
        centerY
        +
        edge.y
        * fill,

      size:
        random(.45, 1.35),

      alpha:
        random(.2, .82),

      phase:
        random(
          0,
          Math.PI * 2
        ),

      edge: false

    });

  }


  heartPoints =
    points;
}


/* FONDO */

function drawBackground() {

  particleCtx.clearRect(
    0,
    0,
    width,
    height
  );


  for (
    const p of particles
  ) {

    p.y -= p.speed;

    p.x += p.drift;


    if (p.y < -5) {

      p.y =
        height + 5;

      p.x =
        random(
          0,
          width
        );
    }


    if (p.x < -5)
      p.x = width + 5;


    if (p.x > width + 5)
      p.x = -5;


    const pulse =
      .6 +
      Math.sin(
        p.twinkle += .015
      )
      * .25;


    const [
      r,
      g,
      b
    ] =
      p.color;


    particleCtx.beginPath();


    particleCtx.fillStyle =
      `rgba(
        ${r},
        ${g},
        ${b},
        ${Math.max(
          .05,
          p.alpha * pulse
        )}
      )`;


    particleCtx.arc(

      p.x,
      p.y,
      p.r,

      0,
      Math.PI * 2

    );


    particleCtx.fill();

  }
}


/* CORAZON ANIMADO */

function drawHeart(time) {

  const rect =
    heartCanvas
      .getBoundingClientRect();


  heartCtx.clearRect(

    0,
    0,

    rect.width,
    rect.height

  );


  const glow =
    heartCtx.createRadialGradient(

      rect.width / 2,

      rect.height / 2,

      5,

      rect.width / 2,

      rect.height / 2,

      rect.width * .42

    );


  glow.addColorStop(
    0,
    "rgba(255,50,145,.08)"
  );


  glow.addColorStop(
    1,
    "rgba(255,50,145,0)"
  );


  heartCtx.fillStyle =
    glow;


  heartCtx.fillRect(

    0,
    0,

    rect.width,
    rect.height

  );


  for (
    let i = 0;
    i < heartPoints.length;
    i++
  ) {

    const p =
      heartPoints[i];


    const wave =
      Math.sin(
        time * .0018
        +
        p.phase
      )
      * .9;


    let x =
      p.x
      +
      Math.cos(
        time * .0005
        +
        p.phase
      )
      * .8;


    let y =
      p.y + wave;


    /* EFECTO DEL MOUSE */

    if (mouse.active) {

      const dx =
        x - mouse.x;

      const dy =
        y - mouse.y;


      const dist =
        Math.sqrt(
          dx * dx +
          dy * dy
        );


      if (dist < 90) {

        const force =
          (90 - dist) / 90;


        x +=
          (dx / (dist || 1))
          *
          force
          *
          12;


        y +=
          (dy / (dist || 1))
          *
          force
          *
          12;

      }

    }


    const sparkle =
      .55
      +
      Math.sin(
        time * .003
        +
        p.phase
      )
      * .35;


    heartCtx.beginPath();


    heartCtx.fillStyle =
      `rgba(
        255,
        ${75 + Math.floor(
          p.alpha * 130
        )},
        ${145 + Math.floor(
          p.alpha * 80
        )},
        ${Math.max(
          .15,
          p.alpha * sparkle
        )}
      )`;


    heartCtx.arc(

      x,
      y,

      p.size,

      0,
      Math.PI * 2

    );


    heartCtx.fill();


    /* BRILLOS */

    if (
      p.edge &&
      i % 18 === 0
    ) {

      heartCtx.beginPath();


      heartCtx.fillStyle =
        `rgba(
          255,
          220,
          238,
          ${.25 + p.alpha * .35}
        )`;


      heartCtx.arc(

        x,
        y,

        p.size * 1.9,

        0,
        Math.PI * 2

      );


      heartCtx.fill();

    }

  }

}


/* ANIMACION */

function animate(time) {

  drawBackground();

  drawHeart(time);

  requestAnimationFrame(
    animate
  );
}


/* MOVIMIENTO DEL MOUSE */

window.addEventListener(
  "pointermove",
  (event) => {

    mouse.x =
      event.clientX;

    mouse.y =
      event.clientY;

    mouse.active =
      true;

  }
);


window.addEventListener(
  "pointerleave",
  () => {

    mouse.active =
      false;

  }
);


/* MUSICA */

const music =
  document.getElementById(
    "music"
  );


const musicButton =
  document.getElementById(
    "musicButton"
  );


const musicText =
  document.getElementById(
    "musicText"
  );


musicButton.addEventListener(
  "click",
  async () => {

    if (music.paused) {

      try {

        await music.play();

        musicText.textContent =
          "Pausar";

        musicButton.classList.add(
          "playing"
        );

      } catch (error) {

        musicText.textContent =
          "Pon musica.mp3";

      }

    } else {

      music.pause();

      musicText.textContent =
        "Música";

      musicButton.classList.remove(
        "playing"
      );

    }

  }
);


/* INICIAR */

window.addEventListener(
  "load",
  () => {

    resize();


    setTimeout(
      () => {

        document
          .getElementById(
            "loading"
          )
          .classList.add(
            "hidden"
          );

      },
      900
    );


    requestAnimationFrame(
      animate
    );

  }
);