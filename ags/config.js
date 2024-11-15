const hyprland = await Service.import("hyprland")
const notifications = await Service.import("notifications")
const mpris = await Service.import("mpris")
const audio = await Service.import("audio")
const battery = await Service.import("battery")

const percentageBattery = Variable("",{
    poll: [1000, `bash -c "~/.config/ags/scripts/battery-info.sh getpercentage"`]
})
const iconBattery = Variable("",{
    poll: [1000, `bash -c "~/.config/ags/scripts/battery-info.sh geticon"`]
})
const date = Variable("", {
    poll: [1000, 'date "+%H:%M"'],
})
const point = Variable(" · ")
const calendar = Variable("", {
    poll: [1000, 'date "+%A, %d/%m"'],
})
const iconWifi = Variable("",{
    poll: [1000, `bash -c "~/.config/ags/scripts/network-info.sh geticon"`]
})
const iconBluetooth = Variable("",{
    poll: [1000, `bash -c "~/.config/ags/scripts/bluetooth-info.sh geticon"`]
})

// widgets can be only assigned as a child in one container
// so to make a reuseable widget, make it a function
// then you can simply instantiate one by calling it
function Workspaces() {
    const activeId = hyprland.active.workspace.bind("id")
    const dispatch = ws => hyprland.messageAsync(`dispatch workspace ${ws}`);
    const workspaces = hyprland.bind("workspaces")
        .as(ws => ws.map(({ id }) => Widget.Button({
            onScrollUp: () => dispatch('+1'),
            onScrollDown: () => dispatch('-1'),
            child: Widget.Label(`${id}`),
            class_name: activeId.as(i => `${i === id ? "focused" : ""}`),
            cursor: "pointer",
            onClicked: () => hyprland.messageAsync(`dispatch workspace ${id}`),
        })))

    return Widget.Box({
        class_name: "workspaces",
        children: workspaces,
    })
}
function Clock() {
    return Widget.Box({
        class_name: "clock",
        children: [
            Widget.Label ({
                class_name: "clock-time",
                label: date.bind(),
            }),
            Widget.Label ({
                class_name: "clock-point",
                label: point.bind(),
            }),
            Widget.Label ({
                class_name: "clock-calendar",
                label: calendar.bind(),
            }),
        ]
    })
}

function AppLauncher() {
    return Widget.Box({
        class_name: "app-launcher-box",
        homogeneous: false,
        vertical: true,
        children: [
            Widget.Label ({
                class_name: "domain",
                label: "h4ckr1ft.org.co"
            }),
            Widget.Button({
                class_name: "app-launcher-btn",
                hpack: "start",
                cursor: "pointer",
                child: Widget.Label('Apps'),
                onClicked: () => Utils.execAsync(['bash', '-c', 'bash ~/.config/rofi/launcher/launch.sh'])
                    .then(out => print(out))
                    .catch(err => print(err)),
            }),
        ]
    })
}


// we don't need dunst or any other notification daemon
// because the Notifications module is a notification daemon itself
function Notification() {
    const popups = notifications.bind("popups")
    return Widget.Box({
        class_name: "notification",
        visible: popups.as(p => p.length > 0),
        children: [
            Widget.Icon({
                icon: "preferences-system-notifications-symbolic",
            }),
            Widget.Label({
                label: popups.as(p => p[0]?.summary || ""),
            }),
        ],
    })
}


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


function Volume() {
    const icons = {
        101: "overamplified",
        67: "high",
        34: "medium",
        1: "low",
        0: "muted",
    }

    function getIcon() {
        const icon = audio.speaker.is_muted ? 0 : [101, 67, 34, 1, 0].find(
            threshold => threshold <= audio.speaker.volume * 100)

        return `audio-volume-${icons[icon]}-symbolic`
    }

    const icon = Widget.Icon({
        icon: Utils.watch(getIcon(), audio.speaker, getIcon),
    })

    const slider = Widget.Slider({
        hexpand: true,
        draw_value: false,
        on_change: ({ value }) => audio.speaker.volume = value,
        setup: self => self.hook(audio.speaker, () => {
            self.value = audio.speaker.volume || 0
        }),
    })

    return Widget.Box({
        class_name: "volume",
        css: "min-width: 180px",
        children: [icon, slider],
    })
}

function MenuShortcuts() {
    return Widget.Box({
        class_name: "menu-shortcuts",
        spacing: 4,
        children: [
            Widget.Button({
                class_name: "menu-shortcuts-btn",
                cursor: "pointer",
                child: Widget.Icon({
                    class_name: "menu-shortcuts-btn-icon", 
                    icon: 'org.flameshot.Flameshot',
                    size: 12,
                }),
                onClicked: () => Utils.execAsync(['bash', '-c', 'flameshot gui'])
                    .then(out => print(out))
                    .catch(err => print(err)),
            }),
            Widget.Button({
                class_name: "menu-shortcuts-btn",
                cursor: "pointer",
                child: Widget.Icon({
                    class_name: "menu-shortcuts-btn-icon", 
                    icon: 'color-picker-2',
                    size: 12,
                }),
                onClicked: () => Utils.execAsync(['bash', '-c', 'hyprpicker -f hex | cat | wl-copy'])
                    .then(out => print(out))
                    .catch(err => print(err)),
            }),
            Widget.Button({
                class_name: "menu-shortcuts-btn",
                cursor: "pointer",
                child: Widget.Icon({
                    class_name: "menu-shortcuts-btn-icon", 
                    icon: 'input-keyboard-symbolic',
                    size: 12,
                }),
                onClicked: () => Utils.execAsync(['bash', '~/.config/ags/launchss.sh'])
                    .then(out => print(out))
                    .catch(err => print(err)),
            }),
        ],
    })
}
function BatteryHealth() {
    /*const icon = percentageBattery.bind("value").as(p =>
        `battery-level-${Math.floor(p / 6 * 6)}`
    )*/

    return Widget.Box({
        class_name: "battery-box",
        spacing: 4,
        children: [
            Widget.Icon({
                class_name: "battery-box-btn-icon", 
                icon: iconBattery.bind(),
                size: 20,
            }),
            Widget.Label({
                label: percentageBattery.bind(),
            }),
        ],
    })
}


function Menu() {
    return Widget.Button({
        class_name: "menu-box",
        cursor: "pointer",
        child: Widget.Box({
            spacing: 8,
            children: [
                Widget.Icon({
                    class_name: "menu-box-icon",
                    icon: 'notification-indicator-normal',
                    size: 18,
                }),
                Widget.Icon({
                    class_name: "menu-box-icon",
                    icon: iconBluetooth.bind(),
                    size: 18,
                }),
                Widget.Icon({
                    class_name: "menu-box-icon",
                    icon: iconWifi.bind(),
                    size: 18,
                }),
            ],
        }),
        onClicked: () => Utils.execAsync(['bash', '-c', 'bash ~/.config/ags/launch.sh launchsidebar'])
                    .then(out => print(out))
                    .catch(err => print(err)),
    })
}





// layout of the bar
function Left() {
    return Widget.Box({
        spacing: 8,
        children: [
            AppLauncher(),
            Workspaces(),
        ],
    })
}

function Center() {
    return Widget.Box({
        spacing: 8,
        children: [
            MenuShortcuts(),
            Clock(),
            BatteryHealth(),
        ],
    })
}

function Right() {
    return Widget.Box({
        hpack: "end",
        spacing: 8,
        children: [
            Menu(),
        ],
    })
}

function Bar(monitor = 0) {
    return Widget.Window({
        name: `bar-${monitor}`, // name has to be unique
        class_name: "bar",
        monitor,
        anchor: ["top", "left", "right"],
        exclusivity: "exclusive",
        child: Widget.CenterBox({
            start_widget: Left(),
            center_widget: Center(),
            end_widget: Right(),
        }),
    })
}
function CornerScreen(monitor = 0) {
    return Widget.Window({
        name: `corner-${monitor}`, // name has to be unique
        class_name: "corner-screen",
        monitor,
        anchor: ["top", "left", "right"],
        exclusivity: "normal",
        child: Widget.CenterBox({
            start_widget: Widget.Box({
                class_name: "box-start",
                spacing: 8,
                children: [
                    Widget.Icon({
                        icon: "cornerscreenleft",
                        size: 20,
                    }),
                ],
            }),
            end_widget: Widget.Box({
                class_name: "box-end",
                spacing: 8,
                hpack: "end",
                children: [
                    Widget.Icon({
                        icon: "cornerscreenright",
                        size: 20,
                    }),
                ],
            }),
        }),
    })
}

App.addIcons(`${App.configDir}/assets`)

App.config({
    style: "./style.css",
    windows: [
        Bar(), 
        CornerScreen(),

        // you can call it, for each monitor
        // Bar(0),
        // Bar(1)
    ],
    gtkTheme: "Adwaita-dark",
    cursorTheme: "Qogir",
    iconTheme: "Papirus",
    //iconTheme: "MoreWaita",
    closeWindowDelay: {
        "window-name": 500, // milliseconds
    },
})

export { }
