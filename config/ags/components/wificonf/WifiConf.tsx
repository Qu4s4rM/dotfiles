import { App, Astal, Gdk, Gtk } from "astal/gtk3"
import Variable from "astal/variable"
import { bind } from "astal"
import { safeExecAsync } from "../../utils/exec"
import { SLIDE_DOWN, START, CENTER, END, countSeconds } from "../../utils/initvars"
import { networks } from "./networks"
import { show } from "../../utils/revealer"

const iconWifi = Variable("").poll(countSeconds(5), ["bash", "-c", "~/.config/ags/scripts/network-info.sh geticon"])
const status = Variable("").poll(countSeconds(5), ["bash", "-c", "~/.config/ags/scripts/network-info.sh status"])
const name = Variable("").poll(countSeconds(5), ["bash", "-c", "~/.config/ags/scripts/network-info.sh getname"])
const networkstatus = Variable("").poll(countSeconds(5), ["bash", "-c", "~/.config/ags/scripts/network-info.sh networkstatus"])


const net = Variable("")
const passwdnet = Variable("")

function connect() {
    safeExecAsync(["bash", "-c", `nmcli dev wifi connect "${net.get()}" password "${passwdnet.get()}"`])
}


function OnRevealer ({ visible }: { visible: Variable<boolean> }) {
    const value = Variable(1)
    
    return <revealer
        setup={self => show(self, visible)}
        revealChild={visible()}
        transitionType={SLIDE_DOWN}
        transitionDuration={100}>
        <box className="wificonf-box" vertical> 
            <box vertical>
                <box className="current" vertical>
                    <label label="Current network" halign={START}/>
                    <box>
                        <icon icon={bind(iconWifi)} />
                        <box vertical>
                            <label className="label-1" label={bind(name)} halign={START}/>
                            <label className="label-2" label={bind(networkstatus)} halign={START}/>
                        </box>
                    </box>
                </box>
                <box className="nets" orientation={1} hexpand>
                    <label label="Available networks" hexpand halign={Gtk.Align.START}/>
                    {networks.map((i) => {
                        return (<button cursor="pointer" onClicked={()=> {
                            safeExecAsync(["bash", "-c", `echo -n ${i.bssid} | wl-copy `])
                        }}>
                            <box>
                                <icon icon={bind(iconWifi)} />
                                <label label={i.name} maxWidthChars={24} wrap />
                            </box>
                        </button>
                        )
                    })}
                </box>
                <box className="connect" orientation={1} hexpand>
                    <label label="Connect to network" halign={START}/>
                    <box orientation={1}>
                        <entry 
                            placeholder-text="Enter BSSID" 
                            halign={Gtk.Align.CENTER}
                            onChanged={e => net.set(e.text)} />
                        <entry 
                            placeholder-text="Enter Password" 
                            halign={Gtk.Align.CENTER}
                            onChanged={e => passwdnet.set(e.text)} />
                    </box>
                    <button cursor="pointer" onClicked={connect}>
                        Connect
                    </button>
                </box>
            </box>
        </box>
    </revealer>
    
}
export default function WifiConf ({ config }: { config: Variable<boolean> }) {
    const visible = config
    return <OnRevealer visible={visible} />
}
