const bgContainer = document.getElementById('bgContainer');

/* CREA EL FONDO DE TE AMO */

function buildMatrixBackground() {

    bgContainer.innerHTML = '';

    const charWidth = 95;

    const columnCount =
        Math.ceil(window.innerWidth / charWidth) + 1;

    let textBlock = "";

    for (let i = 0; i < 60; i++) {
        textBlock += "TE AMO<br>";
    }

    for (let i = 0; i < columnCount; i++) {

        const col = document.createElement('div');

        col.className = 'matrix-column';

        const moveDiv = document.createElement('div');

        moveDiv.className = 'matrix-move';

        moveDiv.innerHTML =
            textBlock + textBlock;

        col.style.opacity =
            (Math.random() * 0.5 + 0.3).toFixed(2);

        moveDiv.style.animationDelay =
            (Math.random() * -10) + 's';

        col.appendChild(moveDiv);

        bgContainer.appendChild(col);
    }
}

/* ACTUALIZA EL FONDO SI CAMBIA EL TAMAÑO */

window.addEventListener(
    'resize',
    buildMatrixBackground
);


/* CUANDO PRESIONA SÍ */

function triggerYes() {

    document.getElementById(
        'viewInterface'
    ).style.display = 'none';

    buildMatrixBackground();

    bgContainer.style.display = 'flex';

    setTimeout(() => {

        bgContainer.style.opacity = '1';

    }, 10);

    document.getElementById(
        'neonSet'
    ).style.display = 'flex';
}


/* CUANDO PRESIONA NO */

function triggerNo() {

    const frame =
        document.getElementById('popupWindow');

    /* PEQUEÑO MOVIMIENTO DE LA VENTANA */

    frame.style.transform =
        'translate(4px, 4px)';

    setTimeout(() => {

        frame.style.transform =
            'translate(-4px, -4px)';

    }, 40);

    setTimeout(() => {

        frame.style.transform =
            'translate(4px, -4px)';

    }, 80);

    /* DESPUÉS APARECE LA CARITA */

    setTimeout(() => {

        document.getElementById(
            'viewInterface'
        ).style.display = 'none';

        document.getElementById(
            'smileContainer'
        ).style.display = 'block';

    }, 130);
}