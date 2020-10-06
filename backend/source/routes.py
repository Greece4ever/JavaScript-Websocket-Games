from . import views
from . import websockets

sock_url_patterns = {
    r"/drawing" : websockets.Drawing()
}

rest_api_patterns = {
    r"/static/(\w+)/(.*)(\/)?" : views.StaticImageHandler(),
    r"/users/create(\/)?" : views.UserCreation()
}