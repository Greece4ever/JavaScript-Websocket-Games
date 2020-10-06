from darius.server.routes import SocketView,View
from darius.Parsing.http import AppendHeaders
from darius.Parsing.http import decodeURI
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


def AcessDB(view : callable):
    """Decorator that allows access to the Database"""
    def wrapper(*args,**kwargs):
        Database.create_cursor()
        return view(*args,**kwargs)
    return wrapper

def AllowHeaders(header : str):
    def decorator(view : callable):
        def wrapper(*args,**kwargs):
            return AppendHeaders(view(*args,**kwargs),{"Access-Control-Allow-Headers" : f'{header}'})
        return wrapper
    return decorator

class UserCreation(View):
    @AllowHeaders('username')
    def GET(self, request, **kwargs):
        username = request[0].get("username")
        s = {'error' : "Could not parse username."}
        if(username is not None):
            username = decodeURI(username)
            if(Users.user_exists(username)):
                s = {"error" : "Username {} already exists.".format(username)}
            else:
                s = {'ok' : "Username {} is available".format(username)}
        response = status.HttpJson().__call__(s,200)
        return response

    def OPTIONS(self, request, **kwargs):
        return self.GET(request, **kwargs)

    def POST(self, request, **kwargs):
        username = request[1].get("username")
        password = request[1].get("password")
        avatar = request[1].get("avatar")
    
        # One of the post data was none
        if(None in (username,password,avatar)):
            return status.HttpJson().__call__({"error" : "Username or password or avatar was none, cannot proceed."},400)
        
        # print(username,type(username))
        username = username['data'].read()
        __usr__ = len(username)
        password = password['data'].read()

        if(__usr__ > 16):
            return status.HttpJson().__call__({"error" : "Username too long, must be at most 16 (not {}) ".format(__usr__)},400)   

        cond : bool = 1 <= len(password) <= 100

        if(not cond):
            return status.HttpJson().__call__({"error" : "Password too long, try changing it to something smaller"},400)   

        if Users.user_exists(username):
            return status.HttpJson().__call__({"error" : "Username {} already exists.".format(username)},400)

        try:
            img = Image.open(avatar['data'])
            img = img.thumbnail((128,128), Image.ANTIALIAS)
            # img = img.resize((128,128))
            img_hash = db.hx(db.rn(2,12))
            s_path =  img_hash + "." + avatar['filename'].split(".")[-1]
            path = s('avatars',img_hash) + "." + avatar['filename'].split(".")[-1]
            img.save(path)
        except Exception:
            return status.HttpJson().__call__({'error' : "Could not identify file {} as an image.".format(avatar['filename'])},400)

        Users.create(username,password,f'static/avatars/{s_path}')
        token = Users.create_token(str(Users.id(username)[0]))
        return status.HttpJson().__call__({
            "username" : username,
            "password" : password,
            "img" : f'static/avatars/{s_path}',
            "token" : token
        },200)

class UserIdentify(View):

    @AllowHeaders("key")
    def OPTIONS(self, request, **kwargs):
        cors_headers = request[0].get("Access-Control-Request-Headers")
        if(cors_headers=='key'):
            return status.HttpJson().__call__({"hey" : "world"},200)

    def GET(self, request, **kwargs):
        key = request[0].get("key")
        fetched = list(Users.fetchUser(key))
        if(fetched is None):
            return status.HttpJson().__call__({"error" : f'Not Authenticated'},400)
        return status.HttpJson().__call__(fetched,200)
        

class StaticImageHandler(View):
    def GET(self,request,**kwargs):
        target_path = j(os.getcwd(),"source",*request[0].get("uri").split("/"))
        print(target_path)
        if(os.path.exists(target_path)):
            return status.HttpBinary().__call__(target_path,200,display_in_browser=True)
        return status.HttpJson().__call__({'error' : "404 Not Found"},404)