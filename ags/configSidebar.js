const notifications = await Service.import("notifications")

const WINDOW_NAME = "sidebar"

const iconWifi = Variable("",{
    poll: [1000, `bash -c "~/.config/ags/scripts/network-info.sh geticon"`]
})
const nameWifi = Variable("",{
    poll: [1000, `bash -c "~/.config/ags/scripts/network-info.sh getname"`]
})
const iconBluetooth = Variable("",{
    poll: [1000, `bash -c "~/.config/ags/scripts/bluetooth-info.sh geticon"`]
})
const nameBluetooth = Variable("",{
    poll: [1000, `bash -c "~/.config/ags/scripts/bluetooth-info.sh getname"`]
})

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
                        child: Widget.Box({
                            spacing: 10,
                            children: [
                                Widget.Icon({
                                    icon: iconWifi.bind(),
                                    size: 18,
                                }),
                                Widget.Label({
                                    label: nameWifi.bind(),
                                }),
                            ],
                        }),
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
                        child: Widget.Box({
                            spacing: 10,
                            children: [
                                Widget.Icon({
                                    icon: iconBluetooth.bind(),
                                    size: 18,
                                }),
                                Widget.Label({
                                    label: nameBluetooth.bind(),
                                }),
                            ],
                        }),
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
                onClicked: () => Utils.execAsync(['bash', '-c', 'bash ~/.config/ags/launch.sh launchwlogout']),
            }),
            Widget.Button({
                class_name: "options-menu-btn",
                child: Widget.Icon({
                    icon: "preferences-system-notifications-symbolic",
                    size: 20,
                }),
                onClicked: () => Utils.execAsync(['bash', '-c', 'bash ~/.config/ags/launch.sh launchwlogout']),
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
            Utils.execAsync(['bash', '-c', 'bash ~/.config/ags/launch.sh launchsidebar'])
        }),
        class_name: "sidebar",
        monitor,
        visible: true,
        anchor: ["top", "right", "bottom"],
        keymode: "on-demand",
        child: Widget.CenterBox({
            class_name: "center-box-sidebar",
            vertical: true,
            start_widget: Top(),
            center_widget: Center(),
            end_widget: Bottom(),
        })
        
    })
}
App.addIcons(`${App.configDir}/assets`)
console.log(`../${App.configDir}`)
App.config({
    style: "./stylePanels.css",
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
