   // Extraer el ID del artículo de la URL
   const params = new URLSearchParams(window.location.search);
   const articuloId = params.get("id");

  // En ver_articulo.html

// ...

const request = indexedDB.open("miDB", 1);

request.onsuccess = function (event) {
const db = event.target.result;

if (db.objectStoreNames.contains("articulos")) {
   const transaction = db.transaction(["articulos"], "readonly");
   const objectStore = transaction.objectStore("articulos");

   const requestGet = objectStore.get(articuloId);

   requestGet.onsuccess = function (event) {
       const articulo = event.target.result;

       // Muestra el contenido completo del artículo en el elemento con id "articulo-completo"
       const articuloCompletoElement = document.getElementById("articulo-completo");
       articuloCompletoElement.innerHTML = `
       <div>
            <img src="${articulo.image1}" onerror="imagenNoEncontrada(this)" alt="Imagen del artículo">
           <h2>${articulo.title}</h2>
           <span>${articulo.subTitle}</span>
           <p>${articulo.article}</p>
        </div>
       `;
   };

   requestGet.onerror = function (event) {
       console.error("Error al obtener el artículo:", event.target.error);
   };
} else {
   console.error("El almacén de objetos 'articulos' no existe.");
}
};

request.onerror = function (event) {
console.error("Error al abrir la base de datos:", event.target.error);
};

function imagenNoEncontrada(img) {
    // Establecemos la URL de la imagen predeterminada en caso de error
    img.src = 'img/sinFoto.jpg';
}