from darius.server.routes import SocketView,View
import json,darius.client_side.status as status
import pprint,os
from PIL import Image
from .sql import db

DB_PATH = db.DB_PATH("database.db")

Database = db.Database(DB_PATH)
Users = db.User(Database)

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

class UserCreation(View):
    def POST(self, request, **kwargs):
        username = request[1].get("username")
        password = request[1].get("password")
        avatar = request[1].get("avatar")


        # One of the post data was none
        if(None in (username,password,avatar)):
            return status.HttpJson().__call__("Username or password or avatar was none, cannot proceed.",400)

        Database.create_cursor()
        print(Users.user_exists(username))

        # if(not )
        
                # try:
        #     img = img.open(avatar['data'])
        # except:
        #     return status.HttpJson().__call__("File was not identified as an image",400)
        # img = img.resize((126,126))


        # return status.HttpJson().__call__("hello world",200)
        

class StaticImageHandler(View):
    def GET(self,request,**kwargs):
        target_path = j(os.getcwd(),"source",*request[0].get("uri").split("/"))
        if(os.path.exists(target_path)):
            return status.HttpBinary().__call__(target_path,200,display_in_browser=True)
        return status.HttpJson().__call__({'error' : "404 Not Found"},404)