// SAMPLE
this.manifest = {
    "name": "My Extension",
    "icon": "icon.png",
    "settings": [
        {
            "tab": i18n.get("templates"),
            "group": i18n.get("config"),
            "name": "username",
            "type": "text",
            "label": i18n.get("username"),
            "text": i18n.get("x-characters")
        },
        {
            "tab": i18n.get("templates"),
            "group": i18n.get("templates"),
            "name": "template",
            "type": "textarea",
            "text": i18n.get("template_text")
        }
    ],
    "alignment": [
        [
            "username"
        ]
    ]
};
