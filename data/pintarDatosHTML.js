

const fs = require('fs'); // módulo para interactuar con el sistema de archivos
const path = require('path'); // módulo para trabajar con rutas de archivos y directorios

function cargar_initHTML(data) {

    let html;
    const filePath = path.join(__dirname, '..', 'public', 'init.html');

    try {
        html = fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        return `
            <link rel="stylesheet" href="./css/styles.css">
            <h1>Error al cargar la página 'init.html'</h1>
            <div class="msg_error">${err}</div>
        `;
    }

    // sustituimos los marcadores de posición en el HTML
    // y devolvemos la página con los valores cambiados
    let modifiedHtml = html
        .replace(/{{mensaje}}/g, data.mensaje);

    return modifiedHtml;
}

function pintarInicioHTML(titulo){
    let html = "";

    html +=`
        <html>
            <head>
                <title>${titulo}</title>
                <link rel="stylesheet" href="/css/styles.css">
            </head>
            <body>
                <main>
                <h3>${titulo}</h3>
                <div class="boxBooks">
    `;
    return html;
}

function pintarCierreHTML(){

    let html = "";
    html += `
                </main>
                </div>
            </body>
        </html>
    `;
    return html;
}

function pintarLibroHTML(libro){

    let htmlResponse = "";
    htmlResponse += `
        <div class="box">
            <!--<img src="${libro.imageLink}" alt="${libro.title}">-->
            <div class="title">${libro.title || 'Título no disponible'}</div>
            <div class="author">Autor: ${libro.author || 'Autor no disponible'}</div>
            <div class="details">
                País: ${libro.country || 'País no disponible'}<br>
                Páginas: ${libro.pages ? libro.pages : 'No disponible'}<br>
                Año: ${libro.year || 'Año no disponible'}<br>
                <a href="${libro.link || '#'}" target="_blank">Más información</a>
            </div>
        </div>
    `;
    return htmlResponse;
}

function pintarLibrosHTML(libros, titulo) {
    let htmlResponse ="";
    htmlResponse += pintarInicioHTML(titulo);

    // el argumento libros lo tratamos como objeto en el caso que no sea un array
    const librosArray = Array.isArray(libros) ? libros : [libros];

    // Iterar sobre los libros y crear un bloque HTML para cada uno
    librosArray.forEach(item => {
        htmlResponse += pintarLibroHTML(item);
    });
    htmlResponse += pintarCierreHTML();

    return htmlResponse;
}

function pintarPaginaNoEncontrada(titulo){

    let vTitulo = (titulo != undefined) ? titulo : 'Página no encontrada';

    let html = "";
    html += pintarInicioHTML(vTitulo);
    html += `
        <div class="fondo">
            <div class="contenido">
                <h1>${vTitulo}</h1>
                <p>Esta no es la página que estabas buscando.</p>
            </div>
        </div>
    `;
    html += pintarCierreHTML();

    return html;
}

// module.exports = pintarDatosHTML;

module.exports = {
    pintarLibrosHTML,
    cargar_initHTML,
    pintarPaginaNoEncontrada
};