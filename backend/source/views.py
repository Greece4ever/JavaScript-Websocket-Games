from darius.server.routes import SocketView,View
import json,darius.client_side.status as status
import pprint
from PIL import Image

class Drawing(SocketView):
    def onConnect(self,client,**kwargs):
        send = kwargs.get('send_function') 
        clients = kwargs.get("path_info")['clients']
        c__len__ = len(clients) 
        self.accept(client,kwargs.get("key"))
        if(c__len__ > 4):
            return send(client,{"error" : "Maximum Number of plays are connected to the server"})
        name = 1
        img = 2

        connect_msg = {
            'type' : 0,
            'cnum' : len(clients),
            'name' : [[name,img]],
            'img' : img}
        
        for client in clients:
            client.send(json.loads(connect_msg))
        
        connect_msg['name'].extend(
            [[cli['name'],cli['img']] for cli in clients]
        )

        return {"name" : name,"img" : img}

class AvatarUpload(View):
    def POST(self,request,**kwargs):
        # pprint.pprint(request)
        for item in request[-1]:
            if('filename' in item):
                name = item['filename']
                try:
                    img = Image.open(item['data'])
                except:
                    return status.HttpJson().__call__({"error" : "Could not identify image type"},400)
                print(name,img)
        # img = Image.frombytes()
        return status.HttpJson().__call__({
            "ok" : 1
        },200)