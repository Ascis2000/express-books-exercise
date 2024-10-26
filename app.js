
// codigo de Servidor
const express = require('express'); // usar la libreria
const app = express(); // Inicializar Servidor
const port = 3000; // puerto que voy a usar

app.use(express.json());

const path = require('path'); // módulo para trabajar con rutas de archivos y directorios
app.use(express.static(path.join(__dirname, 'public')));

// importamos archivos .js o .json
const books = require('./data/books.json');
let printResHTML = require('./data/pintarDatosHTML.js');

// GET http://localhost:3000
/* app.get('/', (req, res) => {
    try {
        // redirigimos inmediatamente a la ruta /init
        res.send('Inicio de Libreria');
    } catch (error) {
        res.status(500).send('Error en la redirección. Por favor, inténtelo más tarde.');
    }
}); */

// GET http://localhost:3000
app.get('/', (req, res) => {
    try {
        // redirigimos inmediatamente a la ruta /init
        res.redirect('/init');
    } catch (error) {
        res.status(500).send('Error en la redirección. Por favor, inténtelo más tarde.');
    }
});

app.get('/init', (req, res) => {
    // definimos el titulo y el mensaje inicial que queremos enviar al HTML

    // objeto donde podemos pasar valores a init.html
    const data = {
        mensaje: 'Books 2024: Endpoints'
    };

    // Llama a la función para renderizar el HTML con datos
    let initHTML = printResHTML.cargar_initHTML(data);
    res.status(200).send(initHTML); // enviamos el contenido modificado como respuesta
});

// 1. Crea una ruta /all para obtener todos los libros
// Ejemplo: http://localhost:3000/all
app.get('/all', (req, res) => {

    let format = req.query.format;

    if (!format) {
        res.status(200).json(books);
        
    } else if (format == 'html') {
        // enviamos la respuesta en HTML
        let respuestaHTML = printResHTML.pintarLibrosHTML(books, "Listado de Todos los Libros");
        res.status(200).send(respuestaHTML);
    }
});


// 2. Crea una ruta /first para obtener el primer libro
// Ejemplo: http://localhost:3000/first
app.get('/first', (req, res) => {
    if (books.length > 0) {

        let format = req.query.format;
        let firstBook = books[0]; // obtenemos el primer elemento del array

        if (!format) {
            res.status(200).json(firstBook); // devolvemos el resultado en formato JSON
        } else if (format == 'html') {
            // enviamos la respuesta en HTML
            let respuestaHTML = printResHTML.pintarLibrosHTML(firstBook, "Datos del Primer Libro");
            res.status(200).send(respuestaHTML);
        }
    } else {
        // respuesta en caso de que no haya libros
        res.status(404).json({ message: "Libro no encontrado" }); 
    }
});


// 3. Crea una ruta /last para obtener el ultimo libro
// Ejemplo: http://localhost:3000/last
app.get('/last', (req, res) => {
    if (books.length > 0) {

        let format = req.query.format;
        let lastBook = books[books.length - 1]; // obtenemos el ultimo elemento del array

        if (!format) {
            res.status(200).json(lastBook); // devolvemos el resultado en formato JSON
        } else if (format == 'html') {
            let respuestaHTML = printResHTML.pintarLibrosHTML(lastBook, "Datos del Último Libro");
            res.status(200).send(respuestaHTML);
        }
    } else {
        // respuesta en caso de que no haya libros
        res.status(404).json({ message: "Libro no encontrado" }); 
    }
});


// 4. Crea una ruta /middle para obtener el libro situado en la mitad del array
// Ejemplo: http://localhost:3000/middle
app.get('/middle', (req, res) => {
    if (books.length > 0) {

        let format = req.query.format;
        let middleIndex = Math.floor(books.length / 2);
        let middleBook = books[middleIndex]; // obtenemos posicion media del elemento del array
        
        if (!format) {
            res.status(200).json(middleBook); // devolvemos el resultado en formato JSON
        } else if (format == 'html') {
            let respuestaHTML = printResHTML.pintarLibrosHTML(middleBook, "Datos del Libro en la posición media");
            res.status(200).send(respuestaHTML);
        }
    } else {
        // respuesta en caso de que no haya libros
        res.status(404).json({ message: "Libro no encontrado" }); 
    }
});


// 5. Crea una ruta /author/dante-alighieri para obtener 
// SÓLO EL TÍTULO del libro de Dante Alighieri
// http://localhost:3000/author/:authorName
// Ejemplo: http://localhost:3000/author/dante-alighieri
app.get('/author/:authorName', (req, res) => {
    
    // reemplazamos todas las ocurrencias de '-' por espacios en blanco
    let authorName = req.params.authorName.replace(/-/g, ' '); 
    let libro = books.find(item => item.author.toLowerCase() === authorName.toLowerCase()); // Buscar por autor

    if (libro) {
        res.status(200).json({ 
            title: libro.title,
         });
    } else {
        res.status(404).json({ error: 'Libro no encontrado' }); // Manejo si no se encuentra el libro
    }
});


// 6. Crea una ruta /country/charles-dickens para obtener 
// SÓLO EL PAÍS del libro de Charles Dickens
// http://localhost:3000/country/:authorName
// Ejemplo: http://localhost:3000/country/charles-dickens
app.get('/country/:authorName', (req, res) => {
    let authorName = req.params.authorName.replace(/-/g, ' ').toLowerCase();
    let libro = books.find(item => {
        let itemAutor = item.author.toLowerCase();
        return (itemAutor === authorName);
    });

    if (libro) {
        res.status(200).json({ country: libro.country });
    } else {
        res.status(404).json({ error: 'Libro no encontrado' });
    }
});


// 7. Crea una ruta /year&pages/cervantes para obtener 
// LAS PÁGINAS Y EL AÑO del libro de Miguel de Cervantes, 
// Ejemplo de respuesta: { pages: ..., year: ... }
// http://localhost:3000/year&pages/:authorName
// Ejemplo: http://localhost:3000/year&pages/cervantes
app.get('/year&pages/:authorName', (req, res) => {
    let authorName = req.params.authorName.toLowerCase(); 

    // buscamos un libro cuyo autor contenga el apellido pasado en el endpoint
    let libro = books.find(item => item.author.toLowerCase().includes(authorName));

    if (libro) {
        // enviamos el número de páginas y año
        res.status(200).json({ 
            pages: libro.pages, 
            year: libro.year 
        }); 
    } else {
        res.status(404).json({ error: 'Libro no encontrado' }); 
    }
});

// http://localhost:3000/country/count/:countryName
// 8. Crea una ruta /country/count/spain para obtener EL NÚMERO DE LIBROS de España
// Ejemplo: http://localhost:3000/country/count/Spain
app.get('/country/count/:countryName', (req, res) => {
    let countryName = req.params.countryName.replace(/-/g, ' ');

    // realizamos un filtro que recorre el array 'books' 
    // que devuelve un array con aquellos paises del endpoint con valor 'countryName'
    let arr_resultado = books.filter(item => item.country.toLowerCase() === countryName.toLowerCase());
    
    res.status(200).json({ country: countryName, count: arr_resultado.length });
});

// http://localhost:3000/country/at-least/:countryName
// 9. Crea una ruta /country/at-least/germany para obtener 
// VERDADERO O FALSO dependiendo de si hay o no un libro de Alemania
// Ejemplo: http://localhost:3000/country/at-least/Denmark
app.get('/country/at-least/:countryName', (req, res) => {
    let countryName = req.params.countryName.replace(/-/g, ' ');

    //utilizamos 'some' para verificar si al menos uno de los elementos 
    // en el array 'books' cumple con una condición específica
    // devolviendo true si alguno se cumple o devuelve false
    const exists = books.some(item => item.country.toLowerCase() === countryName.toLowerCase());

    res.status(200).json({ 
        country: countryName, 
        exists: exists 
    });
});

// http://localhost:3000/pages/all-greater/:pageCount
// 10. Crea una ruta /pages/all-greater/200 para obtener 
// VERDADERO O FALSO dependiendo de si todos los libros tienen más de 200 páginas
// Ejemplo: http://localhost:3000/pages/all-greater/200
app.get('/pages/all-greater/:pageCount', (req, res) => {
    // convertimos la cadena a un número entero
    let numPaginas = parseInt(req.params.pageCount, 10);

    // El metodo 'every' verifica si TODOS los elementos del array 
    // cumplen con la condicion y devuelve true o false
    const bool_resultado = books.every(book => book.pages > numPaginas);

    res.status(200).json({ allGreater: bool_resultado });
});

// OTROS
/* ********************************** */
/* ********************************** */
/* ********************************** */

// http://localhost:3000/book/:number
// Ejemplo: http://localhost:3000/book/1
app.get('/book/:number', (req, res) => {
    if (books.length > 0) {

        let format = req.query.format;
        
        let numLibro = parseInt(req.params.number) || 1; // si no se proporciona un número válido, default a 1
        let indexLibro = numLibro - 1;
        let libro = books[indexLibro]; // obtenemos el elemento del array

        if (!format) {
            res.status(200).json(libro); // devolvemos el resultado en formato JSON
        } else if (format == 'html') {
            // enviamos la respuesta en HTML
            let respuestaHTML = printResHTML.pintarLibrosHTML(libro, "Datos del Libro en la posición " + (indexLibro + 1));
            res.status(200).send(respuestaHTML);
        }
    } else {
        // respuesta en caso de que no haya libros
        res.status(404).json({ mensaje: "Libro no encontrado" }); 
    }
});


// http://localhost:3000/books?page=1
app.get('/books', (req, res) => {

    let page = req.query.page;
    let format = req.query.format;

    // obtenemos el número de página del query string
    let pageNum = parseInt(page, 10) || 1; // si no se proporciona un número válido, default a 1
    let itemsPerPage = 10; // Número de libros por página

    // calculamos el índice inicial y final para el slice
    let startIndex = (pageNum - 1) * itemsPerPage; // indice inicial
    let endIndex = startIndex + itemsPerPage; // indice final

    // obtenemos los libros paginados mediante slice()
    let paginatedBooks = books.slice(startIndex, endIndex); 

    // si hay libros para mostrar
    if (paginatedBooks.length > 0) {
        if (!format) {
            res.status(200).json(paginatedBooks); // devolvemos los libros en formato JSON
        } else if (format == 'html') {
            let respuestaHTML = printResHTML.pintarLibrosHTML(paginatedBooks, `Libros desde la posición ${startIndex + 1} has la posición ${endIndex}`);
            res.status(200).send(respuestaHTML);
        }
    } else {
        return res.status(404).json({ mensaje: 'No hay libros disponibles para esta paginación' });
    }
});

// Para todo el resto de rutas no contempladas
app.use('*', (req, res) => {
    // res.status(404);
    let respuestaHTML = printResHTML.pintarPaginaNoEncontrada(`(404) La página no ha sido encontrada`);
    res.send(respuestaHTML);
});

app.listen(port, () => {
    console.log(`App escuchando en el puerto: ${port}`)
});