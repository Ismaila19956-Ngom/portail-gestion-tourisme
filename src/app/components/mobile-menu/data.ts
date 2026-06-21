
interface MenuItem {
    title: string;
    link?: string;
    subMenu?: MenuItem[];
    isOpen?: boolean
}
export const menuItems:MenuItem[] = [
    {
        "title": "Accueil",
        "link": "/home-1"
    },
    {
        "title": "Nos Destinations",
        "isOpen": false,
        "subMenu": [
            { "title": "Toutes les destinations", "link": "/excursions" },
            { "title": "Dakar & Gorée", "link": "/excursions" },
            { "title": "Sine Saloum", "link": "/excursions" },
            { "title": "Casamance", "link": "/excursions" },
            { "title": "Saint-Louis", "link": "/excursions" }
        ]
    },
    {
        "title": "A Propos",
        "link": "/about"
    },
    {
        "title": "Actualités",
        "isOpen": false,
        "subMenu": [
            { "title": "Toutes les actualités", "link": "/blogs/one" },
            { "title": "Conseils de voyage", "link": "/blogs/sidebar" },
            { "title": "Découvertes", "link": "/blogs/single" }
        ]
    },
    {
        "title": "Nos Agences",
        "link": "/agences"
    },
    {
        "title": "Contact",
        "link": "/contact-us"
    }
]


