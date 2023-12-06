document.getElementById("formularioArticulo").addEventListener("submit", function(event) {
    event.preventDefault();

    const id = document.getElementById("formularioArticulo").getAttribute("data-id");

    if (id) {
        // Si hay un ID, significa que estamos actualizando un artículo existente
        const articuloActualizado = {
            title: document.getElementById("titulo").value,
            subTitle: document.getElementById("subtitulo").value,
            article: document.getElementById("contenido").value,
            image1: document.getElementById("imagen1").value,
            image2: document.getElementById("imagen2").value,
            id: id,
        };

        actualizarArticuloEnIndexedDB(articuloActualizado);
    } else {
        // Si no hay un ID, significa que estamos creando un nuevo artículo
        const nuevoArticulo = {
            title: document.getElementById("titulo").value,
            subTitle: document.getElementById("subtitulo").value,
            article: document.getElementById("contenido").value,
            image1: document.getElementById("imagen1").value,
            image2: document.getElementById("imagen2").value,
            id: Date.now().toString(),
        };

        guardarArticuloEnIndexedDB(nuevoArticulo);
    }
});

function actualizarArticuloEnIndexedDB(articulo) {
    const request = indexedDB.open("miDB", 1);

    request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction(["articulos"], "readwrite");
        const objectStore = transaction.objectStore("articulos");

        const requestPut = objectStore.put(articulo);

        requestPut.onsuccess = function(event) {
            alert("Artículo actualizado correctamente");
            limpiarFormulario();
            mostrarArticulosDesdeIndexedDB();
        };

        requestPut.onerror = function(event) {
            console.error("Error al actualizar el artículo:", event.target.error);
        };
    };

    request.onerror = function(event) {
        console.error("Error al abrir la base de datos:", event.target.error);
    };
}

function limpiarFormulario() {
    // Limpiar los campos del formulario
    document.getElementById("formularioArticulo").reset();

    // Restablecer el estado del formulario para crear un nuevo artículo
    document.getElementById("formularioArticulo").removeAttribute("data-id");
    document.querySelector("button[type='submit']").innerText = "Guardar";
}

function guardarArticuloEnIndexedDB(articulo) {
    const request = indexedDB.open("miDB", 1);

    request.onupgradeneeded = function(event) {
        const db = event.target.result;

        if (!db.objectStoreNames.contains("articulos")) {
            const objectStore = db.createObjectStore("articulos", { keyPath: "id" });
        }
    };

    request.onsuccess = function(event) {
        const db = event.target.result;

        if (db.objectStoreNames.contains("articulos")) {
            const transaction = db.transaction(["articulos"], "readwrite");
            const objectStore = transaction.objectStore("articulos");

            const requestAdd = objectStore.add(articulo);

            requestAdd.onsuccess = function(event) {
                alert("Artículo guardado correctamente");
                limpiarFormulario()
                mostrarArticulosDesdeIndexedDB();
            };

            requestAdd.onerror = function(event) {
                console.error("Error al guardar el artículo:", event.target.error);
            };
        } else {
            console.error("El almacén de objetos 'articulos' no existe.");
        }
    };

    request.onerror = function(event) {
        console.error("Error al abrir la base de datos:", event.target.error);
    };
}

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

            requestGetAll.onsuccess = function(event) {
                const articulos = event.target.result;
                const listaArticulos = document.getElementById("articulos");

                listaArticulos.innerHTML = "";

                articulos.forEach(function(articulo) {
                    // Agregamos botones para actualizar y eliminar
                    listaArticulos.innerHTML += `
                        <li>
                            ${articulo.title} - ${articulo.subTitle}
                            <button onclick="actualizarArticulo('${articulo.id}')">Actualizar</button>
                            <button onclick="eliminarArticulo('${articulo.id}')">Eliminar</button>
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

function actualizarArticulo(id) {
    const request = indexedDB.open("miDB", 1);

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction(["articulos"], "readonly");
        const objectStore = transaction.objectStore("articulos");

        const requestGet = objectStore.get(id);

        requestGet.onsuccess = function (event) {
            const articuloExistente = event.target.result;

            if (articuloExistente) {
                // Rellenar el formulario con los datos existentes
                document.getElementById("titulo").value = articuloExistente.title;
                document.getElementById("subtitulo").value = articuloExistente.subTitle;
                document.getElementById("contenido").value = articuloExistente.article;
                document.getElementById("imagen1").value = articuloExistente.image1;
                document.getElementById("imagen2").value = articuloExistente.image2;

                // Cambiar el ID del formulario para indicar que es una actualización
                document.getElementById("formularioArticulo").setAttribute("data-id", id);

                // Cambiar el texto del botón
                document.querySelector("button[type='submit']").innerText = "Actualizar";
            } else {
                console.error("El artículo con el ID especificado no existe.");
            }
        };

        requestGet.onerror = function (event) {
            console.error("Error al obtener el artículo:", event.target.error);
        };
    };

    request.onerror = function (event) {
        console.error("Error al abrir la base de datos:", event.target.error);
    };
}


function eliminarArticulo(id) {
    const request = indexedDB.open("miDB", 1);

    request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction(["articulos"], "readwrite");
        const objectStore = transaction.objectStore("articulos");

        const requestDelete = objectStore.delete(id);

        requestDelete.onsuccess = function(event) {
            alert("Artículo eliminado correctamente");
            mostrarArticulosDesdeIndexedDB();
        };

        requestDelete.onerror = function(event) {
            console.error("Error al eliminar el artículo:", event.target.error);
        };
    };

    request.onerror = function(event) {
        console.error("Error al abrir la base de datos:", event.target.error);
    };
}

