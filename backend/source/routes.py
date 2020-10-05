from . import views

sock_url_patterns = {
    r"/drawing(\/)?" : views.Drawing()
}

rest_api_patterns = {
    r"/static/(\w+)/(.*)(\/)?" : views.StaticImageHandler(),
    r"/users/create(\/)?" : views.UserCreation()
}