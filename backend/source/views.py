from darius.server.routes import SocketView,View
import json,darius.client_side.status as status
import pprint,os
from PIL import Image

STATIC_FILES = os.path.join(
    os.getcwd(),"source","static",
)

s = lambda *args : os.path.join(STATIC_FILES,*args)
j = os.path.join

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
        if(len(request[-1]) > 2):
            return status.HttpJson().__call__({"error" : "More than 2 form data was sent."},403)
        
        s_0 = 0
        for item in request[-1]:
            if('filename' in item):
                s_0 += 1
                img_name = item['filename']
                try:
                    img = Image.open(item['data'])
                except:
                    return status.HttpJson().__call__({"error" : "File was not identified as an image."},400)
                img = img.resize((126,126))
                img.save(s('avatars',img_name))
            else:
                s_0 += 1
                name = item['data'].read()
                name = name[1:len(name)-5]

        if(s_0 != 2):
            return status.HttpJson().__call__({"error" : "No Image or Username Was Provided."},400)

        response = status.HttpJson().__call__({
            "username" : name,
            "img" : f"/static/avatars/{name}"
        },200)
        return response

class StaticImageHandler(View):
    def GET(self,request,**kwargs):
        target_path = j(os.getcwd(),"source",*request[0].get("uri").split("/"))
        if(os.path.exists(target_path)):
            return status.HttpBinary().__call__(target_path,200,display_in_browser=True)
        return status.HttpJson().__call__({'error' : "404 Not Found"},404)