import { Gtk } from "astal/gtk3"
import Notifd from "gi://AstalNotifd"
import Notification from "../notificationsAylur/Notification"
import { type Subscribable } from "astal/binding"
import { Variable, bind, timeout } from "astal"
import { show } from "../../utils/revealer"
import { safeExecAsync } from "../../utils/manage"


const percentageFloat = Variable("").poll(1000, ["bash", "-c", "~/.config/ags/scripts/battery-info.sh getsum"])

// see comment below in constructor
const TIMEOUT_DELAY = 5000/*
onInterval(percentageFloat)
let onInterval = function ({percentage}) {

}

let interval = setInterval(onInterval, 1000)*/
let reload = function () {
    if (percentageFloat.get() == 1) {
        safeExecAsync(["bash", "-c", `notify-send "Charging" "La bateria se cargó correctamente" -u normal`])
        stop()
        setTimeout(()=> {
            ready()
        }, 60000)
    } else if (percentageFloat.get() == 0.15){
        safeExecAsync(["bash", "-c", `notify-send "Discharging" "Conecte el cargador, queda poca bateria" -u critical`])
        stop()
        setTimeout(()=> {
            ready()
        }, 60000)
    } else {
        stop()
        ready()
    }
}

let intervalPercentage = setInterval(reload, 1000)

function stop () {
    clearInterval(intervalPercentage)
}

function ready () {
    intervalPercentage = setInterval(reload, 1000)
}




// The purpose if this class is to replace Variable<Array<Widget>>
// with a Map<number, Widget> type in order to track notification widgets
// by their id, while making it conviniently bindable as an array
class NotifiationMap implements Subscribable {
    // the underlying map to keep track of id widget pairs
    private map: Map<number, Gtk.Widget> = new Map()

    // it makes sense to use a Variable under the hood and use its
    // reactivity implementation instead of keeping track of subscribers ourselves
    private var: Variable<Array<Gtk.Widget>> = Variable([])

    // notify subscribers to rerender when state changes
    private notifiy() {
        this.var.set([...this.map.values()].reverse())
    }

    constructor() {
        const notifd = Notifd.get_default()

        /**
         * uncomment this if you want to
         * ignore timeout by senders and enforce our own timeout
         * note that if the notification has any actions
         * they might not work, since the sender already treats them as resolved
         */
        // notifd.ignoreTimeout = true

        notifd.connect("notified", (_, id) => {
            this.set(id, Notification({
                notification: notifd.get_notification(id)!,

                // once hovering over the notification is done
                // destroy the widget without calling notification.dismiss()
                // so that it acts as a "popup" and we can still display it
                // in a notification center like widget
                // but clicking on the close button will close it
                onHoverLost: () => {}, //this.delete(id),

                // notifd by default does not close notifications
                // until user input or the timeout specified by sender
                // which we set to ignore above
                setup: () => timeout(TIMEOUT_DELAY, () => {
                    /**
                     * uncomment this if you want to "hide" the notifications
                     * after TIMEOUT_DELAY
                     */
                    //this.delete(id)
                })
            }))
        })

        // notifications can be closed by the outside before
        // any user input, which have to be handled too
        notifd.connect("resolved", (_, id) => {
            this.delete(id)
        })
    }

    private set(key: number, value: Gtk.Widget) {
        // in case of replacecment destroy previous widget
        this.map.get(key)?.destroy()
        this.map.set(key, value)
        this.notifiy()
    }

    private delete(key: number) {
        this.map.get(key)?.destroy()
        this.map.delete(key)
        this.notifiy()
    }

    // needed by the Subscribable interface
    get() {
        return this.var.get()
    }

    // needed by the Subscribable interface
    subscribe(callback: (list: Array<Gtk.Widget>) => void) {
        return this.var.subscribe(callback)
    }
}

function NotificationWidget() {
    const notifs = new NotifiationMap()
    return <centerbox vertical className="revealer-box notification-box" expand>
        <scrollable vscroll={true} heightRequest={550} widthRequest={250} vexpand>
            <box className="box" vertical expand noImplicitDestroy>
                {bind(notifs)}
            </box>
        </scrollable>
    </centerbox>
}

function OnRevealer ({ visible }: { visible: Variable<boolean> }) {
    return <revealer expand
        setup={self => show(self, visible)}
        revealChild={visible()}>
        <NotificationWidget />
    </revealer>
    
}
export default function NotificationConfig ({ config }: { config: Variable<boolean> }) {
    const visible = config
    return <OnRevealer visible={visible} />
}
