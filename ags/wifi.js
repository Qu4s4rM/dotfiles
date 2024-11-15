const WINDOW_NAME = "wifi-panel"

const iconWifi = Variable("",{
    poll: [1000, `bash -c "~/.config/ags/scripts/network-info.sh geticon"`]
})

const nameWifi = Variable("",{
    poll: [1000, `bash -c "~/.config/ags/scripts/network-info.sh getname"`]
})

const namesWifi = Variable("",{
    poll: [1000, `bash -c "~/.config/ags/scripts/network-info.sh getlistwifi"`]
})
const switchWifi = Variable("",{
    poll: [1000, `bash -c "~/.config/ags/scripts/network-info.sh switchwifi"`]
})


let nameSwitch = null
let passwordSwitch = null

let labelNew = null
Utils.interval(1000, () => {
    labelNew = nameSwitch
})

function Information(){
    return Widget.Box({
        class_name: "information",
        spacing: 10,
        cursor: "text",
        homogeneous: true,
        children: [
            Widget.Label({
                label: "Connected to:",
            }),
            Widget.Label({
                label: nameWifi.bind(),
            }),
            Widget.Button({
                class_name: "switch",
                child: Widget.Icon({
                    icon: switchWifi.bind(),
                    size: 40,
                }),
                onClicked: () => Utils.execAsync(['bash', '-c', 'bash ~/.config/ags/scripts/network-info.sh power']),
            }),
        ],
    })
}

function ListNetworks(){
    return Widget.Box({
        class_name: "list-networks",
        spacing: 10,
        vertical: false,
        cursor: "text",
        homogeneous: true,
        children: [
            Widget.Label({
                label: namesWifi.bind(),
            }),
        ],
    })
}

function ConnectNetwork(){
    return Widget.Box({
        class_name: "connect-network",
        spacing: 10,
        vertical: true,
        hpack: "center",
        hexpand: true,
        children: [
            Widget.Label({
                label: "Ingresa el nombre de la red y ingresa su contraseña",
            }),
            Widget.Entry({
                class_name: "input",
                placeholder_text: 'type here network name',
                visibility: true,
                onChange: ({ text }) => nameSwitch = text,
            }),
            Widget.Entry({
                class_name: "input",
                placeholder_text: 'type here network password',
                visibility: false,
                onChange: ({ text }) => passwordSwitch = text,
            }),
            Widget.Button({
                class_name: "btn-connect",
                child: Widget.Label({
                    label: "Connect",
                }),
                cursor: "pointer",
                onClicked: () => {
                    //Utils.execAsync(['bash', '-c', `nmcli dev wifi connect '${nameSwitch}' password '${passwordSwitch}'`])
                    print(`Conectado a ${nameSwitch} con password ${passwordSwitch}`)
                },
            }),
        ],
    })
}

// layout of the bar
function Top() {
    return Widget.Box({
        spacing: 8,
        children: [
            Information(),
        ],
    })
}

function Center() {
    return Widget.Box({
        spacing: 8,
        children: [
            ConnectNetwork(),
        ],
    })
}

function Bottom() {
    return Widget.Box({
        spacing: 8,
        vertical: true,
        hpack: "start",
        children: [
            Widget.Label("Visible Networks"),
            ListNetworks(),
        ],
    })
}



function Wifi(monitor = 0) {
    return Widget.Window({
        name: WINDOW_NAME, // name has to be unique
        setup: self => self.keybind("Escape", () => {
            App.closeWindow(WINDOW_NAME)
            Utils.execAsync(['bash', '-c', 'bash ~/.config/ags/launch.sh launchwifi'])
        }),
        class_name: "wifi",
        monitor,
        visible: true,
        anchor: ["top", "bottom"],
        keymode: "on-demand",
        child: Widget.Scrollable({
            hscroll: 'never',
            vscroll: 'always',
            css: 'min-width: 500px; padding: 100px;',
            child: Widget.Box({
                class_name: "center-box-wifi",
                vertical: true,
                children: [
                    Top(),
                    Center(),
                    Bottom(),
                ],
            }),
        })
        
    })
}

App.addIcons(`${App.configDir}/assets`)
App.config({
    style: "./styleWidgets.css",
    windows: [
        Wifi(),

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