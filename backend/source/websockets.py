from darius.server.routes import SocketView
from .views import Users
from random import randrange
import pprint,json,datetime


class Drawing(SocketView):
    def onConnect(self,client,**kwargs):
        self.accept(client)
        cookies = kwargs.get("headers").get("Cookie")
        if type(cookies) == list:
            for c in cookies:
                if('DARIUSESSIONID' in c):
                    id = c.split("=")[-1]
                    usr = Users.fetchUser(id)
                    if(usr is None):
                        return False
                    break
            else:
                return False
        else:
            if('DARIUSESSIONID' in cookies):
                id = cookies.split("=")[-1]
                usr = Users.fetchUser(id)
                if(usr is None):
                    return False

        config = {
            'type' : 0,
            'score' : 0,
            'id' : usr[0],
            'username' : usr[1],
            'img' : usr[2],
            'color' : [randrange(1,255) for _ in range(3)]
        }
        
        json_config = json.dumps(config)

        self.send(client,json_config)
        for cli in self.clients:
            self.send(cli,json_config)
        
        pprint.pprint([ [ {'type' : 0,**self.clients.get(cli)} for cli in self.clients], config])
        self.send(client,json.dumps([ [{'type' : 0,**self.clients.get(cli)} for cli in self.clients], config]))
        config.pop('type')
        return config

    def onMessage(self,**kwargs):
        data = kwargs.get("data")
        data = json.loads(data)
        now = datetime.datetime.now()
        sender_client = kwargs.get("sender_client")
        data_to_send = {**data,**self.clients.get(sender_client),'date' : f'{now.hour}:{now.minute}'}
        str_data : str = json.dumps(data_to_send)
        for client in self.clients:
            self.send(client, json.dumps(str_data))

    def onExit(self, client , **kwargs):    
        pass