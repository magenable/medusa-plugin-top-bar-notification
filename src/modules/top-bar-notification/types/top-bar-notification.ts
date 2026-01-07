import TextPosition from "./text-position"

type TopBarNotification = {
    id: string,
    enabled: boolean,
    name: string,
    priority: number,
    content: string,
    textPosition: TextPosition,
    backgroundColor: string,
    textColor: string,
    textSize: number,
    paddingSize: number,
}

export default TopBarNotification
