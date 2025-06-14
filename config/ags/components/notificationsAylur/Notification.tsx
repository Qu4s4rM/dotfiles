import { Variable, GLib, bind } from "astal"
import { Gtk, Astal } from "astal/gtk3"
import { type EventBox } from "astal/gtk3/widget"
import Notifd from "gi://AstalNotifd"
import Variable from "astal/variable"

const isIcon = (icon: string) =>
    !!Astal.Icon.lookup_icon(icon)

const fileExists = (path: string) =>
    GLib.file_test(path, GLib.FileTest.EXISTS)

const time = (time: number, format = "%H:%M") => GLib.DateTime
    .new_from_unix_local(time)
    .format(format)!

const urgency = (n: Notifd.Notification) => {
    const { LOW, NORMAL, CRITICAL } = Notifd.Urgency
    // match operator when?
    switch (n.urgency) {
        case LOW: return "low"
        case CRITICAL: return "critical"
        case NORMAL:
        default: return "normal"
    }
}

type Props = {
    setup(self: EventBox): void
    onHoverLost(self: EventBox): void
    notification: Notifd.Notification
}

export default function Notification(props: Props) {
    const { notification: n, onHoverLost, setup } = props
    const { START, CENTER, END } = Gtk.Align
    const {SLIDE_DOWN, SLIDE_TOP} = Gtk.RevealerTransitionType
    const visible = Variable(false)

    function show(self) {
        if (visible === true) {
            self.revealChild = visible.get()
            self.transitionType = SLIDE_TOP
        } else {
            self.revealChild = visible.get()
            self.transitionType = SLIDE_DOWN
        }
    }
    const iconArrow = Variable("arrow-right-symbolic")
    const toggleIcon = () => {
        const current = iconArrow.get()
        const next = current === "arrow-right-symbolic"
            ? "arrow-down-symbolic"
            : "arrow-right-symbolic"

        iconArrow.set(next)
        visible.set(current === "arrow-right-symbolic")
    }

    return <eventbox
        className={`Notification ${urgency(n)}`}
        setup={setup}
        onHoverLost={onHoverLost}>
        <box vertical>
            <box className="header">
                {(n.appIcon || n.desktopEntry) && <icon
                    className="app-icon"
                    visible={Boolean(n.appIcon || n.desktopEntry)}
                    icon={n.appIcon || n.desktopEntry}
                />}
                <label
                    className="app-name"
                    halign={START}
                    truncate
                    label={n.appName || "Unknown"}
                />
                <label
                    className="time"
                    hexpand
                    halign={END}
                    label={time(n.time)}
                />
                <button cursor="pointer" onClicked={() => n.dismiss()}>
                    <icon icon="window-close-symbolic" />
                </button>
            </box>
            <Gtk.Separator visible />
            <box className="content">
                {n.image && fileExists(n.image) && <box
                    valign={START}
                    className="image"
                    css={`background-image: url('${n.image}')`}
                />}
                {n.image && isIcon(n.image) && <box
                    expand={false}
                    valign={START}
                    className="icon-image">
                    <icon icon={n.image} expand halign={CENTER} valign={CENTER} />
                </box>}
                <box vertical hexpand>
                    <label
                        className="summary"
                        halign={START}
                        xalign={0}
                        label={n.summary}
                        truncate
                        wrap
                    />
                    <revealer
                    setup={self => show(self)}
                    revealChild={visible()}
                    >
                        {n.body && <label
                            className="body"
                            wrap
                            useMarkup
                            halign={START}
                            xalign={0}
                            justifyFill
                            label={n.body}
                        />}
                    </revealer>
                </box>
                <box>
                    <button cursor="pointer" className="btn-expand" onClick={
                        ()=> {
                            toggleIcon()
                        }
                    }>
                        <icon icon={bind(iconArrow)} />
                    </button>
                </box>
            </box>
            {n.get_actions().length > 0 && <box className="actions">
                {n.get_actions().map(({ label, id }) => (
                    <button
                        hexpand
                        onClicked={() => n.invoke(id)}>
                        <label label={label} halign={CENTER} hexpand />
                    </button>
                ))}
            </box>}
        </box>
    </eventbox>
}