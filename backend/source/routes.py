from . import views

sock_url_patterns = {
    r"/drawing(\/)?" : views.Drawing()
}

rest_api_patterns = {
    r"/avatar(\/)?" : views.AvatarUpload(),
    r"/static/(\w+)/(.*)(\/)?" : views.StaticImageHandler()
}