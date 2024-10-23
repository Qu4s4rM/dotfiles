const notifications = await Service.import("notifications")

const WINDOW_NAME = "sidebar"



function Media() {
    const label = Utils.watch("", mpris, "player-changed", () => {
        if (mpris.players[0]) {
            const { track_artists, track_title } = mpris.players[0]
            return `${track_artists.join(", ")} - ${track_title}`
        } else {
            return "Nothing is playing"
        }
    })

    return Widget.Button({
        class_name: "media",
        on_primary_click: () => mpris.getPlayer("")?.playPause(),
        on_scroll_up: () => mpris.getPlayer("")?.next(),
        on_scroll_down: () => mpris.getPlayer("")?.previous(),
        child: Widget.Label({ label }),
    })
}

function MenuSidebar(){
    return Widget.Box({
        class_name: "sidebar-menu",
        spacing: 10,
        children: [
            Widget.Box({
                class_name: "sidebar-menu-child",
                spacing: 10,
                vertical: true,
                children: [
                    Widget.Button({
                        class_name: "sidebar-menu-child-btn",
                        child: Widget.Label("Network"),
                    }),
                    Widget.Button({
                        class_name: "sidebar-menu-child-btn",
                        child: Widget.Label("Device control"),
                    }),
                    Widget.Button({
                        class_name: "sidebar-menu-child-btn",
                        child: Widget.Label("Do not disturb"),
                    }),
                ],
            }),
            Widget.Box({
                class_name: "sidebar-menu-child",
                spacing: 10,
                vertical: true,
                children: [
                    Widget.Button({
                        class_name: "sidebar-menu-child-btn",
                        child: Widget.Label("Bluetooth"),
                    }),
                    Widget.Button({
                        class_name: "sidebar-menu-child-btn",
                        child: Widget.Label("Eye comfort shiled"),
                    }),
                    Widget.Button({
                        class_name: "sidebar-menu-child-btn",
                        child: Widget.Label("Dark mode"),
                    }),
                ],
            }),
        ],
    })
}
function MenuNotification(){
    const popups = notifications.bind("popups")
    return Widget.Box({
        class_name: "notification-menu",
        vertical: true,
        spacing: 10,
        hexpand: true,
        children: [
            Widget.Label("HOLA"),
            Widget.Label("HOLA"),
            Widget.Label("HOLA"),
            Widget.Label("HOLA"),
            Widget.Label("HOLA"),
            Widget.Label("HOLA"),
            Widget.Label("HOLA"),
            Widget.Label("HOLA"),
            Widget.Label("HOLA"),
            Widget.Label("HOLA"),
            Widget.Label("HOLA"),
            Widget.Label("HOLA"),
            Widget.Label("HOLA"),
            Widget.Label("HOLA"),
        ],
    })
}
function MenuOptions(){
    return Widget.Box({
        class_name: "options-menu",
        spacing: 10,
        hpack: "center",
        hexpand: true,
        children: [
            Widget.Button({
                class_name: "options-menu-btn",
                child: Widget.Icon({
                    icon: "preferences-system-notifications-symbolic",
                    size: 20,
                }),
                onClicked: () => Utils.execAsync(['bash', '-c', '~/.config/ags/panels/launch.sh launchwlogout']),
            }),
            Widget.Button({
                class_name: "options-menu-btn",
                child: Widget.Icon({
                    icon: "preferences-system-notifications-symbolic",
                    size: 20,
                }),
                onClicked: () => Utils.execAsync(['bash', '-c', '~/.config/ags/panels/launch.sh launchwlogout']),
            }),
        ],
    })
}


// layout of the bar
function Top() {
    return Widget.Box({
        spacing: 8,
        children: [
            MenuSidebar(),
        ],
    })
}

function Center() {
    return Widget.Box({
        spacing: 8,
        children: [
            MenuNotification(),
        ],
    })
}

function Bottom() {
    return Widget.Box({
        spacing: 8,
        children: [
            MenuOptions(),
        ],
    })
}

function Sidebar(monitor = 0) {
    return Widget.Window({
        name: WINDOW_NAME, // name has to be unique
        setup: self => self.keybind("Escape", () => {
            App.closeWindow(WINDOW_NAME)
            Utils.execAsync(['bash', '-c', '~/.config/ags/panels/launch.sh launchsidebar'])
        }),
        class_name: "sidebar",
        monitor,
        visible: true,
        anchor: ["top", "right", "bottom"],
        keymode: "exclusive",
        child: Widget.CenterBox({
            class_name: "center-box-sidebar",
            vertical: true,
            start_widget: Top(),
            center_widget: Center(),
            end_widget: Bottom(),
        })
        
    })
}
App.config({
    style: "./stylePanels.css",
    icons: "../assets",
    windows: [
        Sidebar(),

        // you can call it, for each monitor
        // Bar(0),
        // Bar(1)
    ],
    gtkTheme: "Adwaita-dark",
    cursorTheme: "Qogir",
    iconTheme: "Papirus-Light",
    //iconTheme: "MoreWaita",
    closeWindowDelay: {
        "window-name": 500, // milliseconds
    },
})

export { }
