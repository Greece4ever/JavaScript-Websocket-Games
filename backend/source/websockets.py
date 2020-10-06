from darius.server.routes import SocketView
import pprint

class Drawing(SocketView):
    def onConnect(self,client,**kwargs):
        # self.accept(client,kwargs.get("key"))
        self.accept(client)
        self.send(client,"Hello world!")
        for cli in self.clients:
            self.send(cli,"Hello world!")

        return 1
        # cookie = kwargs.get("headers").get("Cookie")
        # for c in cookie:
        #     if('DARIUSESSIONID' in cookie):
        #         key = c.split("=")[-1]
        # if(cookie is None): return

    # def onMessage(self,**kwargs):
    #     clients = kwargs.get("path_info")['clients']
    #     data = kwargs.get("data")
    #     send = kwargs.get('send_function') 
    #     for client in clients:
    #         send(client,kwargs.get("data"))

    def onExit(self, client , **kwargs):    
        5+'5'