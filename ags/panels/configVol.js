const WINDOW_NAME = "osd"

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
