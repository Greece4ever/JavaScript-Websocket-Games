from darius.server.routes import SocketView
from .views import Users
from random import randrange
import pprint,json,datetime

def parseCookies(cookies):
    print(cookies)
    if type(cookies) == list:
        for c in cookies:
            if('DARIUSESSIONID' in c):
                id = c.split("=")[-1]
                usr = Users.fetchUser(id)
                if(usr is None):
                    return False
                return usr
        return False
    else:
        if('DARIUSESSIONID' in cookies):
            id = cookies.split("=")[-1]
            usr = Users.fetchUser(id)
            if(usr is None):
                return False
        return False


class Drawing(SocketView):
    """
        TYPE : 0 ----> CONNECT
        TYPE : 1 ----> CHAT MESSAGE  
        TYPE : 2 ----> CANVAS DATA  
        TYPE : 3 ----> EXIT
"""

    def onConnect(self,client,**kwargs):
        self.accept(client)
        cookies = kwargs.get("headers").get("Cookie")
        usr = parseCookies(cookies)
        print(usr)
        if(not usr): return

        config = {
            'type' : 0,
            'score' : 0,
            'id' : usr[0],
            'username' : usr[1],
            'img' : usr[2],
            'color' : [randrange(1,255) for _ in range(3)]
        }
        
        json_config = json.dumps(config)

        for cli in self.clients:
            self.send(cli,json_config)
        
        # pprint.pprint([ {'type' : 4,**self.clients.get(cli)} for cli in self.clients] + [config])
        self.send(client,json.dumps(
            {
                "type" : 4,
                "data" : [ {**self.clients.get(cli)} for cli in self.clients] + [config],
            }))
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
        cli_state = kwargs.get("client_state")
        cli_state['type'] = 3
        now = datetime.datetime.now()
        cli_state['date'] = f'{now.hour}:{now.minute}'
        for cli in self.clients:
            self.send(cli,json.dumps(cli_state))
        