window.STREETHYPE_PRODUCTS = [
    // PRODUCTOS DE ROPA
    {
        id: "camiseta-magica",
        name: "Camiseta Mágica",
        category: "ropa",
        description: "Camiseta de estilo urbano",
        price: 89,
        image: "assets/img/camiseta.magica.jpg",
        color: "Negro",
        sizes: ["S", "M", "L", "XL"]
    },
    {
        id: "polo-azul",
        name: "Polo Azul",
        category: "sale",
        price: 79,
        previousPrice: 99,
        badge: "SALE",
        description: "Polo casual azul",
        image: "assets/img/polo.azul.jpg",
        color: "Azul",
        sizes: ["S", "M", "L", "XL"]
    },
    {
        id: "polo-crema",
        name: "Polo Crema",
        category: "sale",
        price: 79,
        previousPrice: 99,
        badge: "SALE",
        description: "Polo casual color crema",
        image: "assets/img/polo.crema.jpg",
        color: "Crema",
        sizes: ["S", "M", "L", "XL"]
    },
    {
        id: "polo-verde-militar",
        name: "Polo Verde Militar",
        category: "ropa",
        description: "Polo casual verde militar",
        price: 99,
        image: "assets/img/polo.verde.militar.jpg",
        color: "Verde militar",
        sizes: ["S", "M", "L", "XL"]
    },
    {
        id: "jogger-mujer",
        name: "Jogger para Mujer",
        category: "ropa",
        description: "Jogger de estilo urbano",
        price: 129,
        image: "assets/img/Jogger Para Mujer.jpg",
        color: "Negro",
        sizes: ["S", "M", "L", "XL"]
    },
    {
        id: "chaqueta-hype",
        name: "Chaqueta Hype",
        category: "ropa",
        description: "Chaqueta de estilo urbano",
        price: 249,
        image: "assets/img/chaquetas.jpg",
        color: "Negro",
        sizes: ["S", "M", "L", "XL"]
    },

    // PRODUCTOS DE ZAPATILLAS
    {
        id: "zapatillas-nike-rojas",
        name: "Zapatillas Nike Rojas",
        category: "zapatillas",
        description: "Zapatillas urbanas rojas",
        price: 389,
        image: "assets/img/Zapatillas Nike Rojas.jpg",
        color: "Rojo",
        sizes: ["38", "39", "40", "41", "42", "43"]
    },
    {
        id: "botines-rojos-nike",
        name: "Botines Rojos Nike",
        category: "zapatillas",
        description: "Botines deportivos rojos",
        price: 529,
        image: "assets/img/Botines rojos Nike.jpg",
        color: "Rojo",
        sizes: ["38", "39", "40", "41", "42", "43"]
    },
    {
        id: "adidas-id3711",
        name: "Adidas ID3711",
        category: "zapatillas",
        description: "Zapatillas Adidas urbanas",
        price: 349,
        image: "assets/img/Zapatillas adidadas id3711.jpg",
        color: "Multicolor",
        sizes: ["38", "39", "40", "41", "42", "43"]
    },
    {
        id: "adidas-running-azul",
        name: "Adidas Running Azul",
        category: "sale",
        price: 249,
        previousPrice: 299,
        badge: "SALE",
        description: "Zapatillas para running",
        image: "assets/img/Zapatillas Running azul.jpg",
        color: "Azul",
        sizes: ["38", "39", "40", "41", "42", "43"]
    },

    // PRODUCTOS DE ACCESORIOS
    {
        id: "gorra-blanca",
        name: "Gorra Blanca",
        category: "sale",
        price: 39,
        previousPrice: 49,
        badge: "SALE",
        description: "Gorra urbana blanca",
        image: "assets/img/Gorra Blanca.jpg",
        color: "Blanco",
        sizes: []
    },
    {
        id: "gorra-crema",
        name: "Gorra Crema",
        category: "accesorios",
        description: "Gorra urbana color crema",
        price: 55,
        image: "assets/img/gorra crema.jpg",
        color: "Crema",
        sizes: []
    },
    {
        id: "gorra-deportiva",
        name: "Gorra Deportiva",
        category: "accesorios",
        description: "Gorra de estilo deportivo",
        price: 65,
        image: "assets/img/Gorra Deportiva.jpg",
        color: "Negro",
        sizes: []
    },
    {
        id: "gorra-dunkelvolk",
        name: "Gorra Dunkelvolk",
        category: "accesorios",
        description: "Gorra urbana para hombre",
        price: 79,
        image: "assets/img/Gorra para Hombre DUNKELVOLK.jpg",
        color: "Negro",
        sizes: []
    }
];

// Devuelve la ruta correcta desde el inicio o desde /paginas/.
window.STREETHYPE_IMAGE = function (image) {
    if (/^https?:\/\//i.test(image)) return image;

    const prefix = window.location.pathname.includes("/paginas/")
        ? "../"
        : "";

    return prefix + image;
};
