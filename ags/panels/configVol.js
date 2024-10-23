const hyprland = await Service.import("hyprland")
const notifications = await Service.import("notifications")
const mpris = await Service.import("mpris")
const audio = await Service.import("audio")
const battery = await Service.import("battery")
const systemtray = await Service.import("systemtray")

const WINDOW_NAME = "osd"


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
    const value = Variable(Utils.exec(`bash -c "amixer -D pulse get Master | grep '%' | head -n 1 | cut -d '[' -f 2 | cut -d '%' -f 1"`))
    const slider =  Widget.Slider({
        class_name: "slider-vol",
        cursor: "pointer",
        vertical: true,
        hexpand: true,
        draw_value: false,
        min: 1,
        max: 100,
        /*
        on_change: ({ value }) => audio.speaker.volume = value,
        setup: self => self.hook(audio.speaker, () => {
            self.value = audio.speaker.volume || 0
        }),
        */
        value: value.bind(),
        onChange: ({ value }) => Utils.exec(`bash -c "amixer -D pulse sset Master ${value}% > /dev/null"`),
    })

    return Widget.Box({
        class_name: "volume",
        vertical: false,
        children: [
            Widget.Label({
                label: Utils.exec(`bash -c "amixer -D pulse get Master | grep '%' | head -n 1 | cut -d '[' -f 2 | cut -d '%' -f 1"`),
            }),
            slider,
        ],
    })
}




// layout of the bar
function Left() {
    return Widget.Box({
        spacing: 8,
        children: [
            Media(),
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
        class_name: "box-vol",
        spacing: 8,
        children: [
            Volume(),
        ],
    })
}

function Panel(monitor = 0) {
    return Widget.Window({
        name: WINDOW_NAME, // name has to be unique
        setup: self => self.keybind("Escape", () => {
            App.closeWindow(WINDOW_NAME)
            //const value = Utils.exec(`bash -c "amixer -D pulse sset Master 10%+ > /dev/null"`)
            //console.log(value)
            Utils.execAsync(['bash', '-c', '~/.config/ags/panels/launch.sh launchvol'])
        }),
        class_name: "osd",
        monitor,
        visible: true,
        anchor: ["top", "right", "bottom"],
        keymode: "exclusive",
        child: Widget.CenterBox({
            end_widget: Right(),
        }),
    })
}
App.config({
    style: "./stylePanels.css",
    icons: "../assets",
    windows: [
        Panel(),

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
