from darius.server.routes import SocketView,View
from darius.Parsing.http import AppendHeaders
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
        name = 1;img = 2

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

def AcessDB(view : callable):
    def wrapper(*args,**kwargs):
        Database.create_cursor()
        return view(*args,**kwargs)
    return wrapper

class UserCreation(View):

    @AcessDB
    def GET(self, request, **kwargs):
        Database.create_cursor()
        username = request[0].get("username")
        if(Users.user_exists(username)):
            s = {"error" : "Username {} already exists.".format(username)}
        else:
            s = {'ok' : "Username {} is available".format(username)}
        response = status.HttpJson().__call__(s,200)
        response = AppendHeaders(response,{"Access-Control-Allow-Headers" : "username"})
        return response

    def OPTIONS(self, request, **kwargs):
        return self.GET(request, **kwargs)

    def POST(self, request, **kwargs):
        username = request[1].get("username")
        password = request[1].get("password")
        avatar = request[1].get("avatar")

        pprint.pprint(username)
        pprint.pprint(password)
    
        # One of the post data was none
        if(None in (username,password,avatar)):
            return status.HttpJson().__call__({"error" : "Username or password or avatar was none, cannot proceed."},400)

        username = username['data'].read();__usr__ = len(username)
        password = username['data'].read()

        if(__usr__ > 16):
            return status.HttpJson().__call__({"error" : "Username too long, must be at most 16 (not {}) ".format(__usr__)},400)   

        if(1 < len(password) < 100):
            return status.HttpJson().__call__({"error" : "Password too long, try changing it to something smaller"},400)   

        if Users.user_exists(username['data'].read()):
            return status.HttpJson().__call__({"error" : "Username {} already exists.".format(username)},400)

        try:
            img = Image.open(avatar['data'].read())
            img = img.resize((128,128))
            path = s(db.hx(db.rn(2,12)))
            img.save(path)
        except:
            return status.HttpJson().__call__({'error' : "Could not identify file {} as an image.".format(avatar['filename'])},400)

        Users.create(username,password,f'static/avatars/{path}')
        token = Users.create_token(
            Users.id(username)
        )
        return status.HttpJson().__call__({
            "username" : username,
            "password" : password,
            "img" : f'static/avatars/{path}',
            "token" : token
        },200)

class StaticImageHandler(View):
    def GET(self,request,**kwargs):
        target_path = j(os.getcwd(),"source",*request[0].get("uri").split("/"))
        if(os.path.exists(target_path)):
            return status.HttpBinary().__call__(target_path,200,display_in_browser=True)
        return status.HttpJson().__call__({'error' : "404 Not Found"},404)