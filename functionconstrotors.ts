export class ServerResponse<T>{
    ResultSet: T
    ServerMsg: string
    ServerMsgLangCode: string
    ServerMsgType: string
    /**
     *
     */
    constructor(obj:any) {
        this.ResultSet=obj.ResultSet;
        this.ServerMsg=obj.ServerMsg;
        this.ServerMsgLangCode=obj.ServerMsgLangCode;
        this.ServerMsgType=obj.ServerMsgType;
    }
}