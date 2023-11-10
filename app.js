import  {CallMonitor}  from "./src/callMonitor.js"
import  {GiveRole}  from "./src/reactionRole.js"
import  {NotifyNewMember}  from "./src/notifyNewMember.js"

const app = () => {
    CallMonitor()
    GiveRole()
    NotifyNewMember()
}

app()
