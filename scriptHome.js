function mostrarArticulosDesdeIndexedDB() {
    // Verificar si la base de datos ya existe
    const dbRequest = indexedDB.open("miDB");

    dbRequest.onsuccess = function(event) {
        const db = event.target.result;
      
        if (db) {
            // La base de datos existe, proceder con la lógica para mostrar artículos
            const transaction = db.transaction(["articulos"], "readonly");
            const objectStore = transaction.objectStore("articulos");

            const requestGetAll = objectStore.getAll();

           
                requestGetAll.onsuccess = function (event) {
                    const articulos = event.target.result;
                    const listaArticulos = document.getElementById("articulos");

                    listaArticulos.innerHTML = "";

                    articulos.forEach(function (articulo) {
                        // Agregamos un enlace para cada artículo que redirige a la página del artículo completo
                        listaArticulos.innerHTML += `
                            <li>
                                <a href="ver_articulo.html?id=${articulo.id}">
                                    <h2>${articulo.title}</h2>
                                    <span>${articulo.subTitle}</span>
                                    <img src="${articulo.image1}" onerror="imagenNoEncontrada(this)" alt="Imagen del artículo">
                                </a>
                            </li>`;
                    });
                };


            requestGetAll.onerror = function(event) {
                console.error("Error al obtener los artículos:", event.target.error);
            };
        } else {
            console.error("La base de datos 'miDB' no existe.");
        }
    };

    dbRequest.onerror = function(event) {
        console.error("Error al intentar abrir la base de datos:", event.target.error);
    };
}

        const request = indexedDB.open("miDB", 1);

request.onsuccess = function (event) {
    const db = event.target.result;

    if (db.objectStoreNames.contains("articulos")) {
        
        mostrarArticulosDesdeIndexedDB();
    } 
};

request.onerror = function (event) {
    console.error("Error al abrir la base de datos:", event.target.error);
};

function imagenNoEncontrada(img) {
    // Establecemos la URL de la imagen predeterminada en caso de error
    img.src = 'img/Logo.png';
}