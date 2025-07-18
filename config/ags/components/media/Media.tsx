import { App, Astal, Gdk, Gtk } from "astal/gtk3"
import { Variable, bind } from "astal"
import { interval,timeout } from "astal/time"
import { safeExecAsync } from "../../utils/exec"
import { show } from "../../utils/revealer"
import { BOTTOM, LEFT} from "../../utils/initvars"
import { SLIDE_RIGHT} from "../../utils/initvars"
import { IGNORE } from "../../utils/initvars"
import { END, START } from "../../utils/initvars"

export const mediaWindowName = "media"
export const visibleMedia= Variable(false)

import { title } from "../bar/BarTop"
import { artist } from "../bar/BarTop"
import { iconApp } from "../bar/BarTop"

export const lengthMusic = Variable("")
export const lengthMusicRaw = Variable(0)
export const position = Variable("")
export const positionRaw = Variable(0)
export const iconPlay = Variable("")
export const image = Variable("")

let lastTitle = ""
let lastLengthRaw = 0

interval(2000, () => {
    safeExecAsync(["bash", "-c", "~/.config/ags/scripts/music.sh getposition"]).then(val => position.set(val.trim()))
    safeExecAsync(["bash", "-c", "~/.config/ags/scripts/music.sh getpositionraw"]).then(val => positionRaw.set(Number(val.trim())))
    safeExecAsync(["bash", "-c", "~/.config/ags/scripts/music.sh geticonplay"]).then(val => iconPlay.set(val.trim()))
    safeExecAsync(["bash", "-c", "~/.config/ags/scripts/music.sh getlengthraw"]).then(val => {
        const lenRaw = Number(val.trim())
        if (lenRaw !== lastLengthRaw) {
            lastLengthRaw = lenRaw
            lengthMusicRaw.set(lenRaw)
            safeExecAsync(["bash", "-c", "~/.config/ags/scripts/music.sh getlength"]).then(val => lengthMusic.set(val.trim()))
        }
    })
    if (title.get() != lastTitle) {
        lastTitle = title.get()
        safeExecAsync(["bash", "-c", "~/.config/ags/scripts/music.sh getimage"]).then(val => image.set(val.trim()))
    }
})
function MediaLabels() {
    return <box className="media-box" vertical>
        <centerbox>
            <label label={bind(title)} halign={START}/>
            <label label=" "/>
            <icon halign={END}
                className="media-icon"
                icon={bind(iconApp)}
            />
        </centerbox>
        <box>
            <label label={bind(artist)} halign={START}/>
        </box>
    </box>
}
function CoverArt() {
    return <centerbox className="cover-art">
        <box css={bind(image).as(v => `background-image: url('${v}');`)}/>
    </centerbox>
}
function Time() {
    return <centerbox>
        <slider
            value={bind(positionRaw)}
            max={bind(lengthMusicRaw)}
            onDragged={self => {
                const newValue = Math.round(self.value)
                safeExecAsync([
                    "bash", "-c",
                    `bash ~/.config/ags/scripts/music.sh seek ${newValue}`
                ])
            }}
            widthRequest={100}  // Controlamos el tamaño del slider
            heightRequest={10}  // Alto del slider
        />
    </centerbox>
}
function Control() {
    return <centerbox className="control" hexpand>
        <label label={bind(position)} />
        <centerbox>
            <button className="control-play" cursor="pointer" onClicked={
                () => {
                    safeExecAsync(["bash", "-c", "~/.config/ags/scripts/music.sh previous"])
                }
            } >
                <icon
                    className="control-play-icon"
                    icon="media-skip-backward-symbolic"
                />
            </button>
            <button className="control-play" cursor="pointer" onClicked={
                () => {
                    safeExecAsync(["bash", "-c", "~/.config/ags/scripts/music.sh playorpause"])
                }
            } >
                <icon
                    className="control-play-icon"
                    icon={bind(iconPlay)}
                />
            </button>
            <button className="control-play" cursor="pointer" onClicked={
                () => {
                    safeExecAsync(["bash", "-c", "~/.config/ags/scripts/music.sh next"])
                }
            } >
                <icon
                    className="control-play-icon"
                    icon="media-skip-forward-symbolic"
                />
            </button>
        </centerbox>
        <label label={bind(lengthMusic)} />
    </centerbox>
}
function MediaBox () {
    return <centerbox className="revealer-box">
        <box>
            <CoverArt />
        </box>
        <centerbox className="media-menu" vertical>
            <MediaLabels />
            <Time />
            <Control />
        </centerbox>
    </centerbox>
}

function OnRevealer ({ visible }: { visible: Variable<boolean> }) {   
    return <revealer
        setup={self => show(self, visible)}
        revealChild={visibleMedia()}
        transitionType={SLIDE_RIGHT}
        transitionDuration={100}>
        <MediaBox />
    </revealer>
}

export default function Media(monitor: Gdk.Monitor) {
    if (!monitor) {
        const display = Gdk.Display.get_default()
        monitor = display?.get_primary_monitor()
    }
    return <window
        className={mediaWindowName}
        name={mediaWindowName}
        application={App}
        gdkmonitor={monitor}
        layer={Astal.Layer.OVERLAY}
        anchor={BOTTOM | LEFT}
        marginBottom="14"
        marginLeft="14"
        setup={self => {
            if (!visibleMedia.get()) {
                self.hide()
            }
        }}
        >
        <eventbox onHoverLost={
            ()=> {
                safeExecAsync(["bash", "-c", "~/.config/ags/launch.sh media"])
            }
        }>
            <centerbox>
                <OnRevealer visible={visibleMedia} />
            </centerbox>
        </eventbox>
        
    </window>
}